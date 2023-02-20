import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserNavigation from "../../utils/userNavigation";
import { toast } from "react-toastify";

import LoadingScreen from "../../utils/loadingScreen";
import Footer from "../../utils/footer";

const EventPage = ({ userAuthentication, userName }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({});
  const [registration, setRegistration] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchRegistration = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("token", localStorage.token);
    try {
      const response = await fetch(`/api/registrations/${id}/checkreg`, {
        method: "GET",
        headers: myHeaders,
      });
      const parseResponse = await response.json();
      if (parseResponse.type === "error") {
        setRegistration(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const response = await fetch(`/api/events/view/${id}`, {
        method: "GET",
        headers: myHeaders,
      });

      const parseResponse = await response.json();
      if (typeof parseResponse === "string") {
        navigate("/404");
        return;
      }
      let dateToParse = new Date(parseResponse.event_date);
      let dateToParseDay = String(dateToParse.getDate()).padStart(2, 0);
      let dateToParseMonth = String(dateToParse.getMonth() + 1).padStart(2, 0);
      let dateToParseYear = String(dateToParse.getFullYear());
      parseResponse.formattedDate = `${dateToParseDay}/${dateToParseMonth}/${dateToParseYear}`;
      setEvent(parseResponse);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRegistration(); // eslint-disable-next-line
  }, []);
  useEffect(() => {
    fetchEvent(); // eslint-disable-next-line
  }, []);

  useEffect(() => {
    document.title = `CBMTB ${event.event_name ? `- ${event.event_name}` : ""}`;
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
            <div className="col-12 col-lg-7 mb-3 mb-lg-0">
              <img src={event.event_image} className="img-fluid rounded" alt="Imagem do Evento" />
            </div>

            <div className="col-12 col-lg-5 ">
              <div className="card" style={{ height: "100%" }}>
                <div className="card-body">
                  <h5 className="card-title">Informações do Evento</h5>
                  <ul className="list-group">
                    <li className="list-group-item">
                      <i className="bi bi-calendar-fill fs-4"></i> <span className="h6">Data do Evento:</span> <span></span> {event.formattedDate}
                    </li>
                    <li className="list-group-item">
                      <i className="bi bi-geo-alt-fill fs-4"></i> <span className="h6">Local:</span> <span></span> {event.event_location}
                    </li>
                    <li className="list-group-item">
                      <i className="bi bi-globe fs-4"></i> <span className="h6">Inscritos:</span> {event.event_current_attendees}/
                      {event.event_max_attendees}
                    </li>
                  </ul>
                  <div className="mt-3">
                    <h6>Compartilhe o Evento nas Redes Sociais!</h6>
                    <div className="d-flex justify-content-around">
                      <a href={`https://www.facebook.com/share.php?u=cbmtb.com/${event.event_link}`} style={{ textDecoration: "none" }}>
                        <i className="bi bi-facebook fs-1 share-button" id="facebook-share">
                          {" "}
                        </i>
                      </a>
                      <i className="bi bi-twitter fs-1 share-button" id="twitter-share"></i>
                      <i className="bi bi-instagram fs-1 share-button" id="instagram-share"></i>
                    </div>
                    <div className="input-group my-3">
                      <input type="text" className="form-control" id="event-link" defaultValue={`cbmtb.com/${event.event_link}`} disabled />
                      <button
                        className="btn btn-light border"
                        type="button"
                        id="button-addon1"
                        onClick={() => {
                          const eventLink = document.getElementById("event-link");
                          navigator.clipboard.writeText(eventLink.value);
                          toast.success("Link copiado com sucesso!", { theme: "colored" });
                        }}
                      >
                        <i className="bi bi-clipboard"></i>
                      </button>
                    </div>
                  </div>
                  <hr className="mb-4" />
                  <div className="container">
                    <div className="row">
                      <div className="col-5 col-md-5 d-flex align-items-center justify-content-center">
                        <div className="fs-2 fw-bolder ">
                          R$ <span className="text-success fw-normal"> {event.event_price},00</span>
                        </div>
                      </div>
                      <div className="d-none d-lg-block col-1">
                        <div className="vr mx-1 h-100" />
                      </div>
                      <div className="col-7 col-md-6 d-flex justify-content-center">
                        {event.event_status === false ? (
                          <button type="button" className="btn btn-danger btn-lg " disabled>
                            Inscrições Fechadas
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-success btn-lg"
                            disabled={registration}
                            onClick={() => navigate(`/inscricao/${event.event_id}`)}
                          >
                            {registration ? (
                              <Fragment>
                                <i className="bi bi-check-circle"></i> Inscrito!
                              </Fragment>
                            ) : (
                              <Fragment>
                                <i className="bi bi-check-circle"></i> Inscrição
                              </Fragment>
                            )}
                          </button>
                        )}
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
                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    <div dangerouslySetInnerHTML={{ __html: event.event_description }}></div>
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
                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    {event.event_rules ? <div dangerouslySetInnerHTML={{ __html: event.event_rules }}></div> : <span>Nada por aqui.</span>}
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
                <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    {event.event_details ? <div dangerouslySetInnerHTML={{ __html: event.event_details }}></div> : <span>Nada por aqui.</span>}
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
