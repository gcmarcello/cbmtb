import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import LoadingScreen from "../../../../utils/loadingScreen";

import { handleChange, handleFileChange, cancelFileUpload, resetForm } from "../../functions/handleForm";
import { imageToBase64 } from "../../functions/imageToBase64";
import DeleteDocuments from "./deleteDocuments";

const ListDocuments = ({ setDocumentChange, documentChange }) => {
  const [newDocument, setNewDocument] = useState({
    title: "",
    description: "",
    year: new Date().getFullYear(),
    general: true,
  });
  const { title, description, year, general } = newDocument;
  const [documentList, setDocumentList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // File Upload States
  const [selectedFile, setSelectedFile] = useState(); //eslint-disable-next-line
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [base64File, setBase64File] = useState(null);
  const [base64FileSize, setBase64FileSize] = useState(null);
  const fileInput = useRef(null);

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

  const submitFile = async (e) => {
    e.preventDefault();
    try {
      setDocumentChange(true);
      if (parseFloat(base64FileSize) > 5000) {
        cancelFileUpload(setSelectedFile, setFilePreview, setBase64File);
        return toast.error("Imagem excede o tamanho máximo de 5000KB (5MB).", { theme: "colored" });
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const body = { title, description, base64File, year, general };

      const response = await fetch(`/api/documents/`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(body),
      });

      const parseResponse = await response.json();
      console.log(parseResponse);
      toast[parseResponse.type](parseResponse.message, { theme: "colored" });
      resetForm("document", newDocument, setNewDocument);
    } catch (error) {
      toast.error(`Erro ao enviar arquivo. ${error.message}`);
    } finally {
      setDocumentChange(false);
    }
  };

  useEffect(() => {
    fetchDocuments(); //eslint-disable-next-line
  }, [documentChange]);

  useEffect(() => {
    imageToBase64(selectedFile).then((data) => {
      setBase64File(data.image);
      setBase64FileSize(data.size);
    });
  }, [selectedFile]);

  return (
    <div className="container-fluid mt-3">
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
          {!isLoading || !documentChange ? (
            documentList.map((document) => (
              <tr key={`news-${document.document_id}`}>
                <td>{document.document_title}</td>
                <td className="d-none d-lg-table-cell">{document.document_description}</td>
                <td className="d-none d-lg-table-cell">{document.document_year}</td>
                <td className="">
                  <button className="btn btn-primary me-2" onClick={(e) => openDocument(e, document.document_link.split("/").pop())}>
                    Ver
                  </button>
                  <DeleteDocuments document={document} documentChange={documentChange} setDocumentChange={setDocumentChange} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                <div className="spinner-border" role="status"></div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
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

      <form className="collapse" id="collapseNewDocument">
        <div className="row mb-3">
          <div className="col-12 col-lg-6">
            <label htmlFor="document-title">Nome do Documento</label>
            <input
              id="document-title"
              name="title"
              className="form-control"
              type="text"
              onChange={(e) => handleChange(e, "text", newDocument, setNewDocument)}
            />
          </div>
          <div className="col-12 col-lg-6">
            <label htmlFor="document-file">Arquivo</label>
            <input
              className="form-control"
              type="file"
              accept=".pdf"
              name="selectedImage"
              id="document-file"
              onChange={(e) => handleFileChange(e, setSelectedFile, setIsFileSelected, filePreview, setFilePreview)}
              ref={fileInput}
            />
            <span className="text-muted">
              <small>Formato PDF. Tamanho Máximo: 5MB</small>
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-lg-6">
            <label htmlFor="document-title">
              Descrição do Documento{" "}
              <span className="text-muted">
                <small>Opcional</small>
              </span>
            </label>
            <input
              id="document-description"
              name="description"
              className="form-control"
              type="text"
              onChange={(e) => handleChange(e, "text", newDocument, setNewDocument)}
            />
          </div>
          <div className="col-12 col-lg-6">
            <div className="row">
              <div className="col-12 col-lg-8">
                <label htmlFor="document-title">Ano do Documento</label>
                <input
                  id="document-year"
                  name="year"
                  className="form-control mb-3"
                  type="number"
                  value={year}
                  onChange={(e) => handleChange(e, "text", newDocument, setNewDocument)}
                />
              </div>
              <div className="col-12 col-lg-4 d-flex align-items-center">
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="document-general"
                    name="general"
                    checked={general}
                    onChange={(e) => handleChange(e, "checkbox", newDocument, setNewDocument)}
                  />
                  <label className="form-check-label" htmlFor="document-general">
                    Arquivo Geral
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <button className="btn btn-success" onClick={(e) => submitFile(e)}>
              Enviar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ListDocuments;
