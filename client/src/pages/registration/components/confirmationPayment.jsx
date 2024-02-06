import { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const ConfirmationPayment = (props) => {
  const [category, setCategory] = useState(null);
  const [pagarMeFee, setPagarMeFee] = useState(null);

  useEffect(() => {
    const pickedCategory = props.event?.categories.filter(
      (category) => category.category_id === props.watch("category")
    )[0];
    setCategory(pickedCategory);
    setPagarMeFee(Math.max(pickedCategory.category_price / 10, 1));
  }, [props.watch("category")]);

  if (!category) return null;

  return (
    <Fragment>
      <div className="container">
        <div className="row">
          <div className="col-12 ">
            {!props.isTeam && (
              <ul className="list-group ">
                <li className="list-group-item d-flex justify-content-between align-items-center ">
                  <div className="py-2">
                    <div className="fw-semibold">Categoria</div>
                    <small className="text-muted">
                      {category?.category_name} - {props.user.user_gender}{" "}
                      {props.getValues("registration_team")
                        ? props.getValues("registration_team")
                        : ""}
                    </small>
                  </div>
                  <span className="badge bg-success rounded-pill">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(props.coupon ? 0 : category?.category_price)}
                  </span>
                </li>
                {
                  <li className="list-group-item d-flex justify-content-between align-items-center ">
                    <div className="py-2">
                      <div className="fw-semibold">Taxa de processamento</div>
                    </div>
                    <span className="badge bg-success rounded-pill">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(
                        props.coupon || !category?.category_price ? 0 : pagarMeFee
                      )}
                    </span>
                  </li>
                }
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="py-2">
                    <div className="fw-semibold">Kit do Evento</div>{" "}
                    <small className="text-muted">
                      Tamanho {props.watch("registrationShirt").toUpperCase()}
                    </small>
                  </div>

                  <span className="badge bg-success rounded-pill">R$ 0,00</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="">
                    <div className="fw-semibold">Total</div>{" "}
                    {/* <small className="text-muted">
                      Tamanho {props.watch("registrationShirt").toUpperCase()}
                    </small> */}
                  </div>

                  <span className="">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(
                      props.coupon || !category?.category_price
                        ? 0
                        : category?.category_price + pagarMeFee
                    )}
                  </span>
                </li>
              </ul>
            )}
            {
              category?.category_price === 0 || props.coupon ? (
                <div>
                  <div className="mt-2">
                    <p className="text-justify">
                      A inscrição neste evento é gratuita. Ao clicar em 'finalizar', sua
                      inscrição será confirmada e você será redirecionado para o seu
                      perfil. Você receberá a confirmação da inscrição por e-mail e ela
                      também estará disponível no seu perfil.
                    </p>
                  </div>
                  <div className="d-flex justify-content-end mt-3">
                    <button className="btn btn-success form-control">Finalizar</button>
                  </div>
                </div>
              ) : props.isTeam ? (
                <div className="my-3 flex flex-col">
                  <label htmlFor="registration_group">Nome da Equipe</label>
                  <input
                    {...props.register("registration_group", {
                      required: true,
                      minLength: 3,
                    })}
                    type="text"
                    id="registration_group"
                    className={`form-control ${
                      props.errors?.registration_group
                        ? "is-invalid"
                        : props.getValues("registration_group")
                        ? "is-valid"
                        : ""
                    }`}
                  />
                  <div className="mt-2 text-muted text-justify">
                    Sua inscrição será realizada, porém permanecerá pendente até o
                    pagamento. Os organizadores que desejarem efetuar o pagamento da
                    equipe, devem entrar em contato com a CBMTB através da ouvidoria.
                  </div>
                  {props.watch("registration_group") ? (
                    <button
                      disabled={props.isLoading}
                      type="submit"
                      className="btn w-100 mt-2 btn-success my-auto"
                    >
                      Realizar Inscrição
                    </button>
                  ) : null}
                </div>
              ) : (
                <div className="container mt-3">
                  <div className="row">
                    <div className="d-md-block col-md-6">
                      <div className="mb-3">
                        <p>
                          Clique no botão verde para ser redirecionado para a plataforma
                          da{" "}
                          <span className="text-success ">
                            <strong>Pagar.me</strong>
                          </span>{" "}
                          para finalizar o pagamento.
                        </p>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 ">
                      <div className="d-flex flex-column">
                        <button
                          disabled={props.isLoading}
                          type="submit"
                          className="btn btn-success my-auto"
                        >
                          <i className="bi bi-lock-fill"></i> Prosseguir para o pagamento
                        </button>
                        <div className="d-flex align-items-center mt-2">
                          <p className="text-muted mb-0 fs-6">
                            Após o pagamento, sua inscrição será confirmada
                            automaticamente!
                          </p>
                          <img
                            src="https://dka575ofm4ao0.cloudfront.net/pages-transactional_logos/retina/1949/PagarMe_Logo_PRINCIPAL-02.png"
                            alt=""
                            className="ms-3"
                            height={30}
                            width={110}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) /* (
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
                      <div className="col-12 d-flex flex-column flex-lg-row justify-content-around align-items-center">
                        <div className="d-flex">
                          <ol
                            ref={pixRef}
                            className={pixInfo?.qrCode ? "d-none d-lg-block" : "d-block"}
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
                              Depois de efetuar o pagamento, clique em "Confirmar
                              Pagamento" para efetuar sua inscrição.{" "}
                              <div className="text-danger fw-bold">
                                Caso você feche a página, é necessário confirmar o
                                pagamento no seu perfil.
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
                                await verifyRegistration();
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
                              onClick={async (e) => {
                                e.preventDefault();
                                const info = await fetchPix();
                                await props.onSubmit({
                                  ...props.getValues(),
                                  paymentMethod: "pix",
                                  payment_id: info.orderId,
                                });
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
                                {Math.ceil(
                                  category?.category_price +
                                    category?.category_price * 0.1
                                ) / 1}
                                ,00) s/ juros
                              </option>
                              {installments
                                .filter(
                                  (i) =>
                                    i.installments <=
                                    category?.category_price + Math.ceil(pagarMeFee)
                                )
                                .map((installment) => (
                                  <option
                                    value={installment.installments}
                                    key={`installment-${installment.installments}`}
                                  >
                                    {installment.installments}x (R$
                                    {Math.ceil(
                                      (category?.category_price +
                                        category?.category_price * 0.1 +
                                        category?.category_price * installment.tax) /
                                        installment.installments
                                    )}
                                    ,00) {!installment.tax ? "s/ juros" : "c/ juros"}
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
                                  {(inputProps) => <input {...inputProps} type="text" />}
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
                                  {(inputProps) => <input {...inputProps} type="text" />}
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
                                  {(inputProps) => <input {...inputProps} type="text" />}
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
                            <a href="https://pagar.me" target="_blank" rel="noreferrer">
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
            ) */
            }
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmationPayment;
