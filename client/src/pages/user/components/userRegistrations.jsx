import React from "react";
import EventInfoModal from "./eventInfoModal";

import PaymentModal from "./paymentModal";

const UserRegistrations = ({ registrations }) => {
  return (
    <div className="row mt-2">
      <h3>Inscrições Confirmadas</h3>
      <div className="d-flex justify-content-center justify-content-lg-start">
        {registrations.filter((registration) => registration.registration_status === "completed").length ? (
          registrations
            .filter((registration) => registration.registration_status === "completed")
            .map((registration) => (
              <div key={registration.registration_id} className="card m-3" style={{ width: "18rem" }}>
                <img src={registration.event_image} className="card-img-top" alt="..." height={169.73} width={286} />

                <hr className="my-0" />
                <div className="card-body">
                  <h5 className="card-title">{registration.event_name}</h5>
                  <span className="fw-bold">Categoria:</span> {registration.category_name}
                  <br />
                  <span className="fw-bold">Tamanho da Camisa:</span> {registration.registration_shirt.toUpperCase()}
                  <div className="d-flex">
                    <EventInfoModal registration={registration} />
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    <i className="bi bi-geo-alt-fill"></i> {registration.event_location}
                  </small>
                  <small className="text-muted">
                    <i className="bi bi-calendar-fill"></i> {registration.formattedDate}
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
        {registrations.filter((registration) => registration.registration_status === "pending").length ? (
          registrations
            .filter((registration) => registration.registration_status === "pending")
            .map((registration) => (
              <div key={registration.registration_id} className="card m-3" style={{ width: "18rem" }}>
                <img src={registration.event_image} className="card-img-top" alt="..." height={169.73} width={286} />

                <hr className="my-0" />
                <div className="card-body">
                  <h5 className="card-title">{registration.event_name}</h5>
                  <span className="fw-bold">Categoria:</span> {registration.category_name}
                  <br />
                  <span className="fw-bold">Tamanho da Camisa:</span> {registration.registration_shirt.toUpperCase()}
                  <div className="d-flex">
                    <PaymentModal registration={registration} />
                    <EventInfoModal registration={registration} />
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    <i className="bi bi-geo-alt-fill"></i> {registration.event_location}
                  </small>
                  <small className="text-muted">
                    <i className="bi bi-calendar-fill"></i> {registration.formattedDate}
                  </small>
                </div>
                {/* <a href={`/evento/${event.event_link}`} className="btn btn-primary">
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
