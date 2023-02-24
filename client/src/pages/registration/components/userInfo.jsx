import { React, Fragment } from "react";
import InputMask from "react-input-mask";

const UserInfo = ({ user, event, categories, registrationInfo, setRegistrationInfo }) => {
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
              value={user.user_given_name}
              onChange={(e) => setRegistrationInfo({ ...registrationInfo, user: { ...user, [e.target.name]: e.target.value } })}
            />
            <label htmlFor="user_last_name">Sobrenome</label>
            <input
              type="text"
              id="user_last_name"
              name="user_last_name"
              className="form-control"
              value={user.user_last_name}
              onChange={(e) => setRegistrationInfo({ ...registrationInfo, user: { ...user, [e.target.name]: e.target.value } })}
            />
            {
              <div className="row">
                <div className="col-12 col-lg-6">
                  <label htmlFor="user_gender">Sexo</label>
                  <select type="text" id="user_gender" name="user_gender" className="form-select" defaultValue={user.user_gender} disabled>
                    <option value="" disabled={true}>
                      Selecione
                    </option>
                    <option value={"masc"}>Masculino</option>
                    <option value={"fem"}>Feminino</option>
                  </select>
                </div>
                <div className="col-12 col-lg-6">
                  <label htmlFor="user_cpf">CPF</label>
                  <input type="text" id="user_cpf" name="user_cpf" className="form-control" defaultValue={user.user_cpf} disabled />
                </div>
              </div>
            }
            <div className="row">
              <div className="col-12 col-lg-6">
                <label htmlFor="user_phone">Celular</label>
                <InputMask
                  type="text"
                  id="user_phone"
                  name="user_phone"
                  className="form-control"
                  value={user.user_phone}
                  mask="(99) 99999-9999"
                  onChange={(e) => setRegistrationInfo({ ...registrationInfo, user: { ...user, [e.target.name]: e.target.value } })}
                />
              </div>
              <div className="col-12 col-lg-6">
                <label htmlFor="user_birth_date">Data de Nascimento</label>
                <input
                  type="date"
                  id="user_birth_date"
                  name="user_birth_date"
                  className="form-control"
                  defaultValue={user.user_formattedDate}
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-1 d-none d-lg-flex justify-content-center">
            <div className="vr h-100"></div>
          </div>
          <div className="col-12 col-lg-5">
            <label htmlFor="user_cep">CEP</label>
            <input
              type="text"
              id="user_cep"
              name="user_cep"
              className="form-control"
              value={user.user_cep}
              onChange={(e) => setRegistrationInfo({ ...registrationInfo, user: { ...user, [e.target.name]: e.target.value } })}
            />
            <div className="row">
              <div className="col-12 col-lg-6">
                <label htmlFor="user_state">Estado</label>
                <input
                  type="text"
                  id="user_state"
                  name="user_state"
                  className="form-control"
                  value={user.user_state}
                  onChange={(e) => setRegistrationInfo({ ...registrationInfo, user: { ...user, [e.target.name]: e.target.value } })}
                />
              </div>
              <div className="col-12 col-lg-6">
                <label htmlFor="user_city">Cidade</label>
                <input
                  type="text"
                  id="user_city"
                  name="user_city"
                  className="form-control"
                  value={user.user_city}
                  onChange={(e) => setRegistrationInfo({ ...registrationInfo, user: { ...user, [e.target.name]: e.target.value } })}
                />
              </div>
              <div className="col-12 col-lg-6">
                <label htmlFor="user_street">Endereço</label>
                <input
                  type="text"
                  id="user_street"
                  name="user_street"
                  className="form-control"
                  value={user.user_street}
                  onChange={(e) => setRegistrationInfo({ ...registrationInfo, user: { ...user, [e.target.name]: e.target.value } })}
                />
              </div>
              <div className="col-12 col-lg-6">
                <label htmlFor="user_number">Número</label>
                <input
                  type="text"
                  id="user_number"
                  name="user_number"
                  className="form-control"
                  value={user.user_number}
                  onChange={(e) => setRegistrationInfo({ ...registrationInfo, user: { ...user, [e.target.name]: e.target.value } })}
                />
              </div>
              <div className="col-12 col-lg-6">
                <label htmlFor="user_neighborhood">Bairro</label>
                <input
                  type="text"
                  id="user_neighborhood"
                  name="user_neighborhood"
                  className="form-control"
                  value={user.user_neighborhood}
                  onChange={(e) => setRegistrationInfo({ ...registrationInfo, user: { ...user, [e.target.name]: e.target.value } })}
                />
              </div>
              <div className="col-12 col-lg-6">
                <label htmlFor="user_apartment">Complemento</label>
                <input
                  type="text"
                  id="user_apartment"
                  name="user_apartment"
                  className="form-control"
                  value={user.user_apartment}
                  onChange={(e) => setRegistrationInfo({ ...registrationInfo, user: { ...user, [e.target.name]: e.target.value } })}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
};

export default UserInfo;
