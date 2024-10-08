import dayjs from "dayjs";
import { React, Fragment } from "react";

var relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);

const EventInfo = (props) => {
  const filterCategories = (user, categories) => {
    const userGender = user?.user_gender === "Masculino" ? "masc" : "fem";
    const dobYear = dayjs(user?.user_birth_date).year();
    const age = dayjs().year() - dobYear;

    return categories.filter(
      (category) =>
        (category.category_gender === userGender ||
          category.category_gender === "unisex") &&
        category.category_maxage >= age &&
        category.category_minage <= age
    );
  };

  return (
    <Fragment>
      <div className="container">
        <p>
          Selecione a sua categoria. Lembrando que você pode apenas se inscrever nas
          categorias disponíveis para a sua idade.
        </p>
        <div className="row align-items-start mb-3">
          <div className="col-12 col-lg-6 mb-3 mb-lg-0">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Categorias Disponíveis</h5>
              </div>
              <div className="card-body">
                {filterCategories(props.user, props.event.categories).map(
                  (category, index) => (
                    <div key={`${category.category_id}`}>
                      {index !== 0 && <hr />}
                      <div className="form-check my-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          style={{ transform: "scale(1.5)" }}
                          value={category.category_id}
                          id={`flexRadio-${category.category_id}`}
                          {...props.register("category", { required: true })}
                        />
                        <label
                          className="form-check-label ms-1 w-100"
                          htmlFor={`flexRadio-${category.category_id}`}
                        >
                          {category.category_name}
                        </label>
                      </div>
                    </div>
                  )
                )}
              </div>
              {props.event.categories.find(
                (c) => c.category_id === props.watch("category")
              )?.team_category && (
                <div className="card-footer">
                  <div className="mt-2">
                    <label htmlFor="registration_team">
                      Nome Completo do Parceiro(a) de Dupla
                    </label>
                    <input
                      type="text"
                      id="registration_team"
                      className="form-control"
                      {...props.register("registration_team", {
                        required: true,
                      })}
                    />
                    <div className="text-muted text-sm">
                      Obs.: A inscrição é individual, os dois atletas devem fazê-la.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {props.event.enableshirtsize && (
              <>
                <label className="mt-3" htmlFor="registrationShirt">
                  Tamanho da Camiseta
                </label>

                <select
                  type="text"
                  id="registrationShirt"
                  name="shirt"
                  defaultValue={""}
                  className="form-select"
                  {...props.register("registrationShirt", { required: true })}
                >
                  <option value="" disabled={true}>
                    Selecione o Tamanho
                  </option>
                  <option value={"pp"}>PP</option>
                  <option value={"p"}>P</option>
                  <option value={"m"}>M</option>
                  <option value={"g"}>G</option>
                  <option value={"gg"}>GG</option>
                  <option value={"exg"}>EXG</option>
                </select>
              </>
            )}
          </div>
          <div className="col-12 col-lg-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Regulamento do Evento</h5>
              </div>
              <div className="card-body">
                <div
                  dangerouslySetInnerHTML={{ __html: props.event.event_rules }}
                  className="overflow-auto"
                  style={{ maxHeight: "200px" }}
                ></div>
              </div>
              <div className="card-footer">
                <input
                  type="checkbox"
                  id="rules"
                  name="rules"
                  className="form-check-input"
                  {...props.register("rulesAgreement", { required: true })}
                  style={{ transform: "scale(1.5)" }}
                />
                <label className="form-check-label ms-2" htmlFor="rules">
                  Eu aceito o regulamento.
                </label>
              </div>
            </div>
            {!props.watch("rulesAgreement") && (
              <span className="d-flex text-danger fw-bold mt-2">
                Você precisa aceitar o regulamento para prosseguir!
              </span>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EventInfo;
