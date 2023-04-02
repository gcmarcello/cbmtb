import React from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const StageButtons = ({ stage, setStage, userRegistration, id }) => {
  const navigate = useNavigate();

  const createRegistration = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const categoryId = userRegistration.category;
      const registrationShirt = userRegistration.shirt;

      const body = { categoryId, registrationShirt };
      const response = await fetch(`/api/registrations/${id}`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(body),
      });
      const parseResponse = await response.json();
      parseResponse.type === "success"
        ? toast.success(parseResponse.message, { theme: "colored" })
        : toast.error(parseResponse.message, { theme: "colored" });
      navigate(parseResponse.paymentId ? `/pagamento/${parseResponse.paymentId}` : `/usuario/`);
    } catch (error) {
      console.log(error);
    }
  };

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
          if (stage !== 2) {
            setStage((prevCount) => prevCount + 1);
          } else {
            createRegistration();
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
