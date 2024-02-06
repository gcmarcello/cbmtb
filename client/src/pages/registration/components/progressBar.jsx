const ProgressBar = (props) => {
  const changeStage = (e, number) => {
    e.preventDefault();

    if (props.stage + number >= 1 && props.stage + number <= 2) {
      props.setStage(props.stage + number);
    }
  };

  const trackProgress = () => {
    switch (props.stage) {
      case 1:
        return "0%";
      case 2:
        return "100%";
      default:
        break;
    }
  };

  return (
    <>
      <div className="container mt-2">
        <div className="row justify-content-center align-items-center">
          <div className="col-2 px-0 d-flex justify-content-center">
            {props.stage !== 1 && (
              <button
                className="btn me-3 btn-link text-white"
                onClick={(e) => {
                  window.scrollTo(0, 0);
                  e.preventDefault();
                  changeStage(e, -1);
                }}
              >
                <div className="d-flex align-items-center">
                  <i className="bi bi-chevron-left fs-3"></i>
                  <span className="d-none d-lg-block ms-2 fs-4">Anterior</span>
                </div>
              </button>
            )}
          </div>
          <div className="col-5">
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

                <div className="position-absolute  start-0 translate-middle ">
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
                  <p className="position-absolute left-50" style={{ left: "-7px" }}>
                    Evento
                  </p>
                </div>

                <div className="position-absolute start-100 translate-middle ">
                  <button
                    type="button"
                    className={`btn btn-sm btn-${
                      props.stage >= 2 ? "primary" : "secondary"
                    } rounded-pill`}
                    style={{ width: "2rem", height: "2rem" }}
                    onClick={() => props.setStage(2)}
                    disabled={
                      props.watch("rulesAgreement") &&
                      props.watch("registrationShirt") &&
                      props.watch("category")
                        ? false
                        : true
                    }
                  >
                    2
                  </button>
                  <p className="position-absolute left-50" style={{ left: "-15px" }}>
                    Pagamento
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-2 px-0 d-flex justify-content-center">
            {props.stage !== 2 && (
              <button
                className="btn btn-link text-white ms-3"
                onClick={(e) => {
                  window.scrollTo(0, 0);
                  e.preventDefault();
                  changeStage(e, 1);
                }}
                disabled={
                  props.stage === 1
                    ? props.watch("rulesAgreement") &&
                      props.watch("registrationShirt") &&
                      props.watch("category")
                      ? false
                      : true
                    : props.stage === 2
                    ? true
                    : false
                }
              >
                <div className="d-flex align-items-center">
                  <i className="bi bi-chevron-right fs-3"></i>
                  <span className="d-none d-lg-block ms-2 fs-4">Próximo</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgressBar;
