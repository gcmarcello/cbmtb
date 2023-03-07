import React, { Fragment, useEffect, useState } from "react";

import EditEvent from "./editEvent";

const ListEvents = ({ eventChange, setEventChange, saveCurrentPanel }) => {
  const [eventsList, setEventsList] = useState([]);

  const getEvents = async (e) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const response = await fetch("/api/events/", {
        method: "GET",
        headers: myHeaders,
      });
      const parseResponse = await response.json();
      for (let i = 0; i < parseResponse.length; i++) {
        let dateToParse = new Date(parseResponse[i].event_date);
        console.log(dateToParse);
        let dateToParseDay = String(dateToParse.getDate()).padStart(2, 0);
        let dateToParseMonth = String(dateToParse.getMonth() + 1).padStart(2, 0);
        let dateToParseYear = String(dateToParse.getFullYear()).slice(2, 4);
        parseResponse[i].formattedDate = `${dateToParseDay}/${dateToParseMonth}/${dateToParseYear}`;
      }
      setEventsList(parseResponse);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleEvents = async (e, id, boolean) => {
    try {
      setEventChange(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const response = await fetch(`/api/events/toggle/${id}/${boolean}`, {
        method: "PUT",
        headers: myHeaders,
      }); // eslint-disable-next-line
      const parseResponse = await response.json();
      setEventChange(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getEvents();
  }, [eventChange]);

  return (
    <Fragment>
      <div className="container-fluid mt-3">
        <h1>Lista de Eventos</h1>
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>Nome</th>
              <th className="d-none d-lg-table-cell">Data</th>
              <th className="d-none d-lg-table-cell">Inscritos</th>
              <th className="d-none d-lg-table-cell">Inscrições</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {eventsList.length ? (
              eventsList.map((event) => (
                <tr key={`evento-${event.event_id}`}>
                  <td>{event.event_name}</td>
                  <td className="d-none d-lg-table-cell">{event.formattedDate}</td>
                  <td className="d-none d-lg-table-cell">
                    {event.event_current_attendees}/{event.event_max_attendees}
                  </td>
                  <td className="d-none d-lg-table-cell">{event.event_status ? "Abertas" : "Fechadas"} </td>
                  <td>
                    <EditEvent event={event} setEventChange={setEventChange} />
                    {!event.event_status ? (
                      <button className="btn btn-success my-1 ms-1" onClick={(e) => toggleEvents(e, event.event_id, true)}>
                        <i className="bi bi-check-circle"></i>
                      </button>
                    ) : (
                      <button className="btn btn-danger my-1 ms-1" onClick={(e) => toggleEvents(e, event.event_id, false)}>
                        <i className="bi bi-x-circle"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  {eventsList ? "Você ainda não criou nenhum evento." : <div className="spinner-border" role="status"></div>}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <button className="btn btn-success" onClick={() => saveCurrentPanel("NewEvent")}>
          Criar Evento
        </button>
      </div>
    </Fragment>
  );
};

export default ListEvents;
