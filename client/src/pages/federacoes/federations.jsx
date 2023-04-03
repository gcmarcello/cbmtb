import React, { useState, useEffect } from "react";

import LoadingScreen from "../../utils/loadingScreen";

import { retrieveDemonym } from "./functions/demonym";

const FederationsPage = () => {
  const [federationsList, setFederationsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFederations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/federations/`, {
        method: "GET",
      });
      const parseResponse = await response.json();
      setFederationsList(parseResponse);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFederations();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="container inner-page">
      <h1>Federações Estaduais</h1>
      <p className="text-justify">
        Bem-vindo à página de Federações da Confederação Brasileira de Mountain Bike! Aqui você encontrará informações sobre as federações estaduais
        de mountain bike em todo o país. As federações estaduais são organizações responsáveis por promover, desenvolver e regulamentar o Mountain
        Bike em cada estado brasileiro.
      </p>
      <p className="text-justify">
        A Confederação Brasileira de Mountain Bike trabalha em parceria com as federações estaduais para promover o desenvolvimento do esporte em todo
        o país. Juntos, estamos comprometidos em criar oportunidades para que atletas de todas as idades e habilidades possam desfrutar do Mountain
        Bike em um ambiente seguro e competitivo.
      </p>
      <div className="accordion" id="accordionFederations">
        {federationsList.length
          ? federationsList.map((federation) => (
              <div className="accordion-item">
                <h2 className="accordion-header" id={`${federation.federation_state}-heading`}>
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${federation.federation_state}`}
                    aria-expanded="false"
                    aria-controls={federation.federation_state}
                  >
                    <img
                      src={`https://cbmtb.s3.sa-east-1.amazonaws.com/estados/${federation.federation_state}.png`}
                      width={45}
                      height={30}
                      alt="sp"
                      className="me-2"
                    />
                    {federation.federation_name || `Federação ${retrieveDemonym(federation.federation_state)} de Mountain Bike`}
                  </button>
                </h2>
                <div
                  id={federation.federation_state}
                  className="accordion-collapse collapse"
                  aria-labelledby={`${federation.federation_state}-heading`}
                  data-bs-parent="#accordionFederations"
                >
                  <div className="accordion-body">
                    <div className="federation-info">
                      <h5>Informação</h5>
                      <ul className="list-group" style={{ listStyle: "none" }}>
                        <li>
                          <i className="bi bi-globe fs-3"></i> <a href={federation.federation_site}>{federation.federation_site}</a>
                        </li>
                        <li>
                          <i className="bi bi-telephone-fill fs-3"></i> {federation.federation_phone}
                        </li>
                        <li>
                          <i className="bi bi-geo-alt-fill fs-3"></i> {federation.federation_address}
                        </li>
                      </ul>
                    </div>
                    <div className="federation-clubs mt-3">
                      <h5>Clubes</h5>
                      Em Breve...
                    </div>
                  </div>
                </div>
              </div>
            ))
          : ""}
      </div>
    </div>
  );
};

export default FederationsPage;
