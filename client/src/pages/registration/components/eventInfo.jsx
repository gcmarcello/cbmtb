import { React, Fragment } from "react";

const EventInfo = (props) => {
  return (
    <Fragment>
      <div className="container">
        <div className="row align-items-start mb-3">
          <div className="col-12 col-lg-6">
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
              {props.event?.categories?.map((category) => (
                <option value={category.category_id} key={category.category_id} disabled={Boolean(category.category_name === "Selecione")}>
                  {category.category_name}
                </option>
              ))}
            </select>
            <label htmlFor="registrationShirt">Tamanho da Camiseta</label>
            <select type="text" id="registrationShirt" name="shirt" defaultValue={""} className="form-select">
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
          </div>
          <div className="col-12 col-lg-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Regulamento do Evento</h5>
              </div>
              <div className="card-body">
                <div dangerouslySetInnerHTML={{ __html: props.event.event_rules }} className="overflow-auto" style={{ maxHeight: "255px" }}></div>
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
