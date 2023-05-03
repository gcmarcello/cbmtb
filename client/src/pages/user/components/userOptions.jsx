import React, { useState, useEffect, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import InputMask from "react-input-mask";
import LoadingScreen from "../../../utils/loadingScreen";
import { toast } from "react-toastify";
const dayjs = require("dayjs");
const cepSearch = require("cep-promise");

const UserOptions = (props) => {
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
  } = useForm({ mode: "onChange", defaultValues: props.userInfo || {} });

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

  const onSubmit = async (data) => {
    try {
      props.setIsLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const response = await fetch(`/api/users/`, {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(data),
      });
      const parseResponse = await response.json();
      if (parseResponse.type === "error") {
        setError("root.serverError", {
          type: parseResponse.type,
          message: parseResponse.message,
        });
      } else {
        toast.success(parseResponse.message, { theme: "colored" });
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      resetField("password");
      setTimeout(function () {
        props.setIsLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (props.userInfo) {
      setValue("firstName", props.userInfo.user_first_name);
      setValue("lastName", props.userInfo.user_last_name);
      setValue("email", props.userInfo.user_email);
      setValue("cpf", props.userInfo.user_cpf);
      setValue("phone", props.userInfo.user_phone);
      setValue("gender", props.userInfo.user_gender);
      setValue(
        "birthDate",
        dayjs(props.userInfo.user_birth_date).format("YYYY-MM-DD")
      );
      setValue("cep", props.userInfo.user_cep);
      setValue("state", props.userInfo.user_state);
      setValue("city", props.userInfo.user_city);
      setValue("address", props.userInfo.user_address);
      setValue("number", props.userInfo.user_number);
      setValue("apartment", props.userInfo.user_apartment);
    }
  }, [props.userInfo, setValue]);

  return (
    <Fragment>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="needs-validation mt-2 px-2"
        noValidate
      >
        <div className="row mb-2">
          <div className="col-12 col-lg-6">
            <label htmlFor="firstName">
              Nome<span className="text-danger">*</span>
            </label>
            <input
              id="firstName"
              className={`form-control ${
                errors.firstName?.type ? "is-invalid" : ""
              }`}
              {...register("firstName", {
                required: true,
                pattern: /^([A-Za-z]+\s*){3,}$/i,
              })}
              aria-invalid={errors.firstName ? "true" : "false"}
            />
          </div>
          <div className="col-12 col-lg-6">
            <label htmlFor="lastName">
              Sobrenome<span className="text-danger">*</span>
            </label>
            <input
              id="lastName"
              className={`form-control ${
                errors.lastName?.type ? "is-invalid" : ""
              }`}
              {...register("lastName", {
                required: true,
                pattern: /^([A-Za-z]+\s*){3,}$/i,
              })}
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
              className={`form-control ${
                errors.email?.type ? "is-invalid" : ""
              }`}
              {...register("email", {
                required: true,
                pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/,
              })}
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
                  className={`form-control ${errors.cpf ? "is-invalid" : ""}`}
                  maskChar=""
                  value={field.value}
                  onChange={field.onChange}
                  disabled={true}
                >
                  {(inputProps) => (
                    <input {...inputProps} disabled type="text" />
                  )}
                </InputMask>
              )}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-lg-6">
            <label htmlFor="phone">Telefone</label>
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
                  className={`form-control ${
                    errors.phone ? "is-invalid" : ""
                  } mb-1`}
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
                <label htmlFor="birthDate">Data de Nascimento</label>
                <input
                  id="birthDate"
                  type="date"
                  className={`form-control ${
                    errors.birthDate?.type ? "is-invalid" : ""
                  }`}
                  {...register("birthDate", {
                    required: true,
                    pattern: /^\d{4}-\d{2}-\d{2}$/i,
                    validate: (date) => dayjs().diff(date, "year") > 1,
                  })}
                  aria-invalid={errors.fullName ? "true" : "false"}
                  disabled
                />
              </div>
              <div className="col-12 col-lg-6">
                <label htmlFor="gender">
                  Sexo<span className="text-danger">*</span>
                </label>
                <select
                  id="gender"
                  defaultValue=""
                  className={`form-select ${
                    errors.gender?.type ? "is-invalid" : ""
                  } mb-1`}
                  {...register("gender", { required: true })}
                  disabled
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
                    <a
                      href="https://www2.correios.com.br/sistemas/buscacep/buscaCep.cfm"
                      target="_blank"
                      rel="noreferrer"
                    >
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
                      className={`form-control ${
                        errors.cep
                          ? "is-invalid"
                          : cepLoading
                          ? "is-loading"
                          : ""
                      } `}
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
                  className={`form-select ${
                    errors.state ? "is-invalid" : ""
                  } mb-1`}
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
                  className={`form-control ${
                    errors.city?.type ? "is-invalid" : ""
                  }`}
                  {...register("city", {
                    required: true,
                    pattern: /^([A-Za-zÀ-ÖØ-öø]+\s*){3,}$/i,
                  })}
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
                  className={`form-control ${
                    errors.address?.type ? "is-invalid" : ""
                  }`}
                  {...register("address", { required: true, pattern: /.{2,}/ })}
                  aria-invalid={errors.address ? "true" : "false"}
                />
              </div>
              <div className="col-12 col-lg-3">
                <label htmlFor="number">Número</label>
                <input
                  id="number"
                  className={`form-control ${
                    errors.number?.type ? "is-invalid" : ""
                  }`}
                  {...register("number", { required: false, pattern: /.{2,}/ })}
                  aria-invalid={errors.number ? "true" : "false"}
                />
              </div>
              <div className="col-12 col-lg-4">
                <label htmlFor="apartment">Complemento</label>
                <input
                  id="apartment"
                  className={`form-control ${
                    errors.apartment?.type ? "is-invalid" : ""
                  }`}
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
        <div className="mt-3">
          <span id="passwordHelpInline" className="form-text">
            Para alterar a data de nascimento, CPF ou gênero, por favor entre em
            contato com a nossa ouvidoria{" "}
            <a href="/ouvidoria">clicando aqui.</a>
          </span>
        </div>
        <hr className="mt-2" />

        <div className="row">
          <div className="col-12 col-lg-6 d-flex align-items-center">
            <div>
              <label htmlFor="password" className="me-2">
                Senha
              </label>
            </div>
            <div className="input-group mb-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`form-control`}
                {...register("password", { required: true })}
                aria-invalid={errors.password ? "true" : "false"}
              />
              <button
                type="button"
                className="input-group-text"
                id="button-addon1"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPassword(!showPassword);
                }}
              >
                <i
                  className={`bi bi-eye${showPassword ? "-slash-" : "-"}fill`}
                ></i>
              </button>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <input
              className="btn btn-success form-control py-2 mt-3 mt-lg-0"
              type="submit"
              value="Salvar Alterações"
              disabled={!watch("password")}
            />
          </div>
          <div className="col-12">
            {errors?.root && (
              <div className="alert alert-danger mt-3" role="alert">
                <i className="bi bi-exclamation-triangle-fill mx-2"></i>
                {errors.root.serverError.message}
              </div>
            )}
          </div>
        </div>
      </form>
    </Fragment>
  );
};

export default UserOptions;
