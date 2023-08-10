import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import LoadingScreen from "../../utils/loadingScreen";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../../context/userContext";

const PasswordReset = (props) => {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const { requestId } = useParams();
  const navigate = useNavigate();
  const {
    getValues,
    register,
    handleSubmit,
    formState: { errors /* isSubmitted */ },
  } = useForm({ mode: "onChange" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/users/passwordReset/${requestId}`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const parseResponse = await res.json();
      if (parseResponse.token) {
        localStorage.setItem("token", parseResponse.token);
        setUserInfo({
          userName: parseResponse.givenName,
          userRole: parseResponse.role,
        });
        navigate("/usuario");
        toast.success("Senha atualizada e login efetuado com sucesso!", {
          theme: "colored",
        });
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const verifyRequest = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/users/passwordRequest/${requestId}`, {
          method: "GET",
          headers: { "Content-type": "application/json" },
        });
        const parseResponse = await res.json();
        if (parseResponse.type === "error") {
          navigate("/");
          toast.error(parseResponse.message, { theme: "colored" });
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    verifyRequest();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="container inner-page ">
      <div className="col-12 mb-3">
        <h1>Redefinir Senha</h1>
      </div>
      <hr />
      <p>
        Bem vindo à página de redefinição de senha. Por favor, digite sua nova
        senha no campo "Nova senha" e confirme digitando-a novamente no campo
        "Confirmar senha". Depois de ter digitado e confirmado sua nova senha,
        clique no botão "Redefinir senha" para atualizá-la.
      </p>
      <p>
        Lembre-se de escolher uma senha forte e segura (nosso sistema irá lhe
        auxiliar com os requerimentos), que seja difícil de adivinhar para
        outras pessoas. Se precisar de ajuda, entre em contato com nossa equipe
        de suporte. Obrigado por usar nossa plataforma e por nos ajudar a manter
        sua conta segura.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-12 col-lg-6 mb-1">
            <label htmlFor="password">
              Nova Senha<span className="text-danger">*</span>
            </label>
            <div className="input-group mb-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`form-control ${
                  errors.password?.type
                    ? "is-invalid"
                    : getValues("password")
                    ? "is-valid"
                    : ""
                } `}
                {...register("password", {
                  required: true,
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                })}
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
                <i
                  className={`bi bi-eye${showPassword ? "-slash-" : "-"}fill`}
                ></i>
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
              Confirmar Nova Senha<span className="text-danger">*</span>
            </label>
            <input
              id="repeatPassword"
              type={showPassword ? "text" : "password"}
              className={`form-control ${
                errors.repeatPassword?.type
                  ? "is-invalid"
                  : getValues("repeatPassword")
                  ? "is-valid"
                  : ""
              } mb-1`}
              {...register("repeatPassword", {
                required: true,
                validate: (value) => value === getValues("password"),
              })}
              aria-invalid={errors.repeatPassword ? "true" : "false"}
            />
          </div>
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-success mt-auto"
              onClick={handleSubmit(onSubmit)}
            >
              Redefinir Senha
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PasswordReset;
