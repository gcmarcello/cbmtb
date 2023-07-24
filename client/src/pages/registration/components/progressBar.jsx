const ProgressBar = (props) => {
  const changeStage = (e, number) => {
    e.preventDefault();

    if (props.stage + number >= 1 && props.stage + number <= 3) {
      props.setStage(props.stage + number);
    }
  };

  const trackProgress = () => {
    switch (props.stage) {
      case 1:
        return "0%";
      case 2:
        return "50%";
      case 3:
        return "100%";
      default:
        break;
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center">
        <div className="col-2 px-0 d-flex justify-content-center">
          <button
            className="btn me-3 btn-link text-white"
            onClick={(e) => {
              window.scrollTo(0, 0);
              e.preventDefault();
              changeStage(e, -1);
            }}
          >
            <i className="bi bi-chevron-left fs-3"></i>
          </button>
        </div>
        <div className="col-7">
          <div>
            <div className="position-relative">
              <div className="progress" style={{ height: "5px" }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: trackProgress() }}
                  aria-valuenow="0"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div className="position-absolute  translate-middle start-0">
                <button
                  type="button"
                  className={`btn btn-sm btn-${
                    props.stage >= 1 ? "primary" : "secondary"
                  } rounded-pill`}
                  style={{ width: "2rem", height: "2rem" }}
                  onClick={() => props.setStage(1)}
                >
                  1
                </button>
                <p className="position-absolute" style={{ left: "-3px" }}>
                  Atleta
                </p>
              </div>
              <div className="position-absolute  start-50 translate-middle ">
                <button
                  type="button"
                  className={`btn btn-sm btn-${
                    props.stage >= 2 ? "primary" : "secondary"
                  } rounded-pill`}
                  style={{ width: "2rem", height: "2rem" }}
                  onClick={() => props.setStage(2)}
                >
                  2
                </button>
                <p
                  className="position-absolute left-50"
                  style={{ left: "-7px" }}
                >
                  Evento
                </p>
              </div>

              <div className="position-absolute start-100 translate-middle ">
                <button
                  type="button"
                  className={`btn btn-sm btn-${
                    props.stage >= 3 ? "primary" : "secondary"
                  } rounded-pill`}
                  style={{ width: "2rem", height: "2rem" }}
                  onClick={() => props.setStage(3)}
                  disabled={
                    props.watch("rulesAgreement") &&
                    /* props.watch("registrationShirt") && */
                    props.watch("category")
                      ? false
                      : true
                  }
                >
                  3
                </button>
                <p
                  className="position-absolute left-50"
                  style={{ left: "-15px" }}
                >
                  Concluir
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-2 px-0 d-flex justify-content-center">
          <button
            className="btn btn-link text-white ms-3"
            onClick={(e) => {
              window.scrollTo(0, 0);
              e.preventDefault();
              changeStage(e, 1);
            }}
            disabled={
              props.stage === 2
                ? props.watch("rulesAgreement") &&
                  /* props.watch("registrationShirt") && */
                  props.watch("category")
                  ? false
                  : true
                : props.stage === 3
                ? true
                : false
            }
          >
            <i className="bi bi-chevron-right fs-4"></i>
          </button>
        </div>
        <div className="d-flex justify-content-end">
          <span
            id="accessibilityWidget"
            className="btn text-white btn-link mt-4 mt-lg-2 p-0"
            tabIndex="0"
          >
            Acessibilidade
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
