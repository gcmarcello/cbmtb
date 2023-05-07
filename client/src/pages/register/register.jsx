import React, { useState, useRef, useContext, useEffect } from "react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

import ConfirmRegistration from "./components/registrationConfirmation.jsx";
import RegistrationForm from "./components/registrationForm.jsx";
import { UserContext } from "../../context/userContext.js";

const Register = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const reCaptchaComponent = useRef(null);
  const {
    getValues,
    clearErrors,
    setError,
    setValue,
    watch,
    control,
    resetField,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`/api/users/register`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const parseResponse = await response.json();
      if (parseResponse.type === "success") {
        setIsRegistered(true);
      } else {
        resetField(`${parseResponse.field}`);
        setError("root.serverError", {
          type: parseResponse.field,
          message: parseResponse.message,
        });
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      reCaptchaComponent.current.reset();
      resetField("reCaptcha");
    }
  };

  useEffect(() => {
    if (userInfo.userRole) {
      navigate("/usuario");
    }
  }, [userInfo, navigate]);

  if (isRegistered) {
    return <ConfirmRegistration name={getValues("firstName")} />;
  } else
    return (
      <Fragment>
        <RegistrationForm
          onSubmit={onSubmit}
          reCaptchaComponent={reCaptchaComponent}
          getValues={getValues}
          setError={setError}
          setValue={setValue}
          watch={watch}
          control={control}
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          clearErrors={clearErrors}
        />
      </Fragment>
    );
};

export default Register;
