import React, { Fragment, useEffect, useRef, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Controller, set, useForm } from "react-hook-form";
import InputMask from "react-input-mask";
const relativeTime = require("dayjs/plugin/relativeTime");
const dayjs = require("dayjs");
dayjs.extend(relativeTime);

const PaymentModal = ({ registration, userInfo, lockedRegistration }) => {
  const [pagarMeFee, setPagarMeFee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPagarMeFee(Math.floor(registration.category_price / 10, 1));
  }, []);

  async function generateNewPayment() {
    try {
      setIsLoading(true);
      const { data: parseResponse } = await axios.put(
        `/api/registrations/${registration.registration_id}/payment`,
        null,
        { headers: { token: localStorage.token } }
      );

      if (parseResponse.type !== "error" && parseResponse.data) {
        window.open(parseResponse.data, "_self");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn-success form-control me-2 mt-2 h-50"
        data-bs-toggle="modal"
        data-bs-target={`#paymentModal-${registration.registration_id}`}
        disabled={lockedRegistration === registration.payment_id}
      >
        Pagar
      </button>

      <div
        className="modal fade"
        id={`paymentModal-${registration.registration_id}`}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {registration.event_name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
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
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(
                            registration.coupon ? 0 : registration?.category_price
                          )}
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
                              registration.coupon || !registration?.category_price
                                ? 0
                                : pagarMeFee
                            )}
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
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(
                            registration.coupon || !registration?.category_price
                              ? 0
                              : registration?.category_price + pagarMeFee
                          )}
                        </span>
                      </li>
                    </ul>
                    {registration?.category_price === 0 || registration.coupon ? (
                      <div>
                        <div className="mt-2">
                          <p className="text-justify">
                            A inscrição neste evento é gratuita. Ao clicar em 'finalizar',
                            sua inscrição será confirmada e você será redirecionado para o
                            seu perfil. Você receberá a confirmação da inscrição por
                            e-mail e ela também estará disponível no seu perfil.
                          </p>
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                          <button className="btn btn-success form-control">
                            Finalizar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="d-flex-column d-lg-flex-row mt-2 mx-1 align-items-center justify-content-between">
                        <button
                          disabled={isLoading}
                          onClick={() => generateNewPayment()}
                          className="btn btn-success my-auto w-100"
                        >
                          <i className="bi bi-lock-fill"></i> Prosseguir para o pagamento{" "}
                          {isLoading && (
                            <div
                              class="ms-1 spinner-border spinner-border-sm"
                              role="status"
                            ></div>
                          )}
                        </button>
                        <div className="d-flex align-items-end">
                          <span className="me-2 fst-italic text-muted">
                            Processado via
                          </span>
                          <img
                            src="https://dka575ofm4ao0.cloudfront.net/pages-transactional_logos/retina/1949/PagarMe_Logo_PRINCIPAL-02.png"
                            alt=""
                            className="mt-3"
                            height={30}
                            width={110}
                          />
                        </div>
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
