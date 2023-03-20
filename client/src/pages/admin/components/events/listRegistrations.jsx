import React, { Fragment } from "react";
import Table from "../table";

const ListRegistrations = (props) => {
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
      Header: "Camisa",
      accessor: "registration_shirt",
      Cell: ({ value }) => value.toUpperCase(),
    },
    {
      Header: "Status",
      accessor: "registration_status",
    },
    {
      Header: "Telefone",
      accessor: "user_phone",
    },
    {
      Header: "Email",
      accessor: "user_email",
    },
  ];

  return (
    <div className="p-lg-3">
      <Table data={props.event.registrations} columns={columns} />
    </div>
  );
};

export default ListRegistrations;
