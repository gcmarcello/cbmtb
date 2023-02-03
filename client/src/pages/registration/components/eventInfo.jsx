import { React, Fragment, useState } from "react";

const EventInfo = ({ user, event, categories, registrationInfo }) => {
  if (categories[0].category_name !== "Selecione") {
    categories.unshift({ category_name: "Selecione", category_id: "" });
  }

  return (
    <Fragment>
      <div className="container">
        <div className="row align-items-start">
          <div className="col-12 col-lg-6">
            <img src={event.event_image} className="img-fluid rounded" alt="" />
          </div>
          <div className="col-12 col-lg-6 my-3 my-lg-0">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Informações do Atleta</h5>
              </div>
              <div className="card-body">
                <ul className="list-group">
                  <li className="list-group-item">
                    <strong>Nome:</strong> {user.user_given_name} {user.user_last_name}
                  </li>
                  <li className="list-group-item">
                    <strong>Idade:</strong> {user.age}
                  </li>
                  <li className="list-group-item">
                    <strong>Sexo:</strong> {(user.user_gender = "masc" ? "Masculino" : "Feminino")}
                  </li>
                </ul>
              </div>
            </div>
            <form className="my-3">
              <label htmlFor="registrationCategory">Categoria</label>
              <select type="text" id="registrationCategory" name="registrationCategory" className="form-select mb-3" value={""}>
                {categories.map((category) => (
                  <option value={category.category_id} disabled={Boolean(category.category_name === "Selecione")}>
                    {category.category_name}
                  </option>
                ))}
              </select>
              <label htmlFor="registrationShirt">Tamanho da Camisa</label>
              <select type="text" id="registrationShirt" name="registrationShirt" className="form-select" value={""}>
                <option value="" disabled={true}>
                  Selecione
                </option>
                <option value={"pp"}>PP</option>
                <option value={"p"}>P</option>
                <option value={"m"}>M</option>
                <option value={"g"}>G</option>
                <option value={"gg"}>GG</option>
              </select>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EventInfo;
