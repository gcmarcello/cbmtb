import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import CreateDocuments from "./createDocuments";
import DeleteDocuments from "./deleteDocuments";
import Table from "../table";
import LoadingScreen from "../../../../utils/loadingScreen";

const ListDocuments = () => {
  const [documentList, setDocumentList] = useState([]);
  const [documentChange, setDocumentChange] = useState(false);

  const columns = [
    {
      Header: "Nome",
      accessor: "document_title",
    },
    {
      Header: "Descrição",
      accessor: "document_description",
    },
    {
      Header: "Ano",
      accessor: "document_year",
    },
  ];

  const fetchDocuments = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const response = await fetch(`/api/documents/`, {
        method: "GET",
        headers: myHeaders,
      });
      const parseResponse = await response.json();
      setDocumentList(parseResponse);
    } catch (error) {
      toast.error(`${error.message}`, { theme: "colored" });
    } finally {
    }
  };

  const openDocument = async (e, id) => {
    e.preventDefault();
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const response = await fetch(`/api/documents/${id}`, {
        method: "GET",
        headers: myHeaders,
      });
      const parseResponse = await response.json();
      window.open(parseResponse, "_blank");
    } catch (error) {
      toast.error(`${error.message}`, { theme: "colored" });
    }
  };

  useEffect(() => {
    if (!documentChange) {
      fetchDocuments();
    }
    //eslint-disable-next-line
  }, [documentChange]);

  return (
    <div className="bg-light">
      <div className="px-lg-5 py-lg-5">
        <div className="p-3 bg-white rounded rounded-2 shadow">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="">Documentos</h1>
            <a href="documentos/novo" className="btn btn-success align-center">
              Novo <span className="xxs">Documento</span>
            </a>
          </div>

          <h3>Documentos Destaque</h3>
          <hr />
          <Table data={documentList.filter((document) => document.document_general)} columns={columns} />

          <h3 className="mt-4">Documentos Gerais</h3>
          <hr />
          <Table data={documentList} columns={columns} />
        </div>
      </div>
    </div>
  );
};

export default ListDocuments;
