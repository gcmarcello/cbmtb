import { Fragment } from "react";

const ConfirmationPayment = (props) => {
  return (
    <Fragment>
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-6">
            <img src={props.event.event_image} alt="" className="img-fluid rounded-3 mb-3" />
            {/* <ul className="list-group">
              <li className="list-group-item">
                {props.watch("firstName")} {props.watch("lastName")}
              </li>
            </ul> */}
          </div>
          <div className="col-12 col-lg-6">
            <ul className="list-group ">
              <li className="list-group-item d-flex justify-content-between align-items-center ">
                <div className="py-2">
                  <div className="fw-semibold">Categoria</div>
                  <small className="text-muted">
                    {props.event?.categories.filter((category) => category.category_id === props.watch("category"))[0]?.category_name} -{" "}
                    {props.user.user_gender}
                  </small>
                </div>
                <span className="badge bg-success rounded-pill">R$ 0,00</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <div className="py-2">
                  <div className="fw-semibold">Kit do Evento</div>{" "}
                  <small className="text-muted">Tamanho {props.watch("registrationShirt").toUpperCase()}</small>
                </div>

                <span className="badge bg-success rounded-pill">R$ 0,00</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <div className="">
                  <div className="fw-semibold">Total</div>{" "}
                  {/* <small className="text-muted">Tamanho {props.watch("registrationShirt").toUpperCase()}</small> */}
                </div>

                <span className="">R$ 0,00</span>
              </li>
            </ul>
            <div className="mt-2">
              <p className="text-justify">
                A inscrição neste evento é gratuita. Ao clicar em 'finalizar', sua inscrição será confirmada e você será redirecionado para o seu
                perfil. Você receberá a confirmação da inscrição por e-mail e ela também estará disponível no seu perfil.
              </p>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-success form-control">Finalizar</button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmationPayment;
