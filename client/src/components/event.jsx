import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserNavigation from "./navbars/userNavigation";

import LoadingScreen from "./utils/loadingScreen";
import Footer from "./utils/footer";

const EventPage = ({ userAuthentication, userName }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

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
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/categories/${event.event_id}`, {
        method: "GET",
      });
      const parseResponse = await response.json();

      setCategories(parseResponse);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEvent(); // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (event.event_id) {
      fetchCategories();
    }
  }, [event]);

  useEffect(() => {
    document.title = `CBMTB ${event.event_name ? `- ${event.event_name}` : ""}`;
  }, [event]);

  if (loading === true) {
    return <LoadingScreen />;
  }

  return (
    <Fragment>
      <UserNavigation userAuthentication={userAuthentication} userName={userName} />
      <div className="container inner-page">
        <div className="container my-3">
          <h1 className="mb-3">{event.event_name}</h1>
          <div className="row align-items-top">
            <div className="col-12 col-lg-7 mb-3">
              <img src={event.event_image} className="img-fluid" width={870} height={475} alt="Imagem do Evento" />
            </div>

            <div className="col-12 col-lg-5">
              <div className="card">
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
                      <i className="bi bi-person-badge fs-4"></i> <span className="h6">Categorias:</span> <span></span>
                      <ul className="mt-1">
                        {" "}
                        {categories.length ? (
                          categories.map((category) => <li key={category.category_id}>{category.category_name}</li>)
                        ) : (
                          <li>Única</li>
                        )}
                      </ul>
                    </li>
                    <li className="list-group-item">
                      <i className="bi bi-globe fs-4"></i> <button className="btn btn-link fst-italic ps-1">Site do Evento</button>
                    </li>
                  </ul>

                  <hr />
                  <div className="d-flex align-items-center justify-content-around">
                    {event.event_status === false ? (
                      <button type="button" className="btn btn-danger btn-lg form-control" disabled>
                        Inscrições Fechadas
                      </button>
                    ) : (
                      <button type="button" className="btn btn-success btn-lg form-control">
                        Inscreva-se
                      </button>
                    )}
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
      <Footer />
    </Fragment>
  );
};

export default EventPage;
