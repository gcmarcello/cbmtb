// Library Components
import React, { useState, useEffect, Fragment } from "react";
import {
  useParams,
  useNavigate,
  Navigate,
  Link,
  useSearchParams,
} from "react-router-dom";
import { toast } from "react-toastify";

// General Components
import LoadingScreen from "../../utils/loadingScreen";

// Page Components
import UserInfo from "./components/userInfo";
import EventInfo from "./components/eventInfo";
import { useForm } from "react-hook-form";
import ProgressBar from "./components/progressBar";
import ConfirmationPayment from "./components/confirmationPayment";

var relativeTime = require("dayjs/plugin/relativeTime");

const dayjs = require("dayjs");
dayjs.extend(relativeTime);

const Registration = () => {
  const navigate = useNavigate();
  const { id, coupon } = useParams();
  const [user, setUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isTeam, setIsTeam] = useState(false);

  useEffect(() => {
    if (searchParams.get("team")) {
      setIsTeam(true);
    }
  }, []);

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
  } = useForm({
    mode: "onChange",
    defaultValues: { paymentMethod: "", order_id: "", registration_group: "" },
  });

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
      return parseResponse;
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
      if (parseResponse.type === "alert") {
        toast.warning(parseResponse.message, { theme: "colored" });
        navigate(`/usuario`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    if (!data.card) data.card = {};
    const { card, ...rest } = data;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("token", localStorage.token);

    try {
      const response = await fetch(`/api/registrations/${id}/${coupon ? coupon : ""}`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(rest),
      });
      const parseResponse = await response.json();

      if ((parseResponse.type !== "error" && !parseResponse.data) || isTeam) {
        toast.success(parseResponse.message, { theme: "colored" });
        return navigate("/usuario");
      }

      if (parseResponse.type !== "error" && parseResponse.data) {
        window.open(parseResponse.data, "_self");
      }

      if (parseResponse.type === "error") {
        toast.error(parseResponse.message, { theme: "colored" });
      }
      /*if (data.paymentMethod !== "pix") toast[parseResponse.type](parseResponse.message, { theme: "colored" });
      if(parseResponse.type === "error") {
        resetField('card')
      } */
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
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

  if (isLoading || !event) {
    return <LoadingScreen />;
  }

  return (
    <Fragment>
      <div className="container inner-page pb-md-5">
        <div className="d-flex flex-column flex-lg-row justify-content-between">
          <h1 className="text-justify text-center">
            Inscrição {isTeam && "de Equipe"} - <br className="d-block d-lg-none" />
            {event?.event_name}
          </h1>
          <Link to={`/eventos/${id}`} className="btn btn-secondary my-auto w-lg-auto">
            Voltar ao Evento
          </Link>
        </div>

        <hr />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <StepPanel
              control={control}
              coupon={coupon}
              errors={errors}
              event={event}
              getValues={getValues}
              handleSubmit={handleSubmit}
              isTeam={isTeam}
              onSubmit={onSubmit}
              register={register}
              setError={setError}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
              setValue={setValue}
              stage={stage}
              user={user}
              watch={watch}
            />
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
            backgroundColor: "var(--primary-color)",
          }}
        >
          <ProgressBar stage={stage} setStage={setStage} watch={watch} event={event} />
        </div>
      }
    </Fragment>
  );
};

const StepPanel = ({
  stage,
  event,
  user,
  watch,
  register,
  setValue,
  getValues,
  handleSubmit,
  onSubmit,
  setIsLoading,
  control,
  coupon,
  isTeam,
  setError,
  errors,
  isLoading,
}) => {
  switch (stage) {
    case 1:
      return <EventInfo event={event} user={user} watch={watch} register={register} />;
    case 2:
      return (
        <ConfirmationPayment
          event={event}
          user={user}
          watch={watch}
          register={register}
          setValue={setValue}
          getValues={getValues}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          control={control}
          coupon={coupon}
          errors={errors}
          isTeam={isTeam}
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

export default Registration;
