// Package Components
import React, { Fragment, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

import { useForm } from "react-hook-form";

// Custom Components
import LoadingScreen from "../../utils/loadingScreen";

const PasswordRequest = ({ setTogglePasswordReset }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);
  const {
    getValues,
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/users/passwordRequest`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const parseResponse = await res.json();
      setServerResponse(parseResponse);
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      <button type="button" className="btn btn-link px-0 pt-0 text-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Esqueci a senha
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Esqueci Minha Senha
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {isLoading ? (
                <LoadingScreen />
              ) : !serverResponse ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <p>Digite o email da sua conta abaixo. Mandaremos uma mensagem com as instruções para redefinir sua senha.</p>
                  <label htmlFor="resetEmail">Email</label>
                  <input
                    id="resetEmail"
                    className={`form-control ${errors.resetEmail?.type ? "is-invalid" : getValues("resetEmail") ? "is-valid" : ""}`}
                    {...register("resetEmail", { required: true, pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/ })}
                    aria-invalid={errors.resetEmail ? "true" : "false"}
                  />
                </form>
              ) : (
                <div className={`alert alert-${serverResponse.type === "success" ? "success" : "danger"}`} role="alert">
                  {serverResponse?.type === "success" ? (
                    <Fragment>
                      <h5>Sua solicitação foi enviada com sucesso!</h5>
                      <p>
                        Se o e-mail enviado estiver registrado no nosso banco de dados, você deve receber uma mensagem em instantes com todas as
                        instruções para reaver sua conta.
                      </p>
                      <p>
                        Verifique também sua caixa de lixo/spam. Caso não receba o e-mail em até 15 minutos, entre em contato conosco para que
                        possamos te ajudar.
                      </p>
                    </Fragment>
                  ) : (
                    serverResponse.message
                  )}
                </div>
              )}
            </div>
            {isLoading
              ? null
              : !serverResponse && (
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                      Cancelar
                    </button>
                    <button
                      className="btn btn-block btn-success"
                      disabled={errors.resetEmail || !watch("resetEmail")}
                      onClick={handleSubmit(onSubmit)}
                    >
                      Enviar
                    </button>
                  </div>
                )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PasswordRequest;
