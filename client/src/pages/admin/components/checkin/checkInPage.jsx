import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReaderComponent from "./reader";
import { Link, useParams } from "react-router-dom";

const CheckInPage = () => {
  const userAgent = navigator.userAgent;
  const isMobile = /Mobile/.test(userAgent);

  const { id } = useParams();
  const [registrationInfo, setRegistrationInfo] = useState(null);

  const getCheckInNumbers = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const response = await fetch(`/api/registrations/${id}`, {
        method: "GET",
        headers: myHeaders,
      });
      const parseResponse = await response.json();
      if (parseResponse.type === "error") {
        toast[parseResponse.type](parseResponse.message, { theme: "colored" });
      }
      setRegistrationInfo(parseResponse.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCheckInNumbers();
  }, []);

  return (
    <>
      <div className="bg-light">
        <div className="px-lg-5 py-lg-5">
          <div className="p-3 bg-white rounded rounded-2 shadow">
            <div className="d-flex justify-content-between">
              <h1 className="mb-3">Check-in - {registrationInfo?.eventInfo.event_name}</h1>{" "}
              <Link className="btn btn-secondary mx-2 my-auto" to={`/painel/eventos/${registrationInfo?.eventInfo.event_id}`}>
                Voltar
              </Link>
            </div>

            {!isMobile ? (
              <div className="d-flex justify-content-center align-items-center">
                <span>Por favor, abra a página no celular para acessar a câmera.</span>{" "}
              </div>
            ) : (
              <div>
                <ReaderComponent getCheckInNumbers={getCheckInNumbers} id={id} />
              </div>
            )}
            {registrationInfo && (
              <div className="container mt-3">
                <div className="row">
                  <div className="col-6">
                    <div className="card text-center">
                      <div className="card-body">
                        <h5 className="card-title">Total de Inscritos</h5>
                        <p className="card-text fs-1">{registrationInfo.attendeeCount.total_attendees}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card text-center">
                      <div className="card-body">
                        <h5 className="card-title">Inscritos Presentes</h5>
                        <p className="card-text fs-1">{registrationInfo.attendeeCount.checkedin_attendees}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckInPage;
