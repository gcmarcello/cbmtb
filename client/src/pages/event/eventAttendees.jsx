import { Link, useParams } from "react-router-dom";
import Table from "../admin/components/table";
import { useEffect, useState } from "react";

export default function EventAttendees() {
  const { id } = useParams();
  const [attendees, setAttendees] = useState([]);
  const [event, setEvent] = useState(null);

  const columns = [
    {
      Header: "Nome",
      accessor: "user_first_name",
    },
    {
      Header: "Sobrenome",
      accessor: "user_last_name",
    },
    {
      Header: "Categoria",
      accessor: "category_name",
    },
    {
      Header: "Status",
      accessor: "registration_status",
      Cell: ({ value, row }) => (
        <div>
          {value === "completed" ? (
            <span className="badge text-bg-success">Confirmada</span>
          ) : (
            <span className="badge text-bg-warning">Pendente</span>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchEventInfo = async () => {
      try {
        const response = await fetch(`/api/events/${id}/attendees`, {
          method: "GET",
        });
        const parseResponse = await response.json();
        setAttendees(parseResponse?.attendees);
        setEvent(parseResponse?.event);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEventInfo();
  }, []);

  return (
    <div className="container inner-page">
      <div className="container my-3">
        <div className="d-flex flex-column flex-lg-row justify-content-between mb-3">
          <h1 className="mb-3">{event?.event_name || "Evento"} - Lista de Inscritos</h1>
          <Link to={`/eventos/${id}`} className="btn btn-secondary my-auto w-lg-auto">
            Voltar ao Evento
          </Link>
        </div>
        {<Table data={attendees} columns={columns} />}
      </div>
    </div>
  );
}
