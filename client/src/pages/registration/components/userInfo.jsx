import { React, Fragment, useEffect } from "react";
import InputMask from "react-input-mask";

const dayjs = require("dayjs");

const UserInfo = (props) => {
  useEffect(() => {
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
  }, [props.user, props.setValue, props]);

  return (
    <Fragment>
      <form className="mb-3">
        <p className="text-justify">
          Verifique suas informações de cadastro antes de se inscrever na prova. Se alguma alteração for necessária, por favor edite os campos e
          clique em avançar para seguir com a inscrição.
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
                <InputMask type="text" id="user_phone" name="user_phone" className="form-control" mask="(99) 99999-9999" />
              </div>
              <div className="col-12 col-lg-6">
                <label htmlFor="user_birth_date">Data de Nascimento</label>
                <input type="date" id="user_birth_date" name="user_birth_date" className="form-control" disabled />
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-1 d-none d-lg-flex justify-content-center">
            <div className="vr h-100"></div>
          </div>
          <div className="col-12 col-lg-5">
            <label htmlFor="user_cep">CEP</label>
            <input type="text" id="user_cep" name="user_cep" className="form-control" />
            <div className="row">
              <div className="col-12 col-lg-6">
                <label htmlFor="user_state">Estado</label>
                <input type="text" id="user_state" name="user_state" className="form-control" />
              </div>
              <div className="col-12 col-lg-6">
                <label htmlFor="user_city">Cidade</label>
                <input type="text" id="user_city" name="user_city" className="form-control" />
              </div>
              <div className="col-12 col-lg-6">
                <label htmlFor="user_street">Endereço</label>
                <input type="text" id="user_street" name="user_street" className="form-control" />
              </div>
              <div className="col-12 col-lg-6">
                <label htmlFor="user_number">Número</label>
                <input type="text" id="user_number" name="user_number" className="form-control" />
              </div>
              <div className="col-12 col-lg-6">
                <label htmlFor="user_neighborhood">Bairro</label>
                <input type="text" id="user_neighborhood" name="user_neighborhood" className="form-control" />
              </div>
              <div className="col-12 col-lg-6">
                <label htmlFor="user_apartment">Complemento</label>
                <input type="text" id="user_apartment" name="user_apartment" className="form-control" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
};

export default UserInfo;
