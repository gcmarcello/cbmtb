import React, { Fragment } from "react";
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
    {
      Header: "Opções",
      accessor: "registration_id",
      disableSortBy: true,
      Cell: ({ value }) => (
        <Fragment>
          <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target={`#removeRegistrationModal-${value}`}>
            <i className="bi bi-x-circle"></i>
          </button>

          <div
            className="modal fade"
            id={`removeRegistrationModal-${value}`}
            tabIndex="-1"
            aria-labelledby="removeRegistrationModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <form>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="removeRegistrationModalLabel">
                      Cancelar inscrição
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    Tem certeza que deseja cancelar esta inscrição? O inscrito receberá um email com a confirmação do cancelamento.
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                      Voltar
                    </button>
                    <button type="button" className="btn btn-danger" onClick={() => props.deleteRegistration(value, true)} data-bs-dismiss="modal">
                      Cancelar Inscrição
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Fragment>
      ),
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
      <Table data={props.event.registrations} columns={columns} generateXlsx={generateXlsx} customPageSize={50} />
    </div>
  );
};

export default ListRegistrations;
