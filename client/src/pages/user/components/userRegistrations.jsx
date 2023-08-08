import React from "react";

import EventInfoModal from "./eventInfoModal";
import PaymentModal from "./paymentModal";

const UserRegistrations = ({ registrations, deleteRegistration, userInfo }) => {
  const dayjs = require("dayjs");

  return (
    <div className="row mt-2">
      <h3>Inscrições Confirmadas</h3>
      <div className="d-flex justify-content-center justify-content-lg-start">
        {registrations.filter(
          (registration) => registration.registration_status === "completed"
        ).length ? (
          registrations
            .filter(
              (registration) => registration.registration_status === "completed"
            )
            .map((registration) => (
              <div
                key={registration.registration_id}
                className="card m-3"
                style={{ width: "18rem" }}
              >
                <img
                  src={registration.event_image}
                  className="card-img-top"
                  alt="..."
                  height={169.73}
                  width={286}
                />
                <hr className="my-0" />
                <div className="card-body">
                  <h5 className="card-title">{registration.event_name}</h5>
                  <span className="fw-bold">Categoria:</span>{" "}
                  {registration.category_name}
                  <br />
                  {/* <span className="fw-bold">Tamanho da Camisa:</span>{" "}
                  {registration.registration_shirt?.toUpperCase()} */}
                  <div className="d-flex">
                    <EventInfoModal
                      registration={registration}
                      userInfo={userInfo}
                    />

                    <button
                      type="button"
                      className="btn btn-danger form-control mt-2 h-50"
                      data-bs-toggle="modal"
                      data-bs-target={`#registration-${registration.registration_id}-cancel`}
                    >
                      Cancelar
                    </button>

                    <div
                      className="modal fade"
                      id={`registration-${registration.registration_id}-cancel`}
                      tabIndex="-1"
                      aria-labelledby="removeRegistrationModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog">
                        <form>
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5
                                className="modal-title"
                                id="removeRegistrationModalLabel"
                              >
                                Cancelar inscrição
                              </h5>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div className="modal-body">
                              <p>
                                Tem certeza que deseja cancelar esta inscrição?
                                Você receberá um e-mail de confirmação do
                                cancelamento. Caso você queira refazer a
                                inscrição, ficará sujeito a disponibilidade no
                                momento da reinscrição!
                              </p>
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                              >
                                Voltar
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() =>
                                  deleteRegistration(
                                    registration.event_id,
                                    registration.registration_id
                                  )
                                }
                                data-bs-dismiss="modal"
                              >
                                Cancelar Inscrição
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    <i className="bi bi-geo-alt-fill"></i>{" "}
                    {registration.event_location}
                  </small>
                  <small className="text-muted">
                    <i className="bi bi-calendar-fill"></i>{" "}
                    {dayjs(registration.event_date_start).format("DD/MM/YYYY")}
                  </small>
                </div>
              </div>
            ))
        ) : (
          <p>Você ainda não completou nenhuma inscrição!</p>
        )}
      </div>
      <h3>Inscrições Pendentes</h3>
      <div>
        {registrations.filter(
          (registration) => registration.registration_status === "pending"
        ).length ? (
          registrations
            .filter(
              (registration) => registration.registration_status === "pending"
            )
            .map((registration) => (
              <div
                key={registration.registration_id}
                className="card m-3"
                style={{ width: "18rem" }}
              >
                <img
                  src={registration.event_image}
                  className="card-img-top"
                  alt="..."
                  height={169.73}
                  width={286}
                />

                <hr className="my-0" />
                <div className="card-body">
                  <h5 className="card-title">{registration.event_name}</h5>
                  <span className="fw-bold">Categoria:</span>{" "}
                  {registration.category_name}
                  <br />
                  {/* <span className="fw-bold">Tamanho da Camisa:</span>{" "}
                  {registration.registration_shirt?.toUpperCase()} */}
                  <div className="d-flex">
                    <PaymentModal registration={registration} />
                    <EventInfoModal registration={registration} />
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    <i className="bi bi-geo-alt-fill"></i>{" "}
                    {registration.event_location}
                  </small>
                  <small className="text-muted">
                    <i className="bi bi-calendar-fill"></i>{" "}
                    {dayjs(registration.event_date_start).format("DD/MM/YYYY")}
                  </small>
                </div>
                {/* <a href={`/eventos/${event.event_link}`} className="btn btn-primary">
                    Inscrições
                  </a> */}
              </div>
            ))
        ) : (
          <p>Você não tem nenhuma inscrição pendente!</p>
        )}
      </div>
    </div>
  );
};

export default UserRegistrations;
