import React, { useState, useEffect } from "react";

import Table from "../table";
import { Link } from "react-router-dom";

const dayjs = require("dayjs");

const ListTickets = () => {
  const [ticketList, setTicketList] = useState([]);

  const columns = [
    {
      Header: "Nome",
      accessor: "ticket_name",
    },
    {
      Header: "Email",
      accessor: "ticket_email",
    },
    {
      Header: "Phone",
      accessor: "ticket_phone",
    },
    {
      Header: "Data",
      accessor: "ticket_date",
      Cell: ({ value }) => {
        return dayjs(value).format("DD/MM/YYYY HH:mm");
      },
    },
    {
      Header: "Status",
      accessor: "ticket_status",
      Cell: ({ value }) => {
        switch (value) {
          case "completed":
            return <span className="badge bg-success">Finalizado</span>;
          case "awaiting":
            return <span className="badge bg-warning text-dark">Aguardando Resposta</span>;
          case "pending":
            return <span className="badge bg-danger">Pendente</span>;
          default:
        }
      },
    },
    {
      Header: "Responder",
      accessor: "accessor",
      Cell: ({ row }) => {
        return (
          <Link to={`/painel/ouvidoria/${row.original.ticket_id}`} className="btn btn-primary" rel="noreferrer">
            Responder
          </Link>
        );
      },
    },
  ];

  const listTickets = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const response = await fetch(`/api/tickets/`, {
        method: "GET",
        headers: myHeaders,
      }); // eslint-disable-next-line
      const parseResponse = await response.json();
      setTicketList(parseResponse.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    listTickets();
  }, []);

  return (
    <div className="bg-light">
      <div className="px-lg-5 py-lg-5">
        <div className="p-3 bg-white rounded rounded-2 shadow">
          <h1>Lista de Chamados</h1>
          <hr />
          <Table data={ticketList} columns={columns} sortByColumn={[{ id: "ticket_status", desc: true }]} />
        </div>
      </div>
    </div>
  );
};

export default ListTickets;
