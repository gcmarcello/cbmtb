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
      Header: "Ano",
      accessor: "document_year",
    },
    {
      Header: "Geral",
      accessor: "document_general",
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
          <h1>Lista de Documentos</h1>
          <hr />
          <h3>Documentos Destaque</h3>
          <Table data={documentList.filter((document) => document.document_general)} columns={columns} />

          <h3 className="mt-4">Documentos Gerais</h3>
          <hr />
          <Table data={documentList} columns={columns} />
          <div className="d-flex justify-content-end">
            <a href="documentos/novo" className="btn btn-success">
              Novo Documento
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListDocuments;
