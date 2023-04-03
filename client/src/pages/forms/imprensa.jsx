import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import InputMask from "react-input-mask";
import ReCAPTCHA from "react-google-recaptcha";
import { siteConfigs } from "../../App.config.js";

import config from "../../config";

const Imprensa = () => {
  const navigate = useNavigate();
  const {
    getValues,
    setError,
    setValue,
    watch,
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: "onChange" });

  const reCaptchaComponent = useRef(null);

  const onSubmit = async (data) => {
    try {
      const body = data;
      const response = await fetch(`/api/forms/press/`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const parseResponse = await response.json();
      if (parseResponse.type === "success") {
        navigate("/");
      } else {
        setError(parseResponse.field, {
          type: "server",
          message: parseResponse.message,
        });
      }
      toast[parseResponse.type](parseResponse.message, { theme: "colored" });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="container inner-page">
      <h1>Cadastro de Imprensa</h1>
      <p>
        Registre seu veículo de imprensa na confederação! Ao preencher o
        cadastro, você receberá automaticamente em seu email todas as notícias
        da {config.entidade} em primeira mão.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="needs-validation"
        noValidate
      >
        <div className="row">
          <div className="col-12 col-lg-6">
            <label htmlFor="name">Nome Completo</label>
            <input
              id="fullName"
              className={`form-control ${
                errors.fullName?.type
                  ? "is-invalid"
                  : getValues("fullName")
                  ? "is-valid"
                  : ""
              } mb-3`}
              {...register("fullName", {
                required: true,
                pattern: /^([A-Za-z]+\s*){3,}$/i,
              })}
              aria-invalid={errors.fullName ? "true" : "false"}
            />
            {errors.fullName && (
              <div className="alert alert-danger mt-2" role="alert">
                Por favor, insira o seu nome completo.
              </div>
            )}
          </div>
          <div className="col-12 col-lg-6">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className={`form-control ${
                errors.email?.type
                  ? "is-invalid"
                  : getValues("email")
                  ? "is-valid"
                  : ""
              } mb-3`}
              {...register("email", {
                required: true,
                pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/,
              })}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email?.type && (
              <div className="alert alert-danger mt-2" role="alert">
                {errors.email?.type === "server"
                  ? errors.email.message
                  : "Por favor, insira o seu email corretamente."}
              </div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-lg-6">
            <label htmlFor="name">Telefone</label>
            <Controller
              name="phone"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: /^\(\d{2}\)\s\d{5}-\d{4}$/,
              }}
              render={({ field }) => (
                <InputMask
                  mask="(99) 99999-9999"
                  className={`form-control ${
                    errors.phone
                      ? "is-invalid"
                      : getValues("phone")
                      ? "is-valid"
                      : ""
                  } mb-3`}
                  maskChar=""
                  value={field.value}
                  onChange={field.onChange}
                >
                  {(inputProps) => <input {...inputProps} type="text" />}
                </InputMask>
              )}
            />
            {errors.phone && (
              <div className="alert alert-danger mt-2" role="alert">
                Por favor, insira o seu telefone corretamente.
              </div>
            )}
          </div>
          <div className="col-12 col-lg-6">
            <label htmlFor="name">CPF</label>
            <Controller
              name="cpf"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: /^(\d{3}\.){2}\d{3}-\d{2}$/,
              }}
              render={({ field }) => (
                <InputMask
                  mask="999.999.999-99"
                  className={`form-control ${
                    errors.cpf
                      ? "is-invalid"
                      : getValues("cpf")
                      ? "is-valid"
                      : ""
                  } mb-3`}
                  maskChar=""
                  value={field.value}
                  onChange={field.onChange}
                >
                  {(inputProps) => <input {...inputProps} type="text" />}
                </InputMask>
              )}
            />
            {errors.cpf?.type && (
              <div className="alert alert-danger mt-2" role="alert">
                {errors.cpf?.type === "server"
                  ? errors.cpf.message
                  : "Por favor, insira o seu CPF corretamente."}
              </div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-lg-6">
            <label htmlFor="type">Veículo De Imprensa</label>
            <select
              id="type"
              defaultValue=""
              className={`form-select ${
                errors.type ? "is-invalid" : getValues("type") ? "is-valid" : ""
              } mb-3`}
              {...register("type", { required: true })}
            >
              <option value="" disabled>
                Select...
              </option>
              <option value="Impresso">Impresso</option>
              <option value="Televisivo">Televisivo</option>
              <option value="Internet">Internet</option>
            </select>
            {errors.type && (
              <div className="alert alert-danger mt-2" role="alert">
                Por favor, selecione o tipo de veículo de imprensa.
              </div>
            )}
          </div>
          <div className="col-12 col-lg-6">
            <label htmlFor="vehicle">Nome do Veículo de Imprensa</label>
            <input
              id="vehicle"
              className={`form-control ${
                errors.vehicle
                  ? "is-invalid"
                  : getValues("vehicle")
                  ? "is-valid"
                  : ""
              } mb-3`}
              {...register("vehicle", { required: true })}
            />
            {errors.vehicle && (
              <div className="alert alert-danger mt-2" role="alert">
                Por favor, insira o nome do veículo de imprensa.
              </div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <label htmlFor="comments">Comentários</label>
            <textarea
              id="comments"
              className={`form-control mb-3`}
              {...register("comments")}
            />
          </div>
        </div>

        <div className="row justify-content-end">
          <div className="col-12 col-lg-6 d-flex justify-content-center justify-content-lg-end">
            <div className="row">
              <div className="col-12 col-lg-6 d-flex justify-content-center">
                <Controller
                  name="reCaptcha"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange } }) => (
                    <ReCAPTCHA
                      ref={reCaptchaComponent}
                      sitekey={siteConfigs.reCaptchaSiteKey}
                      onChange={onChange}
                      onExpired={(e) => {
                        setValue("reCaptcha", "");
                        reCaptchaComponent.current.reset();
                      }}
                    />
                  )}
                />
              </div>
              <div className="col-12 col-lg-6 d-flex justify-content-center justify-content-lg-end">
                <input
                  type="submit"
                  className="btn btn-success my-2 px-5 btn-lg"
                  disabled={!watch("reCaptcha")}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Imprensa;
