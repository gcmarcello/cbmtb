import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import InputMask from "react-input-mask";

const Ouvidoria = () => {
  const navigate = useNavigate();
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm({ mode: "onChange" });

  const onSubmit = async (data) => {
    try {
      const body = data;
      const response = await fetch(`/api/forms/ombudsman/`, {
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
            A Ouvidoria da CBMTB – Confederação Brasileira de Mountain Bike é o canal de comunicação e relacionamento direto com as Federações,
            Treinadores, Atletas, Colaboradores e a Sociedade Civil.
          </p>
          <p className="text-justify">
            A Ouvidoria foi criada com o objetivo de oferecer à comunidade do Ciclismo (atletas, técnicos, árbitros, comissões técnicas, dirigentes
            esportivos) e à sociedade, um canal de relacionamento direto com a CBMTB para informações, sugestões, elogios, reclamações e denúncias
            relativas às atividades e/ou ao desempenho institucional da Confederação Brasileira de Mountain Bike e levá-las aos órgãos competentes
            desta Confederação.
          </p>
          <p className="text-justify">
            A Ouvidoria da CBMTB reflete a sua administração transparente, tendo como objetivo contribuir para uma melhoria continua dos serviços
            prestados, bem como, atender os anseios dos órgãos públicos e da sociedade. É um órgão de natureza mediadora, sem caráter deliberativo,
            não substituindo os tradicionais canais de relacionamento entre as Federações do Mountain Bike e esta Confederação.
          </p>
          <p className="text-justify">
            A Ouvidoria realiza atendimento eletrônico, via e-mail e/ou por correspondência convencional. A CBMTB não desconsidera demandas anônimas,
            mas recomenda que as solicitações enviadas seja de forma clara e objetiva.
          </p>
        </div>
        <div className="col-12 col-lg-6">
          <form onSubmit={handleSubmit(onSubmit)} className="needs-validation" noValidate>
            <div className="row">
              <div className="col-12">
                <label htmlFor="name">Nome Completo</label>
                <input
                  id="fullName"
                  className={`form-control ${errors.fullName?.type ? "is-invalid" : ""} mb-3`}
                  {...register("fullName", { required: true, pattern: /^([A-Za-z]+\s*){3,}$/i })}
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
                  className={`form-control ${errors.email?.type ? "is-invalid" : ""} mb-3`}
                  {...register("email", { required: true, pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/ })}
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
                    pattern: /^\(\d{2}\)\s\d{5}-\d{4}$/,
                  }}
                  render={({ field }) => (
                    <InputMask
                      mask="(99) 99999-9999"
                      className={`form-control ${errors.phone ? "is-invalid" : ""} mb-3`}
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
                <textarea id="message" className={`form-control mb-3`} {...register("message")} />
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <input type="submit" className="btn btn-success" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Ouvidoria;
