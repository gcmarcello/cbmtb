import React, { Fragment, useEffect, useRef, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import InputMask from "react-input-mask";
const relativeTime = require("dayjs/plugin/relativeTime");
const dayjs = require("dayjs");
dayjs.extend(relativeTime);

const PaymentModal = ({ registration, userInfo }) => {
  const [pixInfo, setPixInfo] = useState(null);
  const [typeTab, setTypeTab] = useState(localStorage.paymentType || 'pix');
  const [pagarMeFee, setPagarMeFee] = useState(null);
  const pixRef = useRef(null);
  const pixQRRef = useRef(null);
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const form = useForm({mode: "onChange",
  defaultValues: { paymentMethod: "", order_id: "", card:{name:""} },})

  async function fetchPix() {
    const tax =
      registration?.category_price > 1 ? registration?.category_price * 0.1 : 0;
    const infoPix = {
      items: [
        {
          amount: (registration?.category_price + tax) * 100,
          description: `Inscrição ${registration.event_name}`,
          quantity: 1,
        },
      ],
      customer: {
        name: [userInfo.user_first_name, userInfo.user_last_name].join(" "),
        email: userInfo.user_email,
        type: "individual",
        document: userInfo.user_cpf.replace(/[.-]/g, ""),
        phones: {
          home_phone: {
            country_code: "55",
            number: userInfo.user_phone.split(" ")[1].replace(/[.-]/g, ""),
            area_code: userInfo.user_phone.split(" ")[0],
          },
        },
      },
      payments: [
        {
          payment_method: "pix",
          pix: {
            expires_in: "600",
          },
        },
      ],
      metadata: {
        event_id: registration.event_id,
        user_id: userInfo.user_id,
        registration_id: registration.registration_id,
      },
    };
    const { data } = await axios.post("/api/payments/", infoPix, {
      headers: {
        "Content-Type": "application/json",
        token: localStorage.token,
      },
    });


    
    if (!data.charges) return;
    const info = {
      code: data?.charges[0]?.last_transaction.qr_code,
      qrCode: data?.charges[0]?.last_transaction.qr_code_url,
      orderId: data?.id,
    }
    setPixInfo(info);
    return info
  }

  const PixBox = () => {
    return (
      <div className="d-flex flex-column">
        <img className="img-fluid" src={pixInfo.qrCode} alt="QR Code Pix" />
        <div className="input-group mb-3">
          <input
            className="form-control"
            defaultValue={pixInfo.code}
            readOnly
            id="pix-code"
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            id="button-addon2"
            onClick={() => navigator.clipboard.writeText(pixInfo.code)}
          >
            <i className="bi bi-clipboard2-check-fill"></i>
          </button>
        </div>
      </div>
    );
  };

  const onSubmit = async (data) => {
    if (!data.card) data.card = {};
    console.log(data);
    const { card, ...rest } = data;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("token", localStorage.token);
    
    try {
      const response = await fetch(
        `/api/registrations/${registration.event_id}/${registration.coupon ? registration.coupon : ""}`,
        {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({...rest, metadata: {registration_id: registration.registration_id}}),
        }
      );
      const parseResponse = await response.json();
      if (parseResponse.type !== "error" && data.paymentMethod !== "pix") {
        navigate(0);
      }
      if (data.paymentMethod !== "pix") toast[parseResponse.type](parseResponse.message, { theme: "colored" });
      if(parseResponse.type === "error") {
        form.resetField('card.name')
        form.resetField('card.number')
        form.resetField('card.cvv')
        form.resetField('card.name')
        form.resetField('card.exp')
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function verifyRegistration(){
    const { data } = await axios.get(`/api/registrations/status/${registration.event_id}`, {
      headers: {
        "Content-Type": "application/json",
        token: localStorage.token,
      },
    });
    if (data) {
      toast[data.type](data.message, {
        theme: "colored",
      });

      if(data.type === 'success'){
        navigate(0);
      }
    }
  }

  async function tokenizeCard() {
    form.setValue("paymentMethod", "credit_card");
    const card = form.getValues("card");
    card.exp_month = Number(card.exp.split("/")[0]);

    card.exp_year = Number(card.exp.split("/")[1]);
    const { exp, name, ...cardToToken } = card;
    const body = {
      card: {
        number: cardToToken.number.replace(/\s/g, ""),
        exp_month: cardToToken.exp_month,
        exp_year: cardToToken.exp_year,
        cvv: cardToToken.cvv,
        holder_name: `${userInfo.user_first_name} ${userInfo.user_last_name}`,
      },
      type: "card",
    };
    try {
      const { data } = await axios
        .post(
          `https://api.pagar.me/core/v5/tokens?appId=${
            process.env.NODE_ENV === "production"
              ? "pk_21Jg5yqdcpfm5BVY"
              : "pk_test_e7k98YOSmS0EoJxr"
          }`,
          body,
          {
            headers: {
              accept: "application/json",
              "content-type": "application/json",
            },
          }
        )
        .catch((error) => {
          console.log(error);
          toast.error("Erro ao processar cartão de crédito", {
            theme: "colored",
          });
        });
      form.setValue("cc_token", data.id);
      const { card, ...dataSubmit } = form.getValues();
      onSubmit(dataSubmit);
    } catch (error) {
      toast.error("Erro ao processar cartão de crédito", { theme: "colored" });
    }
  }

  const installments = [
    { installments: 2, tax: 0 },
    { installments: 3, tax: 0 },
    { installments: 4, tax: 0.1 },
    { installments: 5, tax: 0.1 },
    { installments: 6, tax: 0.1 },
    { installments: 7, tax: 0.2 },
    { installments: 8, tax: 0.2 },
    { installments: 9, tax: 0.2 },
    { installments: 10, tax: 0.3 },
    { installments: 11, tax: 0.3 },
    { installments: 12, tax: 0.3 },
  ];

  useEffect(() => {setPagarMeFee(Math.max(registration.category_price / 10, 1));},[])

  useEffect(() => {
    if (userInfo) {
      form.setValue("firstName", userInfo.user_first_name);
      form.setValue("lastName", userInfo.user_last_name);
      form.setValue("email", userInfo.user_email);
      form.setValue("cpf", userInfo.user_cpf);
      form.setValue("phone", userInfo.user_phone);
      form.setValue("gender", userInfo.user_gender);
      form.setValue("birthDate", dayjs(userInfo.user_birth_date).format("YYYY-MM-DD"));
      form.setValue("cep", userInfo.user_cep);
      form.setValue("state", userInfo.user_state);
      form.setValue("city", userInfo.user_city);
      form.setValue("address", userInfo.user_address);
      form.setValue("number", userInfo.user_number);
      form.setValue("apartment", userInfo.user_apartment);
    }
  }, [userInfo]);

  return (
    <Fragment>
      <button type="button" className="btn btn-success form-control me-2 mt-2 h-50" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Pagar
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {registration.event_name}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            <div className="container">
        <div className="row">
          <div className="col-12 ">
            <ul className="list-group ">
              <li className="list-group-item d-flex justify-content-between align-items-center ">
                <div className="py-2">
                  <div className="fw-semibold">Categoria</div>
                  <small className="text-muted">
                    {registration?.category_name} - {userInfo.user_gender}
                  </small>
                </div>
                <span className="badge bg-success rounded-pill">
                  R$ {registration.coupon ? 0 : registration?.category_price},00
                </span>
              </li>
              {
                <li className="list-group-item d-flex justify-content-between align-items-center ">
                  <div className="py-2">
                    <div className="fw-semibold">Taxa de processamento</div>
                  </div>
                  <span className="badge bg-success rounded-pill">
                    R$ {Math.ceil(registration.coupon || !registration?.category_price ? 0 : pagarMeFee)},00
                  </span>
                </li>
              }
              {/* <li className="list-group-item d-flex justify-content-between align-items-center">
                <div className="py-2">
                  <div className="fw-semibold">Kit do Evento</div>{" "}
                  <small className="text-muted">
                    Tamanho {props.watch("registrationShirt").toUpperCase()}
                  </small>
                </div>

                <span className="badge bg-success rounded-pill">R$ 0,00</span>
              </li> */}
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <div className="">
                  <div className="fw-semibold">Total</div>{" "}
                  {/* <small className="text-muted">Tamanho {props.watch("registrationShirt").toUpperCase()}</small> */}
                </div>

                <span className="">
                  R${" "}
                  {registration.coupon || !registration?.category_price
                    ? 0
                    : registration?.category_price + Math.ceil(pagarMeFee)}
                  ,00
                </span>
              </li>
            </ul>
            {registration?.category_price === 0 || registration.coupon ? (
              <div>
                <div className="mt-2">
                  <p className="text-justify">
                    A inscrição neste evento é gratuita. Ao clicar em
                    'finalizar', sua inscrição será confirmada e você será
                    redirecionado para o seu perfil. Você receberá a confirmação
                    da inscrição por e-mail e ela também estará disponível no
                    seu perfil.
                  </p>
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <button className="btn btn-success form-control" >
                    Finalizar
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <Tabs
                  activeKey={typeTab}
                  onSelect={(k) => {
                    setTypeTab(k);
                    localStorage.paymentType = k;
                  }}
                  id="uncontrolled-tab-example"
                  className="mb-3"
                >
                  <Tab eventKey="pix" title="Pix">
                    <div
                      className="row d-flex mt-2 flex-column flex-lg-row"
                      ref={pixQRRef}
                    >
                      <div className="col-12 d-flex flex-column justify-content-around align-items-center">
                        <div className="d-flex">
                          <ol
                            ref={pixRef}
                            className={
                              pixInfo?.qrCode ? "d-none d-lg-block" : "d-block"
                            }
                          >
                            <li className="my-2">
                              Aperte o botão verde "Criar Chave Pix".
                            </li>
                            <li className="my-2">
                              Abra o aplicativo do seu banco no seu celular.
                            </li>
                            <li className="my-2">
                              Copie a chave ou scaneie o QR Code para pagar.
                            </li>
                            <li className="my-2">
                              Depois de efetuar o pagamento, clique em
                              "Confirmar Pagamento" para efetuar sua inscrição.{" "}
                              <div className="text-danger fw-bold">
                                Caso você feche a página, é necessário confirmar
                                o pagamento no seu perfil.
                              </div>
                            </li>
                          </ol>
                        </div>
                        {pixInfo ? (
                          <div className="">
                            <PixBox />
                            <button
                              onClick={async (e) => {
                                e.preventDefault();
                                await verifyRegistration()
                                
                              }}
                              type="submit"
                              className="mt-1 btn btn-success form-control"
                            >
                              Confirmar Pagamento
                            </button>
                          </div>
                        ) : (
                          <Fragment>
                            <div className="d-flex w-100">
                              <button
                              className="btn btn-success my-auto w-100"
                              onClick={async (e) => {
                                e.preventDefault();
                                const info = await fetchPix()
                                onSubmit({...form.getValues(), paymentMethod: "pix", payment_id: info.orderId});
                              }}
                            >
                              Criar Chave Pix
                            </button>
                            </div>
                          </Fragment>
                        )}
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="cc" title="Cartão de Crédito">
                    <form onSubmit={onSubmit} className="container-fluid">
                      <div className="row">
                        <div className="col-12 col-lg-6">
                          <div className="my-2">
                            <label
                              htmlFor="exampleFormControlInput1"
                              className="form-label"
                            >
                              Nome no cartão
                            </label>
                            <input
                              {...form.register("card.name", {required:true})}
                              type="card"
                              className="form-control"
                              id="card"
                              placeholder="ex: João Silva"
                            />
                          </div>
                        </div>
                        <div className="col-12 col-lg-6">
                          <div className="my-2">
                            <label
                              htmlFor="exampleFormControlInput1"
                              className="form-label"
                            >
                              Parcelas
                            </label>
                            <select
                              {...form.register("installments", {required:true})}
                              className="form-select"
                            >
                              <option value={1}>
                                à Vista (R$
                                {Math.ceil(
                                  registration?.category_price +
                                  registration?.category_price * 0.1
                                ) / 1}
                                ,00) s/ juros
                              </option>
                              {installments
                                .filter(
                                  (i) =>
                                    i.installments <=
                                    registration?.category_price +
                                      Math.ceil(pagarMeFee)
                                )
                                .map((installment) => (
                                  <option
                                    value={installment.installments}
                                    key={`installment-${installment.installments}`}
                                  >
                                    {installment.installments}x (R$
                                    {Math.ceil(
                                      (registration?.category_price +
                                        registration?.category_price * 0.1 +
                                        registration?.category_price *
                                          installment.tax) /
                                        installment.installments
                                    )}
                                    ,00){" "}
                                    {!installment.tax ? "s/ juros" : "c/ juros"}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-12 col-lg-6">
                          <div className="my-2" ref={cardRef}>
                            <label
                              htmlFor="exampleFormControlInput1"
                              className="form-label"
                            >
                              Número do cartão
                            </label>
                            <Controller
                              name="card.number"
                              control={form.control}
                              rules={{required:true}}
                              defaultValue=""
                              render={({ field }) => (
                                <InputMask
                                  mask="9999 9999 9999 9999"
                                  placeholder="0000 0000 0000 0000"
                                  className={`form-control`}
                                  maskChar=""
                                  value={field.value}
                                  onChange={field.onChange}
                                >
                                  {(inputProps) => (
                                    <input {...inputProps} type="text" />
                                  )}
                                </InputMask>
                              )}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-lg-3">
                          <div className="my-2">
                            <label
                              htmlFor="exampleFormControlInput1"
                              className="form-label"
                            >
                              Validade
                            </label>
                            <Controller
                              name="card.exp"
                              control={form.control}
                              defaultValue=""
                              rules={{
                                required: true,
                              }}
                              render={({ field }) => (
                                <InputMask
                                  mask="99/99"
                                  placeholder="01/25"
                                  className={`form-control`}
                                  maskChar=""
                                  value={field.value}
                                  onChange={field.onChange}
                                  id="exp"
                                >
                                  {(inputProps) => (
                                    <input {...inputProps} type="text" />
                                  )}
                                </InputMask>
                              )}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-lg-3">
                          <div className="my-2">
                            <label
                              htmlFor="exampleFormControlInput1"
                              className="form-label"
                            >
                              CVV
                            </label>
                            <Controller
                              name="card.cvv"
                              control={form.control}
                              defaultValue=""
                              rules={{
                                required: true,
                              }}
                              render={({ field }) => (
                                <InputMask
                                  mask="9999"
                                  placeholder="000"
                                  className={`form-control`}
                                  maskChar=""
                                  value={field.value}
                                  onChange={field.onChange}
                                  id="cvv"
                                >
                                  {(inputProps) => (
                                    <input {...inputProps} type="text" />
                                  )}
                                </InputMask>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12 mt-2">
                          <button
                          disabled={!form.formState.isValid}
                            onClick={(e) => {
                              e.preventDefault();
                              tokenizeCard();
                            }}
                            className="btn btn-success form-control"
                          >
                            Finalizar
                          </button>
                        </div>
                        <div className="col-12 mt-2">
                          <small className="text-muted">
                            As transações via cartão são processadas 100% via{" "}
                            <a href="https://pagar.me" target="_blank" rel="noreferrer">
                              Pagar-me
                            </a>
                            . Não salvamos dados do seu cartão no nosso sistema.
                          </small>
                        </div>
                      </div>
                    </form>
                  </Tab>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
            </div>
            {/* <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Fechar
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PaymentModal;
