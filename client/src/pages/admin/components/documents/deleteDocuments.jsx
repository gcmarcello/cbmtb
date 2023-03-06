import React, { Fragment } from "react";
import { toast } from "react-toastify";

const DeleteDocuments = ({ document, setDocumentChange }) => {
  const deleteFile = async (e, id) => {
    e.preventDefault();
    try {
      setDocumentChange(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
        headers: myHeaders,
      });

      const parseResponse = await response.json();
      toast[parseResponse.type](parseResponse.message, { theme: "colored" });
    } catch (error) {
      toast.error(`Erro ao enviar arquivo. ${error.message}`);
    } finally {
      setDocumentChange(false);
    }
  };

  return (
    <Fragment>
      <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteDocumentModal">
        <i className="bi bi-x-circle"></i>
      </button>

      <div className="modal fade" id="deleteDocumentModal" tabIndex="-1" aria-labelledby="deleteDocumentModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="deleteDocumentModalLabel">
                Remover {document.document_title}
              </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Tem certeza que deseja remover o documento {document.document_title}? Ele será removido do sistema e o arquivo .PDF correspondente será
              eliminado do banco de dados.
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={(e) => deleteFile(e, document.document_id)}>
                Remover
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default DeleteDocuments;
