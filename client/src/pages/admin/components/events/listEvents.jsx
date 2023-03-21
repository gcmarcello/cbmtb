import React, { Fragment, useEffect, useState } from "react";
import Table from "../table";

const ListEvents = ({ eventChange, setEventChange }) => {
  const [eventsList, setEventsList] = useState([]);

  const columns = [
    {
      Header: "Nome",
      accessor: "event_name",
    },
    {
      accessor: "event_status",
      Header: "Status",
      Cell: ({ value }) => (value ? "Abertas" : "Fechadas"),
    },
    {
      Header: "Inscrições",
      accessor: "event_current_attendees",
    },
    {
      Header: "Data",
      accessor: "formattedDate",
    },
    {
      accessor: "event_id",
      Header: "Opções",
      Cell: ({ value }) => (
        <div>
          <a href={`eventos/${value}/`} className="btn btn-dark mx-1">
            <i className="bi bi-gear-fill"></i>
          </a>
          <a href={`eventos/${value}/inscritos`} className="btn btn-primary mx-1">
            <i className="bi bi-people-fill"></i>
          </a>
        </div>
      ),
    },
  ];

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
        const date = new Date(parseResponse[i].event_date_start);
        parseResponse[i].formattedDate = date.toLocaleString("pt-BR");
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
      <div className="bg-light">
        <div className="px-lg-5 py-lg-5">
          <div className="p-3 bg-white rounded rounded-2 shadow">
            <a href="eventos/novo" target="_blank" rel="noopener noreferrer" className="btn btn-success">
              Novo Evento
            </a>
            <Table data={eventsList} columns={columns} />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ListEvents;
