import { Fragment, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const ConfirmationPayment = (props) => {
  const [category, setCategory] = useState(null);
  const [pagarMeFee, setPagarMeFee] = useState(null);
  const [pixInfo, setPixInfo] = useState(null);
  const pixRef = useRef(null);
  const pixQRRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const pickedCategory = props.event?.categories.filter(
      (category) => category.category_id === props.watch("category")
    )[0];
    setCategory(pickedCategory);
    setPagarMeFee(pickedCategory.category_price / 10);
  }, [props.watch("category")]);

  async function fetchPix() {
    const infoPix = {
      items: [
        {
          amount:
            (category?.category_price + category?.category_price * 0.1) * 100,
          description: `Inscrição ${props.event.event_name}`,
          quantity: 1,
        },
      ],
      customer: {
        name: [props.user.user_first_name, props.user.user_last_name].join(" "),
        email: props.user.user_email,
        type: "individual",
        document: props.user.user_cpf.replace(/[.-]/g, ""),
        phones: {
          home_phone: {
            country_code: "55",
            number: props.user.user_phone.split(" ")[1].replace(/[.-]/g, ""),
            area_code: props.user.user_phone.split(" ")[0],
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
    };
    const { data } = await axios.post(
      "http://localhost:5000/api/payments/",
      infoPix,
      {
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
        },
      }
    );
    console.log(data);
    setPixInfo({
      code: data.charges[0].last_transaction.qr_code,
      qrCode: data.charges[0].last_transaction.qr_code_url,
      orderId: data.id,
    });
  }

  function scrollToItem(id, delay) {
    setTimeout(() => {
      id.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    }, delay);
  }

  async function tokenizeCard() {
    props.setValue("paymentMethod", "credit_card");
    const card = props.getValues("card");
    card.exp_month = Number(card.exp.split("/")[0]);

    card.exp_year = Number(card.exp.split("/")[1]);
    const { exp, name, ...cardToToken } = card;
    const body = {
      card: {
        number: cardToToken.number.replace(/\s/g, ""),
        exp_month: cardToToken.exp_month,
        exp_year: cardToToken.exp_year,
        cvv: cardToToken.cvv,
        holder_name: `${props.user.user_first_name} ${props.user.user_last_name}`,
      },
      type: "card",
    };
    try {
      const { data } = await axios.post(
        `https://api.pagar.me/core/v5/tokens?appId=pk_test_0n79Z9vrc3UEOdpl`,
        body,
        {
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
        }
      );
      props.setValue("cc_token", data.id);
      const { card, ...dataSubmit } = props.getValues();
      props.onSubmit(dataSubmit);
    } catch (error) {
      toast.error("Erro ao processar cartão de crédito", { theme: "colored" });
    }
  }

  useEffect(() => {
    if (pixQRRef.current) {
      scrollToItem(pixQRRef, 1000);
    }
  }, [pixQRRef.current]);

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

  if (!category) return null;

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

  return (
    <Fragment>
      <div className="container">
        <div className="row">
          <div className="col-12 ">
            <ul className="list-group ">
              <li className="list-group-item d-flex justify-content-between align-items-center ">
                <div className="py-2">
                  <div className="fw-semibold">Categoria</div>
                  <small className="text-muted">
                    {category?.category_name} - {props.user.user_gender}
                  </small>
                </div>
                <span className="badge bg-success rounded-pill">
                  R$ {category?.category_price},00
                </span>
              </li>
              {
                <li className="list-group-item d-flex justify-content-between align-items-center ">
                  <div className="py-2">
                    <div className="fw-semibold">Taxa de processamento</div>
                  </div>
                  <span className="badge bg-success rounded-pill">
                    R$ {pagarMeFee},00
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
                  R$ {category?.category_price + pagarMeFee},00
                </span>
              </li>
            </ul>
            {category?.category_price === 0 ? (
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
                  <button className="btn btn-success form-control">
                    Finalizar
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <Tabs
                  defaultActiveKey="pix"
                  id="uncontrolled-tab-example"
                  className="mb-3"
                >
                  <Tab eventKey="pix" title="Pix">
                    <div
                      className="row d-flex mt-2 flex-column flex-lg-row"
                      ref={pixQRRef}
                    >
                      <div className="col-12 d-flex flex-column flex-lg-row justify-content-around align-items-center">
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
                              "Confirmar Pagamento" para efetuar sua inscrição.
                            </li>
                          </ol>
                        </div>
                        {pixInfo ? (
                          <div className="">
                            <PixBox />
                            <button
                              onClick={() => {
                                props.setValue("paymentMethod", "pix");
                                props.setValue("order_id", pixInfo.orderId);
                                props.onSubmit(props.getValues());
                              }}
                              type="submit"
                              className="mt-1 btn btn-success form-control"
                            >
                              Confirmar Pagamento
                            </button>
                          </div>
                        ) : (
                          <Fragment>
                            <button
                              className="btn btn-success my-auto"
                              onClick={(e) => {
                                e.preventDefault();
                                fetchPix();
                              }}
                            >
                              Criar Chave Pix
                            </button>
                          </Fragment>
                        )}
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="cc" title="Cartão de Crédito">
                    <div className="container-fluid">
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
                              {...props.register("card.name")}
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
                              {...props.register("installments")}
                              className="form-select"
                            >
                              <option value={1}>
                                à Vista (R$
                                {(category?.category_price +
                                  category?.category_price * 0.1) /
                                  1}
                                ,00) s/ juros
                              </option>
                              {installments.map((installment) => (
                                <option
                                  value={installment.installments}
                                  key={`installment-${installment.installments}`}
                                >
                                  {installment.installments}x (R$
                                  {Math.ceil(
                                    (category?.category_price +
                                      category?.category_price * 0.1 +
                                      category?.category_price *
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
                              control={props.control}
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
                              control={props.control}
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
                              control={props.control}
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
                            <a href="https://pagar.me" target="_blank">
                              Pagar-me
                            </a>
                            . Não salvamos dados do seu cartão no nosso sistema.
                          </small>
                        </div>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmationPayment;
