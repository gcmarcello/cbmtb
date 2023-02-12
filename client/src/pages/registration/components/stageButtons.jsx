import React from "react";

const StageButtons = ({ stage, setStage, userRegistration }) => {
  return (
    <div className="d-flex justify-content-end ">
      {stage > 1 ? (
        <button
          className="btn btn-lg btn-danger me-3"
          onClick={() => {
            window.scrollTo(0, 0);
            if (stage !== 1) {
              setStage((prevCount) => prevCount - 1);
            }
          }}
        >
          Voltar
        </button>
      ) : (
        ""
      )}
      <button
        className="btn btn-lg btn-success"
        onClick={() => {
          window.scrollTo(0, 0);
          if (stage !== 3) {
            setStage((prevCount) => prevCount + 1);
          }
        }}
        disabled={
          stage === 2 && userRegistration.rules === false
            ? true
            : stage === 2 && (!userRegistration.category || !userRegistration.shirt)
            ? true
            : false
        }
      >
        Avançar
      </button>
    </div>
  );
};

export default StageButtons;
