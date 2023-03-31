import React, { useState } from "react";
import { Controller } from "react-hook-form";

import InputMask from "react-input-mask";
import ReCAPTCHA from "react-google-recaptcha";
import { animateScroll } from "react-scroll";

// import { properErrorNames } from "../functions/properNames";
import { siteConfigs } from "../../../App.config";
const dayjs = require("dayjs");

const RegistrationForm = ({
  onSubmit,
  reCaptchaComponent,
  getValues,
  setError,
  setValue,
  watch,
  control,
  register,
  handleSubmit,
  errors,
  clearErrors,
}) => {
  const cepSearch = require("cep-promise");

  const [showPassword, setShowPassword] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  const handleCep = async () => {
    try {
      setCepLoading(true);
      let info = await cepSearch(getValues("cep"));
      setValue("state", info.state);
      setValue("city", info.city);
      setValue("address", info.street);
      return true;
    } catch (error) {
      setError("cep", {
        type: "server",
        message: "CEP Inválido.",
      });
      setValue("state", "");
      setValue("city", "");
      setValue("address", "");
      return false;
    } finally {
      setCepLoading(false);
    }
  };

  return (
    <div className="container inner-page px-3">
      {errors?.root && (
        <div className="alert alert-danger mt-2" role="alert">
          <i class="bi bi-exclamation-triangle-fill mx-2"></i>
          {errors.root.serverError.message} Clique aqui para fazer login ou recuperar sua senha.
        </div>
      )}
      <h1>Cadastro de Atleta</h1>
      <hr />
      <h2>Informações de Cadastro</h2>
      {/* {isSubmitted ? (
        <div className="alert alert-danger mt-2" role="alert">
          Esses campos não foram preenchidos corretamente:
          <ul className="d-flex flex-wrap">
            {Object.keys(errors).map((error) => (
              <li className="mx-3">{properErrorNames(error)}</li>
            ))}
          </ul>
        </div>
      ) : (
        ""
      )} */}
      <form onSubmit={handleSubmit(onSubmit)} className="needs-validation" noValidate>
        <div className="row mb-2">
          <div className="col-12 col-lg-6">
            <label htmlFor="firstName">
              Nome<span className="text-danger">*</span>
            </label>
            <input
              id="firstName"
              className={`form-control ${errors.firstName?.type ? "is-invalid" : getValues("firstName") ? "is-valid" : ""}`}
              {...register("firstName", { required: true, pattern: /^([A-Za-z]+\s*){3,}$/i })}
              aria-invalid={errors.firstName ? "true" : "false"}
            />
            {/* Show errors in between form */}
            {/* {errors.firstName && (
              <div className="alert alert-danger mt-2" role="alert">
                Por favor, insira o seu nome.
              </div>
            )} */}
          </div>
          <div className="col-12 col-lg-6">
            <label htmlFor="lastName">
              Sobrenome<span className="text-danger">*</span>
            </label>
            <input
              id="lastName"
              className={`form-control ${errors.lastName?.type ? "is-invalid" : getValues("lastName") ? "is-valid" : ""}`}
              {...register("lastName", { required: true, pattern: /^([A-Za-z]+\s*){3,}$/i })}
              aria-invalid={errors.fullName ? "true" : "false"}
            />
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-12 col-lg-6">
            <label htmlFor="email">
              Email<span className="text-danger">*</span>
            </label>
            <input
              id="email"
              className={`form-control ${errors.email?.type ? "is-invalid" : getValues("email") ? "is-valid" : ""}`}
              {...register("email", { required: true, pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/ })}
              aria-invalid={errors.email ? "true" : "false"}
            />
          </div>
          <div className="col-12 col-lg-6">
            <label htmlFor="name">
              CPF<span className="text-danger">*</span>
            </label>
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
                  className={`form-control ${errors.cpf ? "is-invalid" : getValues("cpf") ? "is-valid" : ""}`}
                  maskChar=""
                  value={field.value}
                  onChange={field.onChange}
                >
                  {(inputProps) => <input {...inputProps} type="text" />}
                </InputMask>
              )}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-lg-6 mb-1">
            <label htmlFor="password">
              Senha<span className="text-danger">*</span>
            </label>
            <div className="input-group mb-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`form-control ${errors.password?.type ? "is-invalid" : getValues("password") ? "is-valid" : ""} `}
                {...register("password", { required: true, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ })}
                aria-invalid={errors.password ? "true" : "false"}
              />
              <button
                className="input-group-text"
                id="button-addon1"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPassword(!showPassword);
                }}
              >
                <i className={`bi bi-eye${showPassword ? "-slash-" : "-"}fill`}></i>
              </button>
            </div>
            {errors.password && (
              <div className="alert alert-danger mt-2" role="alert">
                Sua senha deve conter:{" "}
                <ul>
                  <li>Uma letra maiúscula</li>
                  <li>Uma letra minúscula</li>
                  <li>Um número</li>
                  <li>Um caractere especial (*&%!@?)</li>
                  <li>8 caracteres</li>
                </ul>
              </div>
            )}
          </div>
          <div className="col-12 col-lg-6 mb-1">
            <label htmlFor="repeatPassword">
              Confirmar Senha<span className="text-danger">*</span>
            </label>
            <input
              id="repeatPassword"
              type={showPassword ? "text" : "password"}
              className={`form-control ${errors.repeatPassword?.type ? "is-invalid" : getValues("repeatPassword") ? "is-valid" : ""} mb-1`}
              {...register("repeatPassword", { required: true, validate: (value) => value === getValues("password") })}
              aria-invalid={errors.repeatPassword ? "true" : "false"}
            />
          </div>
        </div>
        <hr />
        <h2>Informações Pessoais</h2>
        <div className="row">
          <div className="col-12 col-lg-6">
            <label htmlFor="phone">
              Telefone<span className="text-danger">*</span>
            </label>
            <Controller
              name="phone"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: /^\d{2}\s\d{5}-\d{4}$/,
              }}
              render={({ field }) => (
                <InputMask
                  mask="99 99999-9999"
                  className={`form-control ${errors.phone ? "is-invalid" : getValues("phone") ? "is-valid" : ""} mb-1`}
                  maskChar=""
                  value={field.value}
                  onChange={field.onChange}
                >
                  {(inputProps) => <input {...inputProps} type="text" />}
                </InputMask>
              )}
            />
            <div className="row">
              <div className="col-12 col-lg-6">
                <label htmlFor="birthDate">
                  Data de Nascimento<span className="text-danger">*</span>
                </label>
                <input
                  id="birthDate"
                  type="date"
                  className={`form-control ${errors.birthDate?.type ? "is-invalid" : watch("birthDate") ? "is-valid" : ""}`}
                  {...register("birthDate", { required: true, pattern: /^\d{4}-\d{2}-\d{2}$/i, validate: (date) => dayjs().diff(date, "year") > 1 })}
                  aria-invalid={errors.fullName ? "true" : "false"}
                />
              </div>
              <div className="col-12 col-lg-6">
                <label htmlFor="gender">
                  Sexo<span className="text-danger">*</span>
                </label>
                <select
                  id="gender"
                  defaultValue=""
                  className={`form-select ${errors.gender?.type ? "is-invalid" : getValues("gender") ? "is-valid" : ""} mb-1`}
                  {...register("gender", { required: true })}
                >
                  <option value="" disabled>
                    Selecionar
                  </option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>
            </div>
            {errors.birthDate && (
              <div className="alert alert-danger mt-2" role="alert">
                Por favor, verifique sua data de nascimento.
              </div>
            )}
          </div>

          <div className="col-12 col-lg-6">
            <div className="row">
              <div className="col-12 col-xl-5">
                <label htmlFor="name">
                  CEP<span className="text-danger">*</span>
                  <span className="text-muted small">
                    {" "}
                    (Não sabe? Clique{" "}
                    <a href="https://www2.correios.com.br/sistemas/buscacep/buscaCep.cfm" target="_blank" rel="noreferrer">
                      aqui.
                    </a>
                    )
                  </span>
                </label>
                <Controller
                  name="cep"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                    validate: (value) => {
                      if (/^\d{5}-\d{3}$/.test(value) && handleCep()) {
                        return true;
                      }
                      return false;
                    },
                  }}
                  render={({ field }) => (
                    <InputMask
                      mask="99999-999"
                      name="cep"
                      className={`form-control ${errors.cep ? "is-invalid" : cepLoading ? "is-loading" : getValues("cep") ? "is-valid" : ""} `}
                      maskChar=""
                      value={field.value}
                      onChange={field.onChange}
                    >
                      {(inputProps) => <input {...inputProps} type="text" />}
                    </InputMask>
                  )}
                />
              </div>
              <div className="col-12 col-xl-3">
                <label htmlFor="state">
                  Estado<span className="text-danger">*</span>
                </label>
                <select
                  id="state"
                  defaultValue=""
                  className={`form-select ${errors.state ? "is-invalid" : watch("state") ? "is-valid" : ""} mb-1`}
                  {...register("state", { required: true })}
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  <option value="AC">AC</option>
                  <option value="AL">AL</option>
                  <option value="AP">AP</option>
                  <option value="AM">AM</option>
                  <option value="BA">BA</option>
                  <option value="CE">CE</option>
                  <option value="DF">DF</option>
                  <option value="ES">ES</option>
                  <option value="GO">GO</option>
                  <option value="MA">MA</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="MG">MG</option>
                  <option value="PA">PA</option>
                  <option value="PB">PB</option>
                  <option value="PR">PR</option>
                  <option value="PE">PE</option>
                  <option value="PI">PI</option>
                  <option value="RJ">RJ</option>
                  <option value="RN">RN</option>
                  <option value="RS">RS</option>
                  <option value="RO">RO</option>
                  <option value="RR">RR</option>
                  <option value="SC">SC</option>
                  <option value="SP">SP</option>
                  <option value="SE">SE</option>
                  <option value="TO">TO</option>
                </select>
              </div>
              <div className="col-12 col-xl-4">
                <label htmlFor="city">
                  Cidade<span className="text-danger">*</span>
                </label>
                <input
                  id="city"
                  className={`form-control ${errors.city?.type ? "is-invalid" : getValues("city") ? "is-valid" : ""}`}
                  {...register("city", { required: true, pattern: /^([A-Za-zÀ-ÖØ-öø]+\s*){3,}$/i })}
                  aria-invalid={errors.city ? "true" : "false"}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-lg-5">
                <label htmlFor="address">
                  Endereço<span className="text-danger">*</span>
                </label>
                <input
                  id="address"
                  className={`form-control ${errors.address?.type ? "is-invalid" : getValues("address") ? "is-valid" : ""}`}
                  {...register("address", { required: true, pattern: /.{2,}/ })}
                  aria-invalid={errors.address ? "true" : "false"}
                />
              </div>
              <div className="col-12 col-lg-3">
                <label htmlFor="number">Número</label>
                <input
                  id="number"
                  className={`form-control ${errors.number?.type ? "is-invalid" : getValues("number") ? "is-valid" : ""}`}
                  {...register("number", { required: false, pattern: /.{2,}/ })}
                  aria-invalid={errors.number ? "true" : "false"}
                />
              </div>
              <div className="col-12 col-lg-4">
                <label htmlFor="apartment">Complemento</label>
                <input
                  id="apartment"
                  className={`form-control ${errors.apartment?.type ? "is-invalid" : getValues("apartment") ? "is-valid" : ""}`}
                  {...register("apartment", {
                    required: false,
                    pattern: /.{2,}/,
                  })}
                  aria-invalid={errors.apartment ? "true" : "false"}
                />
              </div>
            </div>
          </div>
        </div>
        <hr className="mt-4" />
        <div className="row justify-content-end">
          <div className="col-12 col-lg-6 ">
            <div className="row justify-content-between">
              <div className="col-12 col-lg-6">
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
              <div className="col-12 col-lg-4 d-flex align-items-center">
                <button
                  className="btn btn-success form-control"
                  onClick={() => {
                    clearErrors("root.serverError");
                    handleSubmit(onSubmit);
                    animateScroll.scrollToTop();
                  }}
                  disabled={!watch("reCaptcha")}
                >
                  Cadastrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
