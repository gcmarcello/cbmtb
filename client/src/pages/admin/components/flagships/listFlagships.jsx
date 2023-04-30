import { Fragment, useEffect, useState } from "react";
import Table from "../table";
import { Link } from "react-router-dom";

const ListFlagships = () => {
  const [flagships, setFlagships] = useState(null);

  const fetchFlagship = async () => {
    try {
      const response = await fetch(`/api/events/flagships/`, {
        method: "GET",
      });
      const parseResponse = await response.json();
      setFlagships(parseResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      Header: "Nome dos Eventos",
      accessor: "flagship_name",
    },
    {
      accessor: "flagship_id",
      Header: "Opções",
      disableSortBy: true,
      Cell: ({ value }) => (
        <div>
          <Link to={`/painel/flagships/${value}/`} className="btn btn-dark mx-1">
            <i className="bi bi-gear-fill"></i>
          </Link>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchFlagship();
  }, []);

  return (
    <Fragment>
      <div className="bg-light">
        <div className="px-lg-5 py-lg-5">
          <div className="p-3 bg-white rounded rounded-2 shadow">
            <h1>Eventos Carros-Chefe</h1>
            <hr />
            {flagships && <Table data={flagships} columns={columns} />}

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

export default ListFlagships;
