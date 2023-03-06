import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import ReactPaginate from "react-paginate";

import CreateDocuments from "./createDocuments";
import DeleteDocuments from "./deleteDocuments";

const ListDocuments = ({ setDocumentChange, documentChange }) => {
  const [documentList, setDocumentList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDocuments = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const openDocument = async (e, id) => {
    e.preventDefault();
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  function Items({ currentItems }) {
    return (
      <>
        {currentItems &&
          currentItems.map((document) => (
            <tr key={`news-${document.document_id}`}>
              <td>{document.document_title}</td>
              <td className="d-none d-lg-table-cell">{document.document_description}</td>
              <td className="d-none d-lg-table-cell">{document.document_year}</td>
              <td className="">
                <button className="btn btn-primary me-2" onClick={(e) => openDocument(e, document.document_link.split("/").pop())}>
                  <i className="bi bi-eye"></i>
                </button>
                <DeleteDocuments document={document} documentChange={documentChange} setDocumentChange={setDocumentChange} />
              </td>
            </tr>
          ))}
      </>
    );
  }

  function PaginatedItems({ itemsPerPage, itemList }) {
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    // Simulate fetching items from another resources.
    // (This could be items from props; or items loaded in a local state
    // from an API endpoint with useEffect and useState)
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = itemList.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(itemList.length / itemsPerPage);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
      const newOffset = (event.selected * itemsPerPage) % itemList.length;
      setItemOffset(newOffset);
    };

    return (
      <>
        <div className="row">
          <div className="col-12 col-lg-6">
            <h2>Documentos Gerais</h2>
            <table className="table table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Nome</th>
                  <th className="d-none d-lg-table-cell">Descrição</th>
                  <th className="d-none d-lg-table-cell">Ano do Arquivo</th>
                  <th>Arquivo</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                <Items currentItems={currentItems.filter((item) => item.document_general === true)} />
              </tbody>
            </table>
          </div>
          <div className="col-12 col-lg-6">
            <h2>Outros Documentos</h2>
            <table className="table table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Nome</th>
                  <th className="d-none d-lg-table-cell">Descrição</th>
                  <th className="d-none d-lg-table-cell">Ano do Arquivo</th>
                  <th>Arquivo</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                <Items currentItems={currentItems} />
              </tbody>
            </table>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-12 col-lg-6">
            <ReactPaginate
              breakLabel="..."
              nextLabel="Próximo >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="< Anterior"
              renderOnZeroPageCount={null}
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakClassName="page-item"
              breakLinkClassName="page-link"
              containerClassName="pagination"
              activeClassName="active"
            />
          </div>
          <div className="col-12 col-lg-6">
            <div className="d-flex justify-content-end">
              <a
                className="btn btn-primary mb-2"
                data-bs-toggle="collapse"
                href="#collapseNewDocument"
                role="button"
                aria-expanded="false"
                aria-controls="collapseNewDocument"
              >
                Adicionar Documento
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  useEffect(() => {
    fetchDocuments(); //eslint-disable-next-line
  }, [documentChange]);

  return (
    <div className="container-fluid mt-3">
      <h1>Lista de Documentos</h1>
      <hr />

      {!isLoading || !documentChange ? (
        <PaginatedItems itemsPerPage={5} itemList={documentList} />
      ) : (
        <table>
          <tbody>
            <tr>
              <td colSpan={5} className="text-center">
                <div className="spinner-border" role="status"></div>
              </td>
            </tr>
          </tbody>
        </table>
      )}
      <CreateDocuments documentChange={documentChange} setDocumentChange={setDocumentChange} />
    </div>
  );
};

export default ListDocuments;
