import dayjs from "dayjs";
import { React, Fragment } from "react";

var relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);

const EventInfo = (props) => {
  const filterCategories = (user, categories) => {
    const userGender = user?.user_gender === "Masculino" ? "masc" : "fem";
    const userAge = Number(
      dayjs(user?.user_birth_date).fromNow().split(" ")[0]
    );

    return categories.filter(
      (category) =>
        (category.category_gender === userGender ||
          category.category_gender === "unisex") &&
        category.category_maxage >= userAge &&
        category.category_minage <= userAge
    );
  };

  return (
    <Fragment>
      <div className="container">
        <p>
          Selecione a sua categoria e o tamanho da camiseta do kit. Lembrando
          que você pode apenas se inscrever nas categorias disponíveis para a
          sua idade.
        </p>
        <div className="row align-items-start mb-3">
          <div className="col-12 col-lg-6 mb-3 mb-lg-0">
            <label htmlFor="registrationCategory">Categoria</label>
            <select
              type="text"
              id="registrationCategory"
              name="category"
              defaultValue={""}
              className="form-select mb-3"
              {...props.register("category", { required: true })}
            >
              <option value="" disabled={true}>
                Selecione a Categoria
              </option>
              {filterCategories(props.user, props.event.categories).map(
                (category) => (
                  <option
                    value={category.category_id}
                    key={category.category_id}
                  >
                    {category.category_name}
                  </option>
                )
              )}
            </select>
            {/* <label htmlFor="registrationShirt">Tamanho da Camiseta</label>

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
            </select> */}
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
