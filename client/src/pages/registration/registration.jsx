// Library Components
import React, { useState, useEffect, Fragment } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { fetchInformation } from "./functions/fetchRegistrationInfo";
import { toast } from "react-toastify";

// General Components
import LoadingScreen from "../../utils/loadingScreen";
import Footer from "../../utils/footer";

// Page Components
import UserInfo from "./components/userInfo";
import EventInfo from "./components/eventInfo";
import StageButtons from "./components/stageButtons";
import Payments from "../payment/payments";

const Registration = ({ userAuthentication, setUserAuthentication, userAdmin, userName }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [registrationInfo, setRegistrationInfo] = useState({
    user: {},
    event: {},
    categories: [],
  });
  const { user, event, categories } = registrationInfo;

  const [userRegistration, setUserRegistration] = useState({
    category: "",
    shirt: "",
    rules: false,
  });

  const [stage, setStage] = useState(1);

  useEffect(() => {
    const fetchRegistration = async () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);
      try {
        const response = await fetch(`/api/registrations/${id}/checkreg`, {
          method: "GET",
          headers: myHeaders,
        });
        const parseResponse = await response.json();
        console.log(parseResponse);
        if (parseResponse.type === "error") {
          toast.error(parseResponse.message, { theme: "colored" });
          navigate(`/evento/${id}`);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchRegistration().then(
      fetchInformation(id).then((data) => {
        setRegistrationInfo(data);
      })
    );
  }, [id, navigate]);

  if (registrationInfo.event.event_status === false) {
    toast.error("As inscrições para este evento não estão abertas.", { theme: "colored" });
    return <Navigate to="/" />;
  }

  if (!registrationInfo.categories.length) {
    return <LoadingScreen />;
  }

  return (
    <Fragment>
      <div className="container inner-page">
        <h1 className="text-center text-justify mb-3">
          Inscrição - <br className="d-block d-lg-none" />
          {event.event_name}
        </h1>
        <div className="container">
          <div className="progress my-3" style={{ height: "50px" }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${stage === 1 ? "50%" : "100%"}` }}
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <h4>{stage === 1 ? "Atleta" : stage === 2 ? "Inscrição" : "Pesquisa"}</h4>
            </div>
          </div>
        </div>
        {stage === 1 ? (
          <UserInfo user={user} registrationInfo={registrationInfo} setRegistrationInfo={setRegistrationInfo} />
        ) : stage === 2 ? (
          <EventInfo
            user={user}
            event={event}
            categories={categories}
            registrationInfo={registrationInfo}
            setRegistrationInfo={setRegistrationInfo}
            userRegistration={userRegistration}
            setUserRegistration={setUserRegistration}
          />
        ) : (
          <Payments id={event.event_id} />
        )}
        <StageButtons stage={stage} setStage={setStage} userRegistration={userRegistration} id={id} />
      </div>
      <Footer />
    </Fragment>
  );
};

export default Registration;
