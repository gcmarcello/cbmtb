import React, { useState, useEffect } from "react";
import { Fragment } from "react";

import LoadingScreen from "../../utils/loadingScreen";

import UserRegistrations from "./components/userRegistrations";

import { fetchRegistrations } from "./functions/fetchRegistrations";

const UserPanel = ({ userAuthentication, userName }) => {
  const [registrations, setRegistrations] = useState([]);
  const [panel, setPanel] = useState("registrations");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchRegistrations()
      .then((response) => setRegistrations(response))
      .finally(setLoading(false));
  }, []);

  return (
    <Fragment>
      <div className="container-lg inner-page">
        <h1>Minha Conta</h1>
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              id="registrations-tab"
              data-bs-toggle="tab"
              data-bs-target="#registrations"
              type="button"
              role="tab"
              aria-controls="registrations"
              aria-selected="true"
              onClick={() => setPanel("registrations")}
            >
              Inscrições
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="profile-tab"
              data-bs-toggle="tab"
              data-bs-target="#profile"
              type="button"
              role="tab"
              aria-controls="profile"
              aria-selected="false"
              onClick={() => setPanel("membership")}
            >
              Filiação
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="contact-tab"
              data-bs-toggle="tab"
              data-bs-target="#contact"
              type="button"
              role="tab"
              aria-controls="contact"
              aria-selected="false"
              onClick={() => setPanel("options")}
            >
              Opções
            </button>
          </li>
        </ul>
        {panel === "registrations" ? <UserRegistrations registrations={registrations} /> : <h1>Em Breve</h1>}
      </div>
    </Fragment>
  );
};

export default UserPanel;
