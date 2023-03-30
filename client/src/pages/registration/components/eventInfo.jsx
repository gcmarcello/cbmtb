import { React, Fragment } from "react";

const EventInfo = ({ user, event, categories, registrationInfo, setRegistrationInfo, userRegistration, setUserRegistration }) => {
  if (categories[0].category_name !== "Selecione") {
    categories.unshift({ category_name: "Selecione", category_id: "" });
  }

  const handleRegistrationOptions = (e) => {
    if (e.target.type === "checkbox") {
      setUserRegistration({ ...userRegistration, rules: !userRegistration.rules });
    } else {
      setUserRegistration({ ...userRegistration, [e.target.name]: e.target.value });
    }
  };

  return (
    <Fragment>
      <div className="container">
        <div className="row align-items-start mb-3">
          <div className="col-12 col-lg-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Informações do Atleta</h5>
              </div>
              <div className="card-body">
                <ul className="list-group">
                  <li className="list-group-item">
                    <strong>Nome:</strong> {user.user_first_name} {user.user_last_name}
                  </li>
                  <li className="list-group-item">
                    <strong>Idade:</strong> {user.age}
                  </li>
                  <li className="list-group-item">
                    <strong>Sexo:</strong> {user.user_gender}
                  </li>
                </ul>
                <form className="my-3">
                  <label htmlFor="registrationCategory">Categoria</label>
                  <select
                    type="text"
                    id="registrationCategory"
                    name="category"
                    className="form-select mb-3"
                    value={userRegistration.category}
                    onChange={(e) => handleRegistrationOptions(e)}
                  >
                    {categories.map((category) => (
                      <option value={category.category_id} key={category.category_id} disabled={Boolean(category.category_name === "Selecione")}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="registrationShirt">Tamanho da Camisa</label>
                  <select
                    type="text"
                    id="registrationShirt"
                    name="shirt"
                    className="form-select"
                    value={userRegistration.shirt}
                    onChange={(e) => handleRegistrationOptions(e)}
                  >
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
          <div className="col-12 col-lg-6 my-3 my-lg-0">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Regulamento do Evento</h5>
              </div>
              <div className="card-body">
                <div dangerouslySetInnerHTML={{ __html: event.event_rules }} className="overflow-auto" style={{ maxHeight: "255px" }}></div>
              </div>
              <div className="card-footer">
                <input
                  type="checkbox"
                  id="rules"
                  name="rules"
                  className="form-check-input"
                  checked={userRegistration.rules}
                  onChange={(e) => {
                    handleRegistrationOptions(e);
                  }}
                />
                <label className="form-check-label ms-2" htmlFor="rules">
                  Eu aceito o regulamento.
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EventInfo;
