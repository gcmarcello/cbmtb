import React, { useState, Fragment } from "react";
import { toast } from "react-toastify";

const Documents = () => {
  const [documents, setDocuments] = useState([]); //eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(false);
  const [documentYears, setDocumentYears] = useState([]);

  const fetchAllDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/documents/`, {
        method: "GET",
      });
      const parseResponse = await response.json();
      setDocuments(parseResponse);
      const years = parseResponse.map((document) => document.document_year);
      setDocumentYears([...new Set(years)]);
    } catch (err) {
      console.log(err);
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

  useState(() => {
    fetchAllDocuments();
  }, []);

  return (
    <Fragment>
      <div className="container inner-page">
        <h1>Transparência</h1>
        <div className="mx-2">
          <p className="text-justify">
            Bem-vindo à página de Transparência da CBMTB! Aqui você poderá acessar nossos estatutos, regulamentos, atas de reuniões e outros
            documentos importantes. Também fornecemos informações sobre nossa estrutura organizacional, incluindo os membros de nosso conselho e
            equipe administrativa. Além disso, nossa página de Transparência oferece informações sobre nosso orçamento, finanças e investimentos.
          </p>
          <p className="text-justify">
            Publicamos anualmente nossos balanços financeiros, demonstrações de resultados e relatórios de auditoria, para que nossos membros possam
            acompanhar o desempenho financeiro de nossa entidade. Estamos comprometidos em manter um alto nível de integridade e ética em nossas
            operações. Como tal, nossa página de Transparência e Documentação é atualizada regularmente e estamos sempre disponíveis para responder a
            quaisquer dúvidas ou preocupações que nossos membros possam ter.
          </p>
        </div>

        <div className="accordion" id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Documentação Geral
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <div className="list-group">
                  {documents
                    .filter((document) => document.document_general === true)
                    .map((document) => (
                      <button
                        key={`${document.document_id}-general`}
                        className="list-group-item list-group-item-action"
                        aria-current="true"
                        onClick={(e) => openDocument(e, document.document_link.split("/").pop())}
                      >
                        <div className="d-flex w-100 justify-content-between">
                          <h5 className="mb-1">{document.document_title}</h5>
                          <small>{document.document_year}</small>
                        </div>
                        <p className="mb-1">{document.document_description}</p>
                        {/* <small>And some small print.</small> */}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="accordion mt-2" id={`accordion-years`}>
          {documentYears
            .sort((a, b) => b - a)
            .map((year) => (
              <div className="accordion-item" key={year}>
                <h2 className="accordion-header" id={`heading-${year}`}>
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${year}`}
                    aria-expanded="false"
                    aria-controls={`heading-${year}`}
                  >
                    Documentos {year}
                  </button>
                </h2>
                <div
                  id={`collapse-${year}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading-${year}`}
                  data-bs-parent={`#accordion-years`}
                >
                  <div className="accordion-body">
                    <div className="list-group">
                      {documents
                        .filter((document) => document.document_year === year && !document.document_general)
                        .map((document) => (
                          <button
                            key={document.document_id}
                            href="#"
                            className="list-group-item list-group-item-action"
                            aria-current="true"
                            onClick={(e) => openDocument(e, document.document_link.split("/").pop())}
                          >
                            <div className="d-flex w-100 justify-content-between">
                              <h5 className="mb-1">{document.document_title}</h5>
                              {/* <small>3 days ago</small> */}
                            </div>
                            <p className="mb-1">{document.document_description}</p>
                            {/* <small>And some small print.</small> */}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}{" "}
        </div>
      </div>
    </Fragment>
  );
};

export default Documents;
