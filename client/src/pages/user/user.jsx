import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import { useParams } from "react-router-dom";

import LoadingScreen from "../../utils/loadingScreen";
import UserOptions from "./components/userOptions";

import UserRegistrations from "./components/userRegistrations";

import { fetchRegistrations } from "./functions/fetchRegistrations";

const UserPanel = ({ userAuthentication, userName }) => {
  const [registrations, setRegistrations] = useState([]);
  const { panel } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchRegistrations()
      .then((response) => setRegistrations(response))
      .finally(setLoading(false));
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Fragment>
      <div className="container-lg inner-page">
        <h1>Minha Conta</h1>

        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${panel === "inscricoes" && "active"}`}
              id="registrations-tab"
              data-bs-toggle="tab"
              data-bs-target="#registrations"
              type="button"
              role="tab"
              aria-controls="home"
              aria-selected="true"
            >
              Inscrições
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${panel === "perfil" && "active"}`}
              id="profile-tab"
              data-bs-toggle="tab"
              data-bs-target="#profile"
              type="button"
              role="tab"
              aria-controls="profile"
              aria-selected="false"
            >
              Perfil
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${panel === "filiacao" && "active"}`}
              id="membership-tab"
              data-bs-toggle="tab"
              data-bs-target="#membership"
              type="button"
              role="tab"
              aria-controls="contact"
              aria-selected="false"
            >
              Filiação
            </button>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <div
            className={`tab-pane fade ${panel === "inscricoes" && "show active"}`}
            id="registrations"
            role="tabpanel"
            aria-labelledby="registrations-tab"
          >
            <UserRegistrations registrations={registrations} />
          </div>
          <div className={`tab-pane fade ${panel === "perfil" && "show active"}`} id="profile" role="tabpanel" aria-labelledby="profile-tab">
            <UserOptions />
          </div>
          <div className={`tab-pane fade ${panel === "filiacao" && "show active"}`} id="membership" role="tabpanel" aria-labelledby="membership-tab">
            <div className="container inner-page">
              <h2>Em Breve...</h2>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UserPanel;
