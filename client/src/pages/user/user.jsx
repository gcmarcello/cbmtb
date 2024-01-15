import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import LoadingScreen from "../../utils/loadingScreen";
import UserOptions from "./components/userOptions";

import UserRegistrations from "./components/userRegistrations";
import __config from "../../_config";

const UserPanel = () => {
  const [registrations, setRegistrations] = useState([]);
  const { panel } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [searchParams] = useSearchParams();

  const deleteRegistration = async (eventId, registrationId) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const response = await fetch(`/api/registrations/${eventId}/${registrationId}`, {
        method: "DELETE",
        headers: myHeaders,
      });
      const parseResponse = await response.json();
      if (parseResponse.type === "success") {
        setRegistrations(
          registrations.filter(
            (registration) => registration.registration_id !== registrationId
          )
        );
        toast.success(parseResponse.message, { theme: "colored" });
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const getUser = async () => {
    setIsLoading(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const response = await fetch(`/api/users/self`, {
        method: "GET",
        headers: myHeaders,
      });
      const parseResponse = await response.json();
      setUserInfo(parseResponse);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRegistrations = async (type) => {
    try {
      setRegistrations(null);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);
      const response = await fetch(`/api/registrations/user/`, {
        method: "GET",
        headers: myHeaders,
      });
      const parseResponse = await response.json();
      setRegistrations(parseResponse);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUser();
    fetchRegistrations();
  }, []);

  useEffect(() => {
    document.title = `${__config.entidade.abbreviation} - Painel do Usuário`;
  }, []);

  if (isLoading || !userInfo || !registrations) {
    return (
      <div className="d-flex flex-column">
        <LoadingScreen />
        <span className="text-center mb-4 mt-n2">Carregando Inscrições</span>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="container-lg inner-page">
        {searchParams.get("confirmed") && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Sua inscrição foi confirmada!</strong>

            <>
              <br />
              {registrations.some((reg) => reg.registration_status === "pending") && (
                <>
                  Ela ainda pode constar como pendente até que o pagamento seja
                  processado.{" "}
                </>
              )}
              Você receberá uma confirmação via e-mail com seu QR Code!
            </>

            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
          </div>
        )}
        <h1>Minha Conta</h1>

        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${
                (panel === "inscricoes" || panel === undefined) && "active"
              }`}
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
            className={`tab-pane fade ${
              (panel === "inscricoes" || panel === undefined) && "show active"
            }`}
            id="registrations"
            role="tabpanel"
            aria-labelledby="registrations-tab"
          >
            <UserRegistrations
              lockedRegistration={searchParams.get("confirmed")}
              registrations={registrations}
              deleteRegistration={deleteRegistration}
              userInfo={userInfo}
            />
          </div>
          <div
            className={`tab-pane fade ${panel === "perfil" && "show active"}`}
            id="profile"
            role="tabpanel"
            aria-labelledby="profile-tab"
          >
            <UserOptions setIsLoading={setIsLoading} userInfo={userInfo} />
          </div>
          <div
            className={`tab-pane fade ${panel === "filiacao" && "show active"}`}
            id="membership"
            role="tabpanel"
            aria-labelledby="membership-tab"
          >
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
