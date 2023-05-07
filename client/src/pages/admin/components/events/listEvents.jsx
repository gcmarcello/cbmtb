import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Table from "../table";

const ListEvents = () => {
  const navigate = useNavigate();
  const [eventChange, setEventChange] = useState(false);
  const [statusButton, setStatusButton] = useState({ class: null, text: null });
  const [eventsList, setEventsList] = useState([]);

  const columns = [
    {
      Header: "Nome",
      accessor: "event_name",
      Cell: ({ row }) => <Link to={`/painel/eventos/${row.original.event_id}/`}>{row.original.event_name}</Link>,
    },
    {
      accessor: "event_status",
      Header: "Status",
      Cell: ({ value, row }) => {
        return (
          <Fragment>
            {eventChange ? (
              <button className="btn btn-light" disabled>
                <div className="spinner-border spinner-border-sm" role="status"></div> <span className="d-none d-lg-inline-block">Carregando...</span>
              </button>
            ) : (
              <div className="dropdown">
                <button
                  className={`btn btn-${value === "open" ? "success" : value === "private" ? "warning" : "secondary"} dropdown-toggle`}
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ minWidth: "91px" }}
                >
                  {value === "open" ? "Aberto" : value === "private" ? "Privado" : "Finalizado"}
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  {value === "open" && <PrivateEventButton row={row} />}
                  {(value === "private" || value === "completed") && <OpenEventButton row={row} />}
                  {value !== "completed" && (
                    <>
                      <hr className="dropdown-divider" />
                      <li>
                        <button className="dropdown-item" onClick={(e) => {}} disabled={eventChange}>
                          {"Finalizar Evento"}
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </Fragment>
        );
      },
    },
    {
      Header: "Data",
      accessor: "formattedDate",
      className: "d-none d-lg-table-cell",
    },
    {
      accessor: "event_id",
      Header: "Opções",
      disableSortBy: true,
      Cell: ({ value }) => (
        <div>
          <Link to={`/painel/eventos/${value}/`} className="btn btn-dark mx-1">
            <i className="bi bi-gear-fill"></i>
          </Link>
          <Link to={`/painel/eventos/${value}/inscritos`} className="btn btn-primary mx-1 d-none d-lg-inline-block">
            <i className="bi bi-people-fill"></i>
          </Link>
        </div>
      ),
    },
  ];

  const PrivateEventButton = ({ row }) => {
    return (
      <li>
        <button className="dropdown-item" onClick={(e) => toggleEvents(e, row.original.event_id, "private")} disabled={eventChange}>
          {"Privar Evento"}
        </button>
      </li>
    );
  };

  const OpenEventButton = ({ row }) => {
    return (
      <li>
        <button className="dropdown-item" onClick={(e) => toggleEvents(e, row.original.event_id, "open")} disabled={eventChange}>
          {"Abrir Evento"}
        </button>
      </li>
    );
  };

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
    e.preventDefault();
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
      toast[parseResponse.type](parseResponse.message, { theme: "colored" });
    } catch (err) {
      console.log(err);
    } finally {
      setTimeout(async () => {
        setEventChange(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (!eventChange) {
      getEvents();
    }
  }, [eventChange]);

  return (
    <Fragment>
      <div className="bg-light">
        <div className="px-lg-5 py-lg-5">
          <div className="p-3 bg-white rounded rounded-2 shadow">
            <h1>Lista de Eventos</h1>
            <hr />
            <Table data={eventsList} columns={columns} />

            <div className="d-flex justify-content-end">
              <Link to="/painel/eventos/novo/" className="btn btn-success">
                Novo Evento
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ListEvents;
