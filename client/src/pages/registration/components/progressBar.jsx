const ProgressBar = (props) => {
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
    <div className="row justify-content-center">
      <div className="col-10 col-lg-8">
        <div className="position-relative m-4 mb-5">
          <div className="progress" style={{ height: "1px" }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: trackProgress() }}
              aria-valuenow="50"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <div className="position-absolute translate-middle start-0">
            <button
              type="button"
              className={`btn btn-sm btn-${props.stage >= 1 ? "primary" : "secondary"} rounded-pill`}
              style={{ width: "2rem", height: "2rem" }}
              onClick={() => props.setStage(1)}
            >
              1
            </button>
            <p className="position-absolute" style={{ left: "-3px" }}>
              Atleta
            </p>
          </div>
          <div className="position-absolute top-0 start-50 translate-middle ">
            <button
              type="button"
              className={`btn btn-sm btn-${props.stage >= 2 ? "primary" : "secondary"} rounded-pill`}
              style={{ width: "2rem", height: "2rem" }}
              onClick={() => props.setStage(2)}
            >
              2
            </button>
            <p className="position-absolute left-50" style={{ left: "-7px" }}>
              Evento
            </p>
          </div>

          <div className="position-absolute top-0 start-100 translate-middle ">
            <button
              type="button"
              className={`btn btn-sm btn-${props.stage >= 3 ? "primary" : "secondary"} rounded-pill`}
              style={{ width: "2rem", height: "2rem" }}
              onClick={() => props.setStage(3)}
            >
              3
            </button>
            <p className="position-absolute left-50" style={{ left: "-30px" }}>
              Confirmação
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
