// Library Components
import React, { useState, useEffect, Fragment } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

// General Components
import LoadingScreen from "../../utils/loadingScreen";

// Page Components
import UserInfo from "./components/userInfo";
import EventInfo from "./components/eventInfo";
import StageButtons from "./components/stageButtons";
import Payments from "../payment/payments";
import { useForm } from "react-hook-form";

<<<<<<< HEAD
const dayjs = require("dayjs");

const Registration = () => {
=======
const Registration = ({
  userAuthentication,
  setUserAuthentication,
  userAdmin,
  userName,
}) => {
>>>>>>> 188e205ca7e1e8ecb15aabc9db25f9a31f15aa6f
  const navigate = useNavigate();
  const { id, coupon } = useParams();
  const [user, setUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    getValues,
    setError,
    setValue,
    resetField,
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const fetchEventInfo = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/events/${id}`, {
        method: "GET",
      });
      const parseEvent = await response.json();
      setEvent(parseEvent);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUser = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("token", localStorage.token);
    try {
      const response = await fetch(`/api/users/self`, {
        method: "GET",
        headers: myHeaders,
      });
      const parseResponse = await response.json();
      setUser(parseResponse);
      console.log(parseResponse);
      if (parseResponse.type === "error") {
        toast.error(parseResponse.message, { theme: "colored" });
        navigate(`/eventos/${id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRegistrationAvailability = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("token", localStorage.token);
    try {
      const response = await fetch(`/api/registrations/${id}/checkreg/${coupon ? coupon : ""}`, {
        method: "GET",
        headers: myHeaders,
      });
      const parseResponse = await response.json();
      if (parseResponse.type === "error") {
        toast.error(parseResponse.message, { theme: "colored" });
        navigate(`/eventos/${id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
<<<<<<< HEAD
    fetchEventInfo();
    fetchRegistrationAvailability();
    fetchUser();
  }, []);

  if (isLoading) {
=======
    const fetchRegistration = async () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);
      try {
        const response = await fetch(
          `/api/registrations/${id}/checkreg/${coupon ? coupon : ""}`,
          {
            method: "GET",
            headers: myHeaders,
          }
        );
        const parseResponse = await response.json();
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
    toast.error("As inscrições para este evento não estão abertas.", {
      theme: "colored",
    });
    return <Navigate to="/" />;
  }

  if (!registrationInfo.categories.length) {
>>>>>>> 188e205ca7e1e8ecb15aabc9db25f9a31f15aa6f
    return <LoadingScreen />;
  }

  return (
    <Fragment>
      <div className="container inner-page">
        <h1 className="text-center text-justify mb-3">
          Inscrição - <br className="d-block d-lg-none" />
          {event?.event_name}
        </h1>
<<<<<<< HEAD
        <form>
          <UserInfo user={user} setValue={setValue} register={register} />
        </form>
=======

        <div className="container">
          {/* <div class="position-relative m-4">
            <div class="progress" style={{ height: "1px" }}>
              <div class="progress-bar" role="progressbar" style={{ width: "50%" }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <button
              type="button"
              class="position-absolute top-0 start-0 translate-middle btn btn-sm btn-primary rounded-pill"
              style={{ width: "2rem", height: "2rem" }}
            >
              1
            </button>
            <button
              type="button"
              class="position-absolute top-0 start-50 translate-middle btn btn-sm btn-primary rounded-pill"
              style={{ width: "2rem", height: "2rem" }}
            >
              2
            </button>
            <button
              type="button"
              class="position-absolute top-0 start-100 translate-middle btn btn-sm btn-secondary rounded-pill"
              style={{ width: "2rem", height: "2rem" }}
            >
              3
            </button>
          </div> */}
          <div className="progress my-3" style={{ height: "50px" }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${stage === 1 ? "50%" : "100%"}` }}
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <h4>
                {stage === 1
                  ? "Atleta"
                  : stage === 2
                  ? "Inscrição"
                  : "Pesquisa"}
              </h4>
            </div>
          </div>
        </div>
        {stage === 1 ? (
          <UserInfo
            user={user}
            registrationInfo={registrationInfo}
            setRegistrationInfo={setRegistrationInfo}
          />
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
        <StageButtons
          stage={stage}
          setStage={setStage}
          userRegistration={userRegistration}
          registrationInfo={registrationInfo}
          id={id}
          coupon={coupon}
        />
>>>>>>> 188e205ca7e1e8ecb15aabc9db25f9a31f15aa6f
      </div>
    </Fragment>
  );
};

export default Registration;
