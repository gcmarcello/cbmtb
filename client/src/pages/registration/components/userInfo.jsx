import { React, Fragment, useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { Controller } from "react-hook-form";
import { Link } from "react-router-dom";

const cepSearch = require("cep-promise");

const dayjs = require("dayjs");

const UserInfo = (props) => {
  const [cepLoading, setCepLoading] = useState(false);

  useEffect(() => {
    props.setIsLoading(true);
    if (props.user) {
      props.setValue("firstName", props.user.user_first_name);
      props.setValue("lastName", props.user.user_last_name);
      props.setValue("email", props.user.user_email);
      props.setValue("cpf", props.user.user_cpf);
      props.setValue("phone", props.user.user_phone);
      props.setValue("gender", props.user.user_gender);
      props.setValue("birthDate", dayjs(props.user.user_birth_date).format("YYYY-MM-DD"));
      props.setValue("cep", props.user.user_cep);
      props.setValue("state", props.user.user_state);
      props.setValue("city", props.user.user_city);
      props.setValue("address", props.user.user_address);
      props.setValue("number", props.user.user_number);
      props.setValue("apartment", props.user.user_apartment);
    }
    props.setIsLoading(false);
  }, [props.user]);

  const handleCep = async () => {
    try {
      setCepLoading(true);
      let info = await cepSearch(props.getValues("cep"));
      props.setValue("state", info.state);
      props.setValue("city", info.city);
      props.setValue("address", info.street);
      return true;
    } catch (error) {
      props.setError("cep", {
        type: "server",
        message: "CEP Inválido.",
      });
      props.setValue("state", "");
      props.setValue("city", "");
      props.setValue("address", "");
      return false;
    } finally {
      setCepLoading(false);
    }
  };

  return (
    <Fragment>
      <p className="text-justify">
        Verifique suas informações de cadastro antes de se inscrever na prova. Se alguma alteração for necessária, por favor edite os campos e clique
        em avançar para seguir com a inscrição.
      </p>
      <div className="row">
        <div className="col-12 col-lg-6">
          <label htmlFor="user_given_name">Nome</label>
          <input
            type="text"
            id="user_given_name"
            name="user_given_name"
            className="form-control"
            {...props.register("firstName", { required: true, pattern: /^([A-Za-z]+\s*){3,}$/i })}
          />
          <label htmlFor="user_last_name">Sobrenome</label>
          <input
            type="text"
            id="user_last_name"
            name="user_last_name"
            className="form-control"
            {...props.register("lastName", { required: true, pattern: /^([A-Za-z]+\s*){3,}$/i })}
          />
          <div className="row">
            <div className="col-12 col-lg-6">
              <label htmlFor="user_gender">Sexo</label>
              <select type="text" id="user_gender" name="user_gender" className="form-select" defaultValue={""} disabled>
                <option value="" disabled={true}>
                  {props.user?.user_gender}
                </option>
              </select>
            </div>
            <div className="col-12 col-lg-6">
              <label htmlFor="user_cpf">CPF</label>
              <input type="text" id="user_cpf" name="user_cpf" className="form-control" defaultValue={props.user?.user_cpf} disabled />
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-lg-6">
              <label htmlFor="user_phone">Celular</label>
              <Controller
                name="phone"
                control={props.control}
                defaultValue=""
                rules={{
                  required: true,
                  pattern: /^\d{2}\s\d{5}-\d{4}$/,
                }}
                render={({ field }) => (
                  <InputMask
                    mask="99 99999-9999"
                    className={`form-control ${props.errors.phone ? "is-invalid" : ""} mb-1`}
                    maskChar=""
                    value={field.value}
                    onChange={field.onChange}
                  >
                    {(inputProps) => <input {...inputProps} type="text" />}
                  </InputMask>
                )}
              />
            </div>
            <div className="col-12 col-lg-6">
              <label htmlFor="user_birth_date">Data de Nascimento</label>
              <input
                type="date"
                id="user_birth_date"
                name="user_birth_date"
                className="form-control"
                defaultValue={props.user && dayjs(props.user?.user_birth_date).format("YYYY-MM-DD")}
                disabled
              />
            </div>
            <span id="passwordHelpInline" className="form-text mt-3">
              Para alterar a data de nascimento, CPF ou gênero, por favor entre em contato com a nossa ouvidoria{" "}
              <Link to="/ouvidoria">clicando aqui.</Link>
            </span>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <label htmlFor="user_cep">
            CEP
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
            control={props.control}
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
                className={`form-control ${props.errors.cep ? "is-invalid" : cepLoading ? "is-loading" : ""} `}
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
              <label htmlFor="user_city">Cidade</label>
              <input
                type="text"
                id="user_city"
                name="user_city"
                className="form-control"
                {...props.register("city", { required: true, pattern: /^([A-Za-zÀ-ÖØ-öø]+\s*){3,}$/i })}
              />
            </div>
            <div className="col-12 col-lg-6">
              <label htmlFor="user_state">Estado</label>
              <input type="text" id="user_state" name="user_state" className="form-control" {...props.register("state", { required: true })} />
            </div>
            <div className="col-12">
              <label htmlFor="user_street">Endereço</label>
              <input
                type="text"
                id="user_street"
                name="user_street"
                className="form-control"
                {...props.register("address", { required: true, pattern: /.{2,}/ })}
              />
            </div>
            <div className="col-12 col-lg-6">
              <label htmlFor="user_number">Número</label>
              <input
                type="text"
                id="user_number"
                name="user_number"
                className="form-control"
                {...props.register("number", { required: false, pattern: /.{2,}/ })}
              />
            </div>
            <div className="col-12 col-lg-6">
              <label htmlFor="user_apartment">Complemento</label>
              <input
                type="text"
                id="user_apartment"
                name="user_apartment"
                className="form-control"
                {...props.register("apartment", {
                  required: false,
                  pattern: /.{2,}/,
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UserInfo;
