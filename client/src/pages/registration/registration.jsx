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

const dayjs = require("dayjs");

const Registration = () => {
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
    fetchEventInfo();
    fetchRegistrationAvailability();
    fetchUser();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Fragment>
      <div className="container inner-page">
        <h1 className="text-center text-justify mb-3">
          Inscrição - <br className="d-block d-lg-none" />
          {event?.event_name}
        </h1>
        <form>
          <UserInfo
            user={user}
            setValue={setValue}
            getValues={getValues}
            setError={setError}
            register={register}
            errors={errors}
            control={control}
            setIsLoading={setIsLoading}
          />
        </form>
      </div>
    </Fragment>
  );
};

export default Registration;
