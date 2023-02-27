import React, { useState, useEffect, Fragment } from "react";
import { toast } from "react-toastify";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
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
      setDocumentYears([
        ...new Set(parseResponse.filter((document) => document.document_general === true).map((document) => document.document_year)),
      ]);
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
    <div className="container inner-page">
      <h1>Transparência</h1>
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
                      key={document.document_id}
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
      <div className="accordion mt-2" id="accordionExample">
        {documentYears.map((year) => (
          <div className="accordion-item" key={year}>
            <h2 className="accordion-header" id="headingTwo">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                Documentos {year}
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <div className="list-group">
                  {documents
                    .filter((document) => document.document_year === year)
                    .map((document) => (
                      <button
                        key={`${document.document_id}-general`}
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
        ))}
      </div>
      {/* <div className="accordion-item">
          <h2 className="accordion-header" id="headingTwo">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              Accordion Item #2
            </button>
          </h2>
          <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate
              classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS
              transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any
              HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingThree">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              Accordion Item #3
            </button>
          </h2>
          <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate
              classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS
              transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any
              HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
            </div>
          </div>
        </div> */}
    </div>
  );
};

export default Documents;
