import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import LoadingScreen from "../../utils/loadingScreen";

import config from "../../_config";

const dayjs = require("dayjs");

const EventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({});
  const [records, setRecords] = useState(null);
  const [registrationError, setRegistrationError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRegistration = async () => {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("token", localStorage.token);
    try {
      const response = await fetch(`/api/registrations/${id}/checkreg`, {
        method: "GET",
        headers: myHeaders,
      });
      const parseResponse = await response.json();
      if (parseResponse.type === "error" || parseResponse.type === "alert") {
        setRegistrationError(parseResponse);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const response = await fetch(`/api/events/${id}`, {
        method: "GET",
        headers: myHeaders,
      });

      const parseResponse = await response.json();

      if (parseResponse.type === "error") {
        navigate("/pagina/404");
        return;
      }

      setEvent(parseResponse);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent().then((response) => fetchRegistration()); //eslint-disable-next-line
  }, []);

  useEffect(() => {
    document.title = `${config.entidade.abbreviation} ${
      event.event_name ? `- ${event.event_name}` : ""
    }`;
  }, [event]);

  if (loading === true) {
    return <LoadingScreen />;
  }

  return (
    <Fragment>
      <div className="container inner-page">
        <div className="container my-3">
          <h1 className="mb-3">{event.event_name}</h1>
          <div className="row align-items-top">
            <div className="col-12 col-lg-7">
              <img
                src={event.event_image}
                className="img-fluid rounded"
                alt="Imagem do Evento"
              />
            </div>

            <div className="col-12 col-lg-5 mt-3 mt-lg-0">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Informações do Evento</h5>
                  <ul className="list-group">
                    <li className="list-group-item">
                      <i className="bi bi-calendar-fill fs-4"></i>{" "}
                      <span className="h6">Data:</span> <span></span>{" "}
                      {dayjs(event.event_date_start).format("DD/MM/YYYY - HH:mm")} à{" "}
                      {dayjs(event.event_date_end).format("DD/MM/YYYY - HH:mm")}
                    </li>
                    <li className="list-group-item">
                      <i className="bi bi-geo-alt-fill fs-4"></i>{" "}
                      <span className="h6">Local:</span> <span></span>{" "}
                      {event.event_location}
                    </li>
                  </ul>
                  <div className="mt-3">
                    <h6 className="text-center">Compartilhe nas Redes Sociais!</h6>
                    <div className="input-group my-3">
                      <input
                        type="text"
                        className="form-control"
                        id="event-link"
                        defaultValue={`${window.location.origin}/eventos/${event.event_link}`}
                        disabled
                      />
                      <button
                        className="btn btn-light border"
                        type="button"
                        id="button-addon1"
                        onClick={() => {
                          const eventLink = document.getElementById("event-link");
                          navigator.clipboard.writeText(eventLink.value);
                          toast.success("Link copiado com sucesso!", {
                            theme: "colored",
                          });
                        }}
                      >
                        <i className="bi bi-clipboard"></i>
                      </button>
                    </div>
                  </div>
                  <hr className="mb-3 " />
                  <div className="container">
                    <div className="row">
                      <div className="col-12 d-flex justify-content-center align-items-center px-0">
                        <div className="flex-fill">
                          <button
                            type="button"
                            className={`btn ${
                              registrationError?.type === "error"
                                ? "btn-danger"
                                : registrationError?.type === "alert"
                                ? "btn-warning"
                                : "btn-success"
                            } btn-lg form-control`}
                            disabled={
                              registrationError && registrationError?.type === "error"
                            }
                            onClick={() =>
                              registrationError?.type === "alert"
                                ? navigate(`/usuario`)
                                : event.event_external
                                ? (window.location = `https://${event.event_external}`)
                                : navigate(`/inscricao/${event.event_id}`)
                            }
                          >
                            {registrationError?.type === "error" ||
                            registrationError?.type === "alert" ? (
                              <Fragment>
                                {registrationError?.type === "error" ? (
                                  <i className="me-2 bi bi-x-circle"></i>
                                ) : (
                                  <i className=" me-2 bi bi-exclamation-triangle"></i>
                                )}
                                {registrationError.message}
                              </Fragment>
                            ) : (
                              <>
                                <Fragment>
                                  <i className="bi bi-check-circle"></i> Inscreva-se
                                  {event.categories &&
                                    (event.categories.sort(
                                      (a, b) => a.category_price - b.category_price
                                    )[0].category_price === 0
                                      ? " (Gratuito)"
                                      : ` (À partir de R$${
                                          event.categories.sort(
                                            (a, b) => a.category_price - b.category_price
                                          )[0].category_price
                                        },00)`)}
                                </Fragment>
                              </>
                            )}
                          </button>
                          {event.enableteamregistration && (
                            <button
                              onClick={() =>
                                event.event_external
                                  ? (window.location = `https://${event.event_external}?team=true`)
                                  : navigate(`/inscricao/${event.event_id}?team=true`)
                              }
                              className="btn btn-lg btn-secondary mt-2 w-100 p-2"
                            >
                              <i className="bi bi-clipboard2-check"></i> Inscrição de
                              Equipe
                            </button>
                          )}
                          {event.media && (
                            <Link to={`/eventos/${event.event_id}/midias`}>
                              <button className="btn btn-primary btn-lg form-control mt-3">
                                <i className="bi bi-images"></i> Mídias do Evento
                              </button>
                            </Link>
                          )}
                          {event.showattendees && (
                            <Link to={`/eventos/${event.event_link}/inscritos`}>
                              <button className="btn btn-outline-primary btn-lg form-control mt-3">
                                <i className="bi bi-people-fill"></i> Lista de Inscritos
                              </button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row my-5">
            <div className="accordion" id="accordionExample">
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingOne">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    Descrição do Evento
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    {event.event_description ? (
                      <div
                        className="custom-html"
                        dangerouslySetInnerHTML={{
                          __html: event.event_description,
                        }}
                      ></div>
                    ) : (
                      <span>Nada por aqui.</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingTwo">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    Regulamento
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    {event.event_rules ? (
                      <div
                        className="custom-html"
                        dangerouslySetInnerHTML={{ __html: event.event_rules }}
                      ></div>
                    ) : (
                      <span>Nada por aqui.</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingThree">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree"
                    aria-expanded="false"
                    aria-controls="collapseThree"
                  >
                    Detalhes
                  </button>
                </h2>
                <div
                  id="collapseThree"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingThree"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    {event.event_details ? (
                      <div
                        className="custom-html"
                        dangerouslySetInnerHTML={{
                          __html: event.event_details,
                        }}
                      ></div>
                    ) : (
                      <span>Nada por aqui.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EventPage;
