import React, { Fragment } from "react";

const EventInfoModal = ({ registration }) => {
  const dayjs = require("dayjs");
  return (
    <Fragment>
      <button type="button" className="btn btn-warning form-control me-2 mt-2 h-50" data-bs-toggle="modal" data-bs-target="#InfoModal">
        Informações
      </button>

      <div className="modal fade" id="InfoModal" tabIndex="-1" aria-labelledby="InfoModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="InfoModalLabel">
                {registration.event_name}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <h6>Informações</h6>
              <ul className="list-group mb-3">
                <li className="list-group-item">
                  <i className="bi bi-geo-alt-fill"></i> <span className="fw-bolder">Local:</span> {registration.event_location}
                </li>
                <li className="list-group-item">
                  <i className="bi bi-calendar-week-fill"></i> <span className="fw-bolder">Data:</span>{" "}
                  {dayjs(registration.event_date_start).format("DD/MM/YYYY")}
                </li>
                <li className="list-group-item">
                  <i className="bi bi-people-fill"></i> <span className="fw-bolder">Categoria:</span> {registration.category_name}
                </li>
                <li className="list-group-item">
                  <i className="bi bi-incognito"></i> <span className="fw-bolder">Tamanho da Camiseta:</span>{" "}
                  {registration.registration_shirt.toUpperCase()}
                </li>
              </ul>
              <div className="container">
                <h6>Informações da Prova</h6>
                <div
                  dangerouslySetInnerHTML={{ __html: registration.event_description }}
                  className="overflow-auto mb-3"
                  style={{ maxHeight: "200px" }}
                ></div>

                <h6>Regulamento</h6>
                <div dangerouslySetInnerHTML={{ __html: registration.event_rules }} className="overflow-auto" style={{ maxHeight: "200px" }}></div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
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
