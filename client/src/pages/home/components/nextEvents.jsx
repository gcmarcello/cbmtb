import React, { Fragment, useState } from "react";
import { useEffect } from "react";
const dayjs = require("dayjs");

const NextEvents = ({ event }) => {
  const [eventsList, setEventsList] = useState([]);

  const getEvents = async (e) => {
    try {
      const response = await fetch(`/api/events/public/${event ? event : ""}`, {
        method: "GET",
      });
      const parseResponse = await response.json();
      setEventsList(parseResponse);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <Fragment>
      <div className="container-fluid d-flex flex-column pt-3" id="home-next-events">
        <div id="hero-anchor"></div>
        <div className="row">
          <div className="col-12">
            <h1>Próximos Eventos</h1>
            <div className={`d-flex flex-wrap justify-content-${eventsList > 2 ? "evenly" : "center"}`}>
              {eventsList < 1 ? (
                <h3>Em breve, mais eventos!</h3>
              ) : (
                eventsList.map((event) => (
                  <div key={event.event_id} className="card main-page-card m-3 shadow-lg" style={{ width: "18rem" }}>
                    <a href={`/evento/${event.event_link}`} className="stretched-link">
                      <img
                        src={event.event_image}
                        className="card-img-top"
                        alt={`Thumbnail do Evento ${event.event_name}`}
                        height={169.73}
                        width={286}
                      />
                    </a>
                    <hr className="my-0" />
                    <div className="card-body">
                      <h5 className="card-title">{event.event_name}</h5>
                    </div>
                    <div className="card-footer d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        <i className="bi bi-geo-alt-fill"></i> {event.event_location}
                      </small>
                      <small className="text-muted">
                        <i className="bi bi-calendar-fill"></i> {dayjs(event.event_date_start).format("DD/MM/YYYY")}
                      </small>
                    </div>
                    {/* <a href={`/evento/${event.event_link}`} className="btn btn-primary">
                      Inscrições
                    </a> */}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-2"></div>
          <div className="col-8 d-flex justify-content-center my-3">
            <a href="/eventos">
              <button className="btn btn-lg btn-primary">Ver Todos</button>
            </a>
          </div>
          <div className="col-2"></div>
        </div>
      </div>
    </Fragment>
  );
};

export default NextEvents;
