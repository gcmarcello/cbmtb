import React, { useState, useRef } from "react";

import { useForm } from "react-hook-form";

import ConfirmRegistration from "./components/registrationConfirmation.jsx";
import RegistrationForm from "./components/registrationForm.jsx";

const Register = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const reCaptchaComponent = useRef(null);
  const {
    getValues,
    setError,
    setValue,
    watch,
    control,
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
        console.log(parseResponse);
        reCaptchaComponent.current.reset();
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  if (isRegistered) {
    return <ConfirmRegistration name={getValues("firstName")} />;
  } else
    return (
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
      />
    );
};

export default Register;
