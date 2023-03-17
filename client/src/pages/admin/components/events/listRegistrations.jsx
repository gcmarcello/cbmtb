import React, { Fragment } from "react";
import Table from "../table";

const ListRegistrations = (props) => {
  console.log("hi");
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
      accessor: "accessor",
      Header: "Opções",
      Cell: ({ row }) => (
        <Fragment>
          <button type="button" className="btn btn-link" style={{ color: "#6c757d" }} data-bs-toggle="modal" data-bs-target="#exampleModal">
            <i className="bi bi-eye"></i>
          </button>

          <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Modal title
                  </h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  {row.cells
                    .filter((info) => info.column.Header !== "Opções")
                    .map((info, index) => (
                      <div key={index}>
                        <strong>{info.column.Header}</strong>
                        <p>{info.value}</p>
                      </div>
                    ))}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                    Close
                  </button>
                  {/* <button type="button" className="btn btn-primary">
                    Save changes
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      ),
    },
  ];

  return (
    <div className="p-lg-3">
      <Table data={props.event.registrations} columns={columns} />
    </div>
  );
};

export default ListRegistrations;
