import { React, Fragment, useState } from "react";

const UserInfo = ({ user, event, categories, registrationInfo }) => {
  return (
    <Fragment>
      <form className="mb-3">
        <p className="text-justify">
          Verifique suas informações de cadastro antes de se inscrever na prova. Se alguma alteração for necessária, por favor edite os campos e
          clique em avançar para seguir com a inscrição.
        </p>
        <div className="row">
          <div className="col-12 col-lg-6">
            <label htmlFor="registrationGivenName">Nome</label>
            <input type="text" id="registrationGivenName" name="registrationGivenName" className="form-control" value={user.user_given_name} />
            <label htmlFor="registrationLastName">Sobrenome</label>
            <input type="text" id="registrationLastName" name="registrationLastName" className="form-control" value={user.user_last_name} />
            <div className="row">
              <div className="col-12 col-lg-6">
                <label htmlFor="registrationGender">Sexo</label>
                <select type="text" id="registrationGender" name="registrationGender" className="form-select" value={user.user_gender}>
                  <option value="" disabled={true}>
                    Selecione
                  </option>
                  <option value={"masc"}>Masculino</option>
                  <option value={"fem"}>Feminino</option>
                </select>
              </div>
              <div className="col-12 col-lg-6">
                <label htmlFor="registrationCPF">CPF</label>
                <input type="text" id="registrationCPF" name="registrationCPF" className="form-control" value={user.user_cpf} />
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-lg-6">
                <label htmlFor="registrationPhone">Celular</label>
                <input type="text" id="registrationPhone" name="registrationPhone" className="form-control" value={user.user_phone} />
              </div>
              <div className="col-12 col-lg-6">
                <label htmlFor="registrationBirthDate">Data de Nascimento</label>
                <input type="date" id="registrationBirthDate" name="registrationBirthDate" className="form-control" value={user.user_formattedDate} />
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-1 d-none d-lg-flex justify-content-center">
            <div className="vr h-100"></div>
          </div>
          <div className="col-12 col-lg-5">
            <label htmlFor="registrationCEP">CEP</label>
            <input type="text" id="registrationCEP" name="registrationCEP" className="form-control" value={user.user_cep} />
            <div className="row">
              <div className="col-12 col-lg-6">
                <label htmlFor="registrationState">Estado</label>
                <input type="text" id="registrationState" name="registrationState" className="form-control" value={user.user_state} />
              </div>
              <div className="col-12 col-lg-6">
                <label htmlFor="registrationCity">Cidade</label>
                <input type="text" id="registrationCity" name="registrationCity" className="form-control" value={user.user_city} />
              </div>
              <div className="col-12 col-lg-6">
                <label htmlFor="registrationStreet">Endereço</label>
                <input type="text" id="registrationStreet" name="registrationStreet" className="form-control" value={user.user_street} />
              </div>
              <div className="col-12 col-lg-6">
                <label htmlFor="registrationNumber">Número</label>
                <input type="text" id="registrationNumber" name="registrationNumber" className="form-control" value={user.user_number} />
              </div>
              <div className="col-12 col-lg-6">
                <label htmlFor="registrationNeighborhood">Bairro</label>
                <input
                  type="text"
                  id="registrationNeighborhood"
                  name="registrationNeighborhood"
                  className="form-control"
                  value={user.user_neighborhood}
                />
              </div>
              <div className="col-12 col-lg-6">
                <label htmlFor="registrationApartment">Complemento</label>
                <input type="text" id="registrationApartment" name="registrationApartment" className="form-control" value={user.user_apartment} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
};

export default UserInfo;
