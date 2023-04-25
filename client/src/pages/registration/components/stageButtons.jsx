import React from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { animateScroll } from "react-scroll";

const StageButtons = (props) => {
  const changeStage = (e, number) => {
    e.preventDefault();

    if (props.stage + number >= 1 && props.stage + number <= 3) {
      props.setStage(props.stage + number);
    }
  };

  return (
    <div className="d-flex justify-content-end ">
      <button
        className="btn btn-secondary"
        onClick={(e) => {
          window.scrollTo(0, 0);
          e.preventDefault();
          changeStage(e, -1);
        }}
      >
        Voltar
      </button>
      <button
        className="btn btn-success"
        onClick={(e) => {
          window.scrollTo(0, 0);
          e.preventDefault();
          changeStage(e, 1);
        }}
      >
        Próximo
      </button>
    </div>
  );
};

export default StageButtons;
