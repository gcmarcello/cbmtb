import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import LoadingScreen from "../../utils/loadingScreen";
import { toast } from "react-toastify";

import { fetchPayment, generateNewPayment } from "./functions/fetchPayment";

const Payments = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    async function fetchPaymentInfo() {
      if (searchParams.get("order_id")) {
        const { data } = await axios.get(
          `/api/payments/${searchParams.get("order_id")}`,
          {
            headers: { token: localStorage.token },
          }
        );
        setTimeout(() => {
          if (data.charges[0].payment_method !== "pix") {
            navigate(`/usuario?confirmed=${data.metadata.registrationId}`);
          }
          setPaymentInfo(data);
        }, 5000);
      }
    }
    fetchPaymentInfo();
  }, [searchParams]);

  async function verifyPayment() {
    const { data } = await axios.get(
      `/api/registrations/status/${paymentInfo?.metadata.registrationId}`,
      {
        headers: { token: localStorage.token },
      }
    );
    if (data.type === "success") {
      toast.success(data.message, { theme: "colored" });
      navigate("/usuario");
    } else {
      toast.error(data.message, { theme: "colored" });
    }
  }

  return (
    <Fragment>
      {paymentInfo ? (
        <div className="container my-4">
          <div className="row">
            <div className="column">
              <div className="card">
                <div className="card-header">
                  <h5>QR Code Pix - {paymentInfo.items[0].description}</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-center">
                    <img
                      className="img-fluid"
                      src={paymentInfo.charges[0].last_transaction.qr_code_url}
                      alt="Imagem do QRCode"
                      height={150}
                      width={150}
                    />
                  </div>
                  <h5 className="text-center">
                    Valor:{" "}
                    <strong>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(paymentInfo.charges[0].amount / 100)}
                    </strong>
                  </h5>
                  <h5>Código Pix</h5>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      id="event-link"
                      defaultValue={paymentInfo.charges[0].last_transaction.qr_code}
                      disabled
                    />

                    <button
                      className="btn btn-light border"
                      type="button"
                      id="button-addon1"
                      onClick={() => {
                        const eventLink = document.getElementById("event-link");
                        navigator.clipboard.writeText(eventLink.value);
                        toast.success("Código copiado com sucesso!", {
                          theme: "colored",
                        });
                      }}
                    >
                      <i className="bi bi-clipboard"></i>
                    </button>
                  </div>

                  <button
                    onClick={() => verifyPayment()}
                    className="btn btn-success mt-4 w-100"
                  >
                    Confirmar Pagamento
                  </button>
                  <p className="text-muted mt-1" style={{ fontSize: "14px" }}>
                    O pagamento é confirmado automaticamente. Você pode fechar a página
                    assim que efetuar o pagamento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="d-flex flex-column align-items-center justify-content-center inner-page"
          style={{ minHeight: "300px" }}
        >
          <p className="text-center">Carregando Pagamento...</p>

          <LoadingScreen />
        </div>
      )}
    </Fragment>
  );
};

export default Payments;
