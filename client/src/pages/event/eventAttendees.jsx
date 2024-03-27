import { Link, useParams } from "react-router-dom";
import Table from "../admin/components/table";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";

export default function EventAttendees() {
  const { id } = useParams();
  const [attendees, setAttendees] = useState([]);
  const [event, setEvent] = useState(null);
  const [categories, setCategories] = useState([]);

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
          ) : row.original.registration_group ? (
            <span className="badge text-bg-secondary">Equipe</span>
          ) : (
            <span className="badge text-bg-warning">Pendente</span>
          )}
        </div>
      ),
    },
    {
      Header: "Equipe",
      accessor: "registration_group",
    },
  ];

  useEffect(() => {
    const fetchEventInfo = async () => {
      try {
        const response = await fetch(`/api/events/${id}/attendees`, {
          method: "GET",
        });
        const parseResponse = await response.json();
        const uniqueNames = [
          ...new Set(parseResponse?.attendees.map((attendee) => attendee.category_name)),
        ];
        setCategories(uniqueNames);
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
        {categories.sort().map((category) => (
          <div className="mt-3">
            <h2>{category}</h2>
            <Table
              sortByColumn={[{ id: "category_name", desc: false }]}
              data={attendees.filter((attendee) => attendee.category_name === category)}
              columns={columns}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
