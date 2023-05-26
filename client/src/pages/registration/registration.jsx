// Library Components
import React, { useState, useEffect, Fragment } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

// General Components
import LoadingScreen from "../../utils/loadingScreen";

// Page Components
import UserInfo from "./components/userInfo";
import EventInfo from "./components/eventInfo";
import { useForm } from "react-hook-form";
import ProgressBar from "./components/progressBar";
import ConfirmationPayment from "./components/confirmationPayment";

const dayjs = require("dayjs");

const Registration = () => {
  const navigate = useNavigate();
  const { id, coupon } = useParams();
  const [user, setUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState(1);

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
      const response = await fetch(`/api/events/${id}`, {
        method: "GET",
      });
      const parseEvent = await response.json();
      setEvent(parseEvent);
    } catch (err) {
      console.log(err);
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
      if (parseResponse.type === "error") {
        toast.error(parseResponse.message, { theme: "colored" });
        navigate(`/eventos/${id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRegistrationAvailability = async () => {
    setIsLoading(true);
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
        navigate(`/eventos/${id}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("token", localStorage.token);
    try {
      const response = await fetch(
        `/api/registrations/${id}/${coupon ? coupon : ""}`,
        {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify(data),
        }
      );
      const parseResponse = await response.json();
      if (parseResponse.type === "error") {
        navigate(`/eventos/${id}`);
      } else {
        navigate("/usuario");
      }
      toast[parseResponse.type](parseResponse.message, { theme: "colored" });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEventInfo();
    fetchUser();
    fetchRegistrationAvailability();
  }, []);

  useEffect(() => {
    if (user) {
      setValue("firstName", user.user_first_name);
      setValue("lastName", user.user_last_name);
      setValue("email", user.user_email);
      setValue("cpf", user.user_cpf);
      setValue("phone", user.user_phone);
      setValue("gender", user.user_gender);
      setValue("birthDate", dayjs(user.user_birth_date).format("YYYY-MM-DD"));
      setValue("cep", user.user_cep);
      setValue("state", user.user_state);
      setValue("city", user.user_city);
      setValue("address", user.user_address);
      setValue("number", user.user_number);
      setValue("apartment", user.user_apartment);
    }
  }, [user]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const StepPanel = () => {
    switch (stage) {
      case 1:
        return (
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
        );
      case 2:
        return (
          <EventInfo
            event={event}
            user={user}
            watch={watch}
            register={register}
          />
        );
      case 3:
        return (
          <ConfirmationPayment
            event={event}
            user={user}
            watch={watch}
            register={register}
          />
        );
      default:
        <UserInfo
          user={user}
          setValue={setValue}
          getValues={getValues}
          setError={setError}
          register={register}
          errors={errors}
          control={control}
          setIsLoading={setIsLoading}
        />;
    }
  };

  return (
    <Fragment>
      <div className="container inner-page">
        <h1 className="text-justify text-center">
          Inscrição - <br className="d-block d-lg-none" />
          {event?.event_name}
        </h1>
        <hr />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <StepPanel />
          </div>
        </form>
      </div>
      {
        <div
          className="text-white shadow-lg sticky-bottom d-flex flex-column"
          style={{
            height: "100px",
            bottom: "0",
            width: "100%",
            backgroundColor: "#00a859",
          }}
        >
          <ProgressBar stage={stage} setStage={setStage} watch={watch} />
        </div>
      }
    </Fragment>
  );
};

export default Registration;
