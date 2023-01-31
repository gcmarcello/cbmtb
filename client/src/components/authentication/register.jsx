import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";

import UserNavigation from "../navbars/userNavigation";

const Register = ({ userAuthentication, setUserAuthentication, userName, setUserName }) => {
  const cepSearch = require("cep-promise");

  const [formInputs, setFormInputs] = useState({
    username: { value: "", isValid: null, isOptional: false },
    email: { value: "", isValid: null, isOptional: false },
    password: { value: "", isValid: null, isOptional: false },
    repeatPassword: { value: "", isValid: null, isOptional: false },
    name: { value: "", isValid: null, isOptional: false },
    lastName: { value: "", isValid: null, isOptional: false },
    cpf: { value: "", isValid: null, isOptional: false },
    birthDate: { value: "", isValid: null, isOptional: false },
    phone: { value: "", isValid: null, isOptional: false },
    gender: { value: "", isValid: null, isOptional: false },
    cep: { value: "", isValid: null, isOptional: false },
    state: { value: "", isValid: null, isOptional: false },
    city: { value: "", isValid: null, isOptional: false },
    neighborhood: { value: "", isValid: null, isOptional: false },
    street: { value: "", isValid: null, isOptional: false },
    number: { value: "", isValid: null, isOptional: true },
    apartment: { value: "", isValid: null, isOptional: true },
  });
  const [inputArray, setInputArray] = useState(Object.values(formInputs));
  const [isFormValid, setIsFormValid] = useState(false);
  const [responseError, setResponseError] = useState({});

  const {
    username,
    email,
    password,
    repeatPassword,
    name,
    lastName,
    cpf,
    birthDate,
    phone,
    gender,
    cep,
    state,
    city,
    neighborhood,
    street,
    number,
    apartment,
  } = formInputs;

  const [disableFields, setDisableFields] = useState(true);
  const [CEPError, setCEPError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    e.target.name === "repeatPassword"
      ? setFormInputs({
          ...formInputs,
          [e.target.name]:
            {
              value: e.target.value,
              isValid: e.target.value === "" ? null : e.target.value === password.value ? true : false,
              isOptional: formInputs[e.target.name].isOptional,
            } || "",
        })
      : setFormInputs({
          ...formInputs,
          [e.target.name]:
            {
              value: e.target.value,
              isValid: e.target.value === "" ? null : handleValidation(e, e.target.name),
              isOptional: formInputs[e.target.name].isOptional,
            } || "",
        });
  };

  const handleValidation = (e, type) => {
    let regexCheck;
    switch (type) {
      case "username":
        regexCheck = /^[a-z0-9]{3,16}$/.test(e.target.value);
        break;
      case "email":
        regexCheck = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(e.target.value);
        break;
      case "password":
        regexCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(e.target.value);
        break;
      case "name":
        regexCheck = /^.{3,}$/.test(e.target.value);
        break;
      case "lastName":
        regexCheck = /^.{3,}$/.test(e.target.value);
        break;
      case "cpf":
        regexCheck = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[0-9]{2}$/.test(e.target.value);
        break;
      case "birthDate":
        regexCheck = /^[0-9]{4}-?[0-9]{2}-?[0-9]{2}$/.test(e.target.value);
        break;
      case "gender":
        regexCheck = /^(masc|fem)$/.test(e.target.value);
        break;
      case "phone":
        regexCheck = /^\(\d{2}\) \d{5}-\d{4}$/.test(e.target.value);
        break;
      case "state":
        regexCheck = /^.{2}$/.test(e.target.value);
        break;
      case "city":
        regexCheck = /^.{2,}$/.test(e.target.value);
        break;
      case "neighborhood":
        regexCheck = /^.{2,}$/.test(e.target.value);
        break;
      case "number":
        regexCheck = /^.{1,}$/.test(e.target.value);
        break;
      case "apartment":
        regexCheck = /^.{1,}$/.test(e.target.value);
        break;
      default:
        regexCheck = null;
    }
    return regexCheck;
  };

  const handleCep = async () => {
    let info;
    try {
      setCEPError(false);
      setLoading(true);
      if (cep.value.replace(/[^0-9]+/, "").length > 6) {
        info = await cepSearch(cep.value);
        setFormInputs({
          ...formInputs,
          cep: { value: info.cep, isValid: true, isOptional: false },
          state: { value: info.state, isValid: true, isOptional: false },
          city: { value: info.city, isValid: true, isOptional: false },
          neighborhood: { value: info.neighborhood, isValid: true, isOptional: false },
          street: { value: info.street, isValid: true, isOptional: false },
        });
      } else if (cep.replace(/[^0-9]+/, "").length === 0) {
        setFormInputs({
          ...formInputs,
          cep: { value: "", isValid: null, isOptional: false },
          state: { value: "", isValid: null, isOptional: false },
          city: { value: "", isValid: null, isOptional: false },
          neighborhood: { value: "", isValid: null, isOptional: false },
          street: { value: "", isValid: null, isOptional: false },
        });
      }
      setLoading(false);
      setDisableFields(false);
    } catch (error) {
      setFormInputs({ ...formInputs, cep: { value: cep.value, isValid: false } });
      setFormInputs({
        ...formInputs,
        cep: { value: "", isValid: null, isOptional: false },
        state: { value: "", isValid: null, isOptional: false },
        city: { value: "", isValid: null, isOptional: false },
        neighborhood: { value: "", isValid: null, isOptional: false },
        street: { value: "", isValid: null, isOptional: false },
      });
      setCEPError(true);
      setLoading(false);
      console.error(error);
    }

    return info;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errorArray = {};

    Object.keys(formInputs).forEach((key) => {
      let isValid = formInputs[key].isValid;
      let isOptional = formInputs[key].isOptional;

      if (!isValid && !isOptional) {
        errorArray = { ...errorArray, [key]: { value: formInputs[key].value, isValid: false, isOptional: formInputs[key].isOptional } };
      } else if (!isValid && isOptional) {
        errorArray = { ...errorArray, [key]: { value: formInputs[key].value, isValid: true, isOptional: formInputs[key].isOptional } };
      } else if (isValid && isOptional) {
        errorArray = { ...errorArray, [key]: { value: formInputs[key].value, isValid: true, isOptional: formInputs[key].isOptional } };
      } else if (isValid && !isOptional) {
        errorArray = { ...errorArray, [key]: { value: formInputs[key].value, isValid: true, isOptional: formInputs[key].isOptional } };
      }
    });

    setFormInputs(errorArray);
    if (!isFormValid) {
      return;
    }

    try {
      let bodyJSON = {};
      Object.keys(formInputs).forEach((key) => {
        bodyJSON = { ...bodyJSON, [key]: formInputs[key].value };
      });

      const body = bodyJSON;

      const res = await fetch(`/api/users/register`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const parseData = await res.json();
      if (parseData.token) {
        localStorage.setItem("token", parseData.token);
        setUserAuthentication(true);
        navigate("/");
      } else {
        setResponseError(parseData);
        setFormInputs({ ...formInputs, [parseData.type]: { ...formInputs.type, isValid: false } });
        setUserAuthentication(false);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    setInputArray(Object.values(formInputs));
    if (inputArray.some((input) => !input.isValid && !input.isOptional)) {
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    } // eslint-disable-next-line
  }, [formInputs]);

  return (
    <Fragment>
      <UserNavigation userAuthentication={userAuthentication} setUserAuthentication={setUserAuthentication} />
      <div className="container inner-page">
        {responseError.message ? (
          <div class="alert alert-danger d-flex align-items-center" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-3"></i>
            <div>{responseError.message}</div>
          </div>
        ) : (
          ""
        )}
        <form className="needs-validation" noValidate>
          <h1 className="mb-2 text-center">Cadastro de Atleta</h1>
          <h4>Informações de Login</h4>
          <div className="row">
            <div className="col-12 col-lg-6 mb-3">
              <input
                type="text"
                id="username"
                name="username"
                value={username.value}
                onChange={(e) => handleChange(e)}
                className={`form-control ${
                  formInputs.username.isValid === true ? "is-valid" : formInputs.username.isValid === false ? "is-invalid" : ""
                }`}
                required
                placeholder="Usuário"
              />
              {formInputs.username.isValid === false ? (
                <div className="invalid-feedback">{responseError.type === "username" ? "Usuário já utilizado." : "Usuário inválido"}</div>
              ) : (
                <div className="valid-feedback">Usuário válido!</div>
              )}
              <small id="userHelp" className="form-text text-muted">
                Nome de usuário para efetuar login no sistema.
              </small>
            </div>
            <div className="col-12 col-lg-6 mb-3">
              <input
                type="text"
                id="email"
                name="email"
                value={email.value}
                onChange={(e) => handleChange(e)}
                className={`form-control ${formInputs.email.isValid === true ? "is-valid" : formInputs.email.isValid === false ? "is-invalid" : ""}`}
                required
                placeholder="Email"
              />
              {formInputs.email.isValid === false ? (
                <div className="invalid-feedback">{responseError.type === "username" ? "Email já utilizado." : "Email inválido"}</div>
              ) : (
                <div className="valid-feedback">Email válido!</div>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-lg-6">
              <input
                type="password"
                id="password"
                name="password"
                value={password.value}
                onChange={(e) => handleChange(e)}
                className={`form-control ${
                  formInputs.password.isValid === true ? "is-valid" : formInputs.password.isValid === false ? "is-invalid" : ""
                }`}
                required
                placeholder="Senha"
              />
              {formInputs.password.isValid === false ? (
                <div className="invalid-feedback">Senha inválida.</div>
              ) : (
                <div className="valid-feedback"></div>
              )}
              <small id="passwordHelp" className="form-text text-muted">
                A sua senha deve conter: A-Z , a-z, 0-9, *-!
              </small>
            </div>
            <div className="col-12 col-lg-6">
              <input
                type="password"
                id="repeatPassword"
                name="repeatPassword"
                value={repeatPassword.value}
                onChange={(e) => handleChange(e)}
                className={`form-control ${
                  formInputs.repeatPassword.isValid === true ? "is-valid" : formInputs.repeatPassword.isValid === false ? "is-invalid" : ""
                }`}
                required
                placeholder="Confirmar Senha"
              />
              {formInputs.repeatPassword.isValid === false ? (
                <div className="invalid-feedback">Senhas não coincidem.</div>
              ) : (
                <div className="valid-feedback">Senha correta!</div>
              )}
            </div>
          </div>
          <hr />
          <h4>Informações Cadastrais</h4>
          <div className="row">
            <div className="col-12 col-lg-5">
              <div className="col-12 ">
                <label htmlFor="birthDate" className="form-label">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name.value}
                  onChange={(e) => handleChange(e)}
                  className={`form-control mb-3 ${
                    formInputs.name.isValid === true ? "is-valid" : formInputs.name.isValid === false ? "is-invalid" : ""
                  }`}
                  required
                  placeholder="Nome"
                />
                <label htmlFor="birthDate" className="form-label">
                  Sobrenome
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={lastName.value}
                  onChange={(e) => handleChange(e)}
                  className={`form-control mb-3 ${
                    formInputs.lastName.isValid === true ? "is-valid" : formInputs.lastName.isValid === false ? "is-invalid" : ""
                  }`}
                  required
                  placeholder="Sobrenome"
                />
                <div className="row">
                  <div className="col-12 col-lg-6">
                    <label htmlFor="birthDate" className="form-label">
                      Sexo
                    </label>
                    <select
                      className={`form-select mb-3 ${
                        formInputs.gender.isValid === true ? "is-valid" : formInputs.gender.isValid === false ? "is-invalid" : ""
                      }`}
                      aria-label="Default select example"
                      name="gender"
                      value={gender.value}
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="" disabled={disableFields}>
                        Selecione
                      </option>
                      <option value="masc">Masculino</option>
                      <option value="fem">Feminino</option>
                    </select>
                  </div>
                  <div className="col-12 col-lg-6">
                    <label htmlFor="birthDate" className="form-label">
                      CPF
                    </label>
                    <InputMask
                      type="text"
                      id="cpf"
                      name="cpf"
                      value={cpf.value}
                      mask="999.999.999-99"
                      onChange={(e) => handleChange(e)}
                      className={`form-control mb-3 ${
                        formInputs.cpf.isValid === true ? "is-valid" : formInputs.cpf.isValid === false ? "is-invalid" : ""
                      }`}
                      required
                      placeholder="111.111.111-11"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-lg-6">
                    <label htmlFor="birthDate" className="form-label">
                      Celular
                    </label>
                    <InputMask
                      type="text"
                      id="phone"
                      name="phone"
                      value={phone.value}
                      mask="(99) 99999-9999"
                      onChange={(e) => handleChange(e)}
                      className={`form-control mb-3 ${
                        formInputs.phone.isValid === true ? "is-valid" : formInputs.phone.isValid === false ? "is-invalid" : ""
                      }`}
                      required
                      placeholder="(11) 91111-1111"
                    />
                  </div>
                  <div className="col-12 col-lg-6">
                    <label htmlFor="birthDate" className="form-label">
                      Nascimento
                    </label>
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={birthDate.value}
                      onChange={(e) => handleChange(e)}
                      className={`form-control mb-3 ${
                        formInputs.birthDate.isValid === true ? "is-valid" : formInputs.birthDate.isValid === false ? "is-invalid" : ""
                      }`}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-2 d-flex justify-content-center">
              <div className="vr h-100 d-none d-md-block"></div>
            </div>
            <div className="col-12 col-lg-5">
              <div className="row">
                <div className="col-12">
                  <label htmlFor="cep" className="form-label">
                    CEP
                  </label>
                  <div className="input-group">
                    <InputMask
                      type="text"
                      id="cep"
                      name="cep"
                      value={cep.value}
                      mask="99999-999"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      onBlur={() => {
                        handleCep();
                      }}
                      className={`form-control ${formInputs.cep.isValid ? "is-valid" : formInputs.cep.isValid === false ? "is-invalid" : ""}`}
                      style={{ "--bs-bg-opacity": "0.1" }}
                      required
                      placeholder="00000-000"
                    />
                    <span className="input-group-text" id="basic-addon1" onClick={() => setDisableFields(false)}>
                      {loading ? (
                        <div className="spinner-border" role="status" style={{ width: "1rem", height: "1rem" }}></div>
                      ) : CEPError === false ? (
                        <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target={"_blank"} rel={"noreferrer"}>
                          Não sei meu CEP
                        </a>
                      ) : (
                        <span className="text-danger">CEP Inválido!</span>
                      )}
                    </span>
                  </div>
                  <small id="emailHelp" className="form-text text-muted">
                    Digite o CEP para encontrar o endereço.
                  </small>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-lg-6">
                  <label htmlFor="birthDate" className="form-label">
                    Estado
                  </label>
                  <select
                    className={`form-control mb-3 ${
                      formInputs.state.isValid === true ? "is-valid" : formInputs.state.isValid === false ? "is-invalid" : ""
                    }`}
                    aria-label="state select"
                    name="state"
                    value={state.value}
                    onChange={(e) => handleChange(e)}
                    disabled={disableFields}
                  >
                    <option value="" disabled={disableFields}>
                      Selecione
                    </option>
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option>
                    <option value="SE">Sergipe</option>
                    <option value="TO">Tocantins</option>
                    <option value="EX">Estrangeiro</option>
                  </select>
                </div>
                <div className="col-12 col-lg-6">
                  <label htmlFor="birthDate" className="form-label">
                    Cidade
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={city.value}
                    onChange={(e) => handleChange(e)}
                    className={`form-control mb-3 ${
                      formInputs.city.isValid === true ? "is-valid" : formInputs.city.isValid === false ? "is-invalid" : ""
                    }`}
                    required
                    placeholder="Cidade"
                    disabled={disableFields}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-lg-6">
                  <label htmlFor="birthDate" className="form-label">
                    Endereço
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={street.value}
                    onChange={(e) => handleChange(e)}
                    className={`form-control ${
                      formInputs.street.isValid === true ? "is-valid" : formInputs.street.isValid === false ? "is-invalid" : ""
                    }`}
                    required
                    placeholder="ex. Nome da rua/avenida"
                    disabled={disableFields}
                  />
                </div>
                <div className="col-12 col-lg-6 ">
                  <label htmlFor="birthDate" className="form-label">
                    Número do Endereço
                  </label>
                  <input
                    type="text"
                    id="number"
                    name="number"
                    value={number.value}
                    onChange={(e) => handleChange(e)}
                    className={`form-control  ${
                      formInputs.number.isValid === true ? "is-valid" : formInputs.number.isValid === false ? "is-invalid" : ""
                    }`}
                    required
                    placeholder="ex. Número 000"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-lg-6">
                  <label htmlFor="birthDate" className="form-label">
                    Bairro
                  </label>
                  <input
                    type="text"
                    id="neighborhood"
                    name="neighborhood"
                    value={neighborhood.value}
                    onChange={(e) => handleChange(e)}
                    className={`form-control mb-3 ${
                      formInputs.neighborhood.isValid === true ? "is-valid" : formInputs.neighborhood.isValid === false ? "is-invalid" : ""
                    }`}
                    required
                    placeholder="Bairro"
                    disabled={disableFields}
                  />
                </div>
                <div className="col-12 col-lg-6">
                  <label htmlFor="birthDate" className="form-label">
                    Complemento/Apartamento
                  </label>
                  <input
                    type="text"
                    id="apartment"
                    name="apartment"
                    value={apartment.value}
                    onChange={(e) => handleChange(e)}
                    className={`form-control mb-3 ${
                      formInputs.apartment.isValid === true ? "is-valid" : formInputs.apartment.isValid === false ? "is-invalid" : ""
                    }`}
                    required
                    placeholder="ex. Apartamento 000"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button className="btn btn-success btn-lg mt-3" onClick={(e) => handleSubmit(e)}>
              Registrar
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default Register;
