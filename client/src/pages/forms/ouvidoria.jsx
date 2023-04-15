import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import InputMask from "react-input-mask";
import ReCAPTCHA from "react-google-recaptcha";

import config from "../../_config";
import _config from "../../_config";

const Ouvidoria = () => {
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
      const response = await fetch(`/api/tickets/`, {
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
      <h1>Ouvidoria</h1>
      <div className="row">
        <div className="col-12 col-lg-6">
          <p className="text-justify">
            A Ouvidoria da {config.entidade.name} – {config.entidade.name} é o canal de comunicação e relacionamento direto com as Federações,
            Treinadores, Atletas, Colaboradores e a Sociedade Civil.
          </p>
          <p className="text-justify">
            A Ouvidoria foi criada com o objetivo de oferecer à comunidade do Ciclismo (atletas, técnicos, árbitros, comissões técnicas, dirigentes
            esportivos) e à sociedade, um canal de relacionamento direto com a {config.entidade.name} para informações, sugestões, elogios,
            reclamações e denúncias relativas às atividades e/ou ao desempenho institucional da {config.entidade.name} e levá-las aos órgãos
            competentes desta {config.entidade.type}.
          </p>
          <p className="text-justify">
            A Ouvidoria da {config.entidade.name} reflete a sua administração transparente, tendo como objetivo contribuir para uma melhoria continua
            dos serviços prestados, bem como, atender os anseios dos órgãos públicos e da sociedade. É um órgão de natureza mediadora, sem caráter
            deliberativo, não substituindo os tradicionais canais de relacionamento entre as Federações do Mountain Bike e esta {config.entidade.type}
            .
          </p>
          <p className="text-justify">
            A Ouvidoria realiza atendimento eletrônico, via e-mail e/ou por correspondência convencional. A {config.entidade.name} não desconsidera
            demandas anônimas, mas recomenda que as solicitações enviadas seja de forma clara e objetiva.
          </p>
        </div>
        <div className="col-12 col-lg-6">
          <form onSubmit={handleSubmit(onSubmit)} className="needs-validation" noValidate>
            <div className="row">
              <div className="col-12">
                <label htmlFor="name">Nome Completo</label>
                <input
                  id="fullName"
                  className={`form-control ${errors.fullName?.type ? "is-invalid" : getValues("fullName") ? "is-valid" : ""} mb-3`}
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
              <div className="col-12">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  className={`form-control ${errors.email?.type ? "is-invalid" : getValues("email") ? "is-valid" : ""} mb-3`}
                  {...register("email", {
                    required: true,
                    pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/,
                  })}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email?.type && (
                  <div className="alert alert-danger mt-2" role="alert">
                    {errors.email?.type === "server" ? errors.email.message : "Por favor, insira o seu email corretamente."}
                  </div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <label htmlFor="name">Telefone</label>
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
                      className={`form-control ${errors.phone ? "is-invalid" : getValues("phone") ? "is-valid" : ""} mb-3`}
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
            </div>

            <div className="row">
              <div className="col-12">
                <label htmlFor="message">Mensagem</label>
                <textarea
                  id="message"
                  className={`form-control ${errors.message?.type ? "is-invalid" : getValues("message") ? "is-valid" : ""} mb-3`}
                  {...register("message", { required: true })}
                />
              </div>
            </div>

            <div className="row">
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
                      sitekey={_config.site.reCaptchaSiteKey}
                      onChange={onChange}
                      onExpired={(e) => {
                        setValue("reCaptcha", "");
                        reCaptchaComponent.current.reset();
                      }}
                    />
                  )}
                />
              </div>
              <div className="col-12 col-lg-6 text-end">
                <input type="submit" className="btn btn-success my-2 px-5 btn-lg" disabled={!watch("reCaptcha")} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Ouvidoria;
