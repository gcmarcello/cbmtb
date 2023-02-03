// Library Components
import React, { useState, useEffect, Fragment } from "react";
import { useParams, Navigate } from "react-router-dom";
import { fetchInformation } from "./functions/fetchRegistrationInfo";
import { toast } from "react-toastify";

// General Components
import UserNavigation from "../../utils/userNavigation";
import LoadingScreen from "../../utils/loadingScreen";
import Footer from "../../utils/footer";

// Page Components
import UserInfo from "./components/userInfo";
import EventInfo from "./components/eventInfo";
import StageButtons from "./components/stageButtons";

const Registration = ({ userAuthentication, setUserAuthentication, userAdmin, userName }) => {
  const { id } = useParams();
  const [registrationInfo, setRegistrationInfo] = useState({
    user: {},
    event: {},
    categories: [],
  });
  const { user, event, categories } = registrationInfo;
  const [stage, setStage] = useState(1);

  useEffect(() => {
    fetchInformation(id).then((data) => {
      setRegistrationInfo(data);
    });
  }, [id]);

  if (registrationInfo.event.event_status === false) {
    toast.error("As inscrições para este evento não estão abertas.", { theme: "colored" });
    return <Navigate to="/" />;
  }

  if (!registrationInfo.categories.length) {
    return <LoadingScreen />;
  }

  return (
    <Fragment>
      <UserNavigation
        userAuthentication={userAuthentication}
        setUserAuthentication={setUserAuthentication}
        userAdmin={userAdmin}
        userName={userName}
      />
      <div className="container inner-page">
        <h1 className="text-center text-justify mb-3">
          Inscrição - <br className="d-block d-lg-none" />
          {event.event_name}
        </h1>
        {stage === 1 ? (
          <UserInfo user={user} registrationInfo={registrationInfo} setRegistrationInfo={setRegistrationInfo} />
        ) : stage === 2 ? (
          <EventInfo
            user={user}
            event={event}
            categories={categories}
            registrationInfo={registrationInfo}
            setRegistrationInfo={setRegistrationInfo}
          />
        ) : (
          <div>3</div>
        )}
        <StageButtons stage={stage} setStage={setStage} />
      </div>
      <Footer />
    </Fragment>
  );
};

export default Registration;
