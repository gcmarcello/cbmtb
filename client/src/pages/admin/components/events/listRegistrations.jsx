import React from "react";
import Table from "../table";
import xlsx from "json-as-xlsx";
const dayjs = require("dayjs");

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
      Cell: ({ value }) => {
        switch (value) {
          case "completed":
            return <span className="badge bg-success">Confirmada</span>;
          case "cancelled":
            return <span className="badge bg-danger">Cancelada</span>;
          case "pending":
            return <span className="badge bg-warning text-dark">Pendente</span>;
          default:
        }
      },
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

  function formatText(text) {
    let words = text.split("_");
    words = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    return words.join(" ");
  }

  const generateXlsx = () => {
    const data = props.event.categories.map((category) => ({
      sheet: category.category_name,
      columns: Object.keys(props.event.registrations[0]).map((column) => ({
        label: formatText(column),
        value: column,
      })),
      content: props.event.registrations
        .filter((registration) => registration.category_name === category.category_name)
        .map(function (registration) {
          let registrationDate = dayjs(registration.registration_date).format("DD/MM/YYYY HH:mm");
          let birthDate = dayjs(registration.user_birth_date).format("DD/MM/YYYY");
          registration.registration_date = registrationDate;
          registration.user_birth_date = birthDate;
          registration.age = dayjs().diff(registration.user_birth_date, "year");

          return registration;
        }),
    }));
    const settings = {
      fileName: `${props.event.event_name} - Inscritos`, // Name of the resulting spreadsheet
      extraLength: 3, // A bigger number means that columns will be wider
      writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
      writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
      RTL: false, // Display the columns from right-to-left (the default value is false)
    };
    xlsx(data, settings);
  };

  return (
    <div className="p-lg-3">
      <Table data={props.event.registrations} columns={columns} generateXlsx={generateXlsx} />
    </div>
  );
};

export default ListRegistrations;
