import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingScreen from "../../utils/loadingScreen";
import { toast } from "react-toastify";

import { fetchPayment, generateNewPayment } from "./functions/fetchPayment";

const Payments = ({ id, registration }) => {
  const navigate = useNavigate();
  const { linkId } = useParams();
  const [payment, setPayment] = useState("");
  const [pageType, setPageType] = useState("");
  const [expirationTime, setExpirationTime] = useState();
  const [pixInfo, setPixInfo] = useState(null);

  

  useEffect(() => {},[])


  return (
    <Fragment>
      <div className="">
        {payment ? (
          <div
            className={` ${
              pageType === "pagamento" ? "w-50 mt-3 inner-page" : ""
            }`}
          >
            <p>
              {pageType ? (
                <div>
                  Nesse momento sua inscrição se encontra pendente. Uma vez que
                  o seu pagamento seja processado, sua inscrição será
                  confirmada! <br />
                  Retorne à essa página a qualquer momento através do seu
                  perfil, ou <a href="/usuario">clicando aqui.</a>
                </div>
              ) : (
                ""
              )}
            </p>
            <h5 className="text-center">
              Valor:{" "}
              <strong>{`R$${payment.valor.original.replace(
                /\./g,
                ","
              )}`}</strong>
            </h5>
            <h5>QR Code Pix</h5>
            <div className="d-flex justify-content-center">
              <img
                className="img-fluid"
                src={payment.imagemQrcode}
                alt="Imagem do QRCode"
              />
            </div>

            <h5>Código Pix</h5>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                id="event-link"
                defaultValue={payment.qrcode}
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
            <div className="text-center mt-2">
              <span>Código válido até: </span>
              <span className="fw-bolder">{`${expirationTime
                .getDate()
                .toString()}/${expirationTime
                .getMonth()
                .toString()
                .padStart(2, "0")}/${expirationTime
                .getFullYear()
                .toString()} - ${expirationTime
                .getHours()
                .toString()
                .padStart(2, "0")}:${expirationTime
                .getMinutes()
                .toString()
                .padStart(2, "0")}`}</span>
            </div>
            <hr />
            
          </div>
        ) : (
          <div
            className="d-flex flex-column align-items-center justify-content-center inner-page"
            style={{ minHeight: "300px" }}
          >
            <p className="text-center">Carregando chave PIX...</p>
            
            <LoadingScreen />
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Payments;
