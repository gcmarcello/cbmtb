import React, { Fragment } from "react";
import QRCode from "react-qr-code";

const EventInfoModal = ({ registration, userInfo }) => {
  const dayjs = require("dayjs");
  const qrCodeInfo = registration.registration_id;

  if (!registration || !userInfo) {
    return null;
  }

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn-warning form-control me-2 mt-2 h-50"
        data-bs-toggle="modal"
        data-bs-target={`#info-${registration.registration_id}-modal`}
      >
        Inscrição
      </button>

      <div
        className="modal fade"
        id={`info-${registration.registration_id}-modal`}
        tabIndex="-1"
        aria-labelledby="InfoModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="InfoModalLabel">
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
              <h6>Informações</h6>
              <ul className="list-group mb-3">
                <li className="list-group-item">
                  <i className="bi bi-person-fill"></i>{" "}
                  <span className="fw-bolder">Nome:</span>{" "}
                  {userInfo.user_first_name} {userInfo.user_last_name}
                </li>
                <li className="list-group-item">
                  <i className="bi bi-geo-alt-fill"></i>{" "}
                  <span className="fw-bolder">Local:</span>{" "}
                  {registration.event_location}
                </li>
                <li className="list-group-item">
                  <i className="bi bi-calendar-week-fill"></i>{" "}
                  <span className="fw-bolder">Data:</span>{" "}
                  {dayjs(registration.event_date_start).format("DD/MM/YYYY")}
                </li>
                <li className="list-group-item">
                  <i className="bi bi-people-fill"></i>{" "}
                  <span className="fw-bolder">Categoria:</span>{" "}
                  {registration.category_name}
                </li>
                {registration.registration_shirt ? (
                  <li className="list-group-item">
                    <i className="bi bi-incognito"></i>{" "}
                    <span className="fw-bolder">Tamanho da Camiseta:</span>{" "}
                    {registration.registration_shirt?.toUpperCase()}
                  </li>
                ) : null}
              </ul>
              <div className="mb-3">
                <h6>QR Code da Inscrição</h6>
                <p>
                  Por favor, tenha-o disponível no seu celular ou em uma cópia
                  impressa para facilitar o processo de check-in no dia do
                  evento.
                </p>
              </div>
              <div
                className="d-flex justify-content-center"
                style={{ background: "white", padding: "16px" }}
              >
                <QRCode value={qrCodeInfo} />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EventInfoModal;
