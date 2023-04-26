import React, { Fragment, useState } from "react";

import { useForm, Controller } from "react-hook-form";
import InputMask from "react-input-mask";
import PasswordRequest from "./passwordRequest";

const Login = (props) => {
  const {
    setError,
    control,
    register,
    handleSubmit,
    formState: { errors /* isSubmitted */ },
  } = useForm({ mode: "onChange" });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`/api/users/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const parseData = await res.json();
      if (parseData.token) {
        localStorage.setItem("token", parseData.token);
        props.setUserName(parseData.givenName);
        props.setUserAuthentication(true);
        parseData.role === "admin"
          ? props.setUserAdmin(true)
          : props.setUserAdmin(false);
      } else {
        setError("root.serverError", {
          type: "server",
          message: parseData.message,
        });
        props.setUserAuthentication(false);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <Fragment>
      <div className="container inner-page ">
        <div className="col-12 text-center">
          <h1>Entrar</h1>
        </div>
        <div className="row justify-content-center"></div>
        <div className="row my-3 d-flex justify-content-center">
          <div className="col-10 col-lg-5">
            <form onSubmit={handleSubmit(onSubmit)}>
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
                    className={`form-control ${errors.cpf ? "is-invalid" : ""}`}
                    maskChar=""
                    value={field.value}
                    onChange={field.onChange}
                  >
                    {(inputProps) => <input {...inputProps} type="text" />}
                  </InputMask>
                )}
              />
              <label htmlFor="password">Senha</label>
              <div className="input-group mb-1">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  {...register("password", { required: true })}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <button
                  className="input-group-text"
                  id="button-addon1"
                  type="button"
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
              <hr className="d-none d-lg-block" />

              <button
                className="btn btn-success mt-3 mt-lg-auto form-control"
                onClick={handleSubmit(onSubmit)}
              >
                Login
              </button>
            </form>
            <div>
              <PasswordRequest />
            </div>

            {errors.root?.serverError.type && (
              <div className="alert alert-danger mt-3" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>{" "}
                {errors.root.serverError.message}
              </div>
            )}
            {/* {(errors.password || errors.cpf) && (
              <div className="alert alert-danger mt-3" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i> Preencha corretamente os campos acima.
              </div>
            )} */}
          </div>
          <div className="col-1 d-none d-lg-flex justify-content-center">
            <div className="vr h-100"></div>
          </div>
          <div className="col-10 col-lg-5">
            <hr className="d-block d-lg-none" />
            <div className="d-flex flex-column justify-content-start justify-content-lg-center align-items-center h-100">
              <p className="text-justify">
                Ainda não tem cadastro? Clique no botão abaixo!
              </p>
              <a
                href="/cadastro"
                role={"button"}
                className="btn btn-success form-control"
              >
                Cadastrar-se
              </a>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
