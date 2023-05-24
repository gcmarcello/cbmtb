import React, { useState } from "react";
import QrCodeReader from "react-qrcode-reader";
import CheckInOffCanvas from "./checkInOffCanvas";
import LoadingScreen from "../../../../utils/loadingScreen";
import _config from "../../../../_config";

const ReaderComponent = ({ getCheckInNumbers, id }) => {
  const [registration, setRegistration] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRead = async (code) => {
    setIsLoading(true);
    const uuidTest = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(code.data);
    if (!uuidTest) {
      return setError("QR Code Inválido");
    }

    try {
      setError(null);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);
      const response = await fetch(`/api/registrations/verify/${id}/${code.data}`, { method: "GET", headers: myHeaders });
      const parseResponse = await response.json();
      if (parseResponse.type === "success") {
        setRegistration(parseResponse.data);
      } else {
        setError(parseResponse.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      {!registration && !error && (
        <div className="qr-code-reader mb-2">
          <QrCodeReader delay={100} width={300} height={300} onRead={handleRead} videoConstraints={{ facingMode: { exact: "environment" } }} />
          <p className="text-center mb-0">Use a câmera para escanear o QR Code</p>
          <img src={_config.images.crosshair} alt="Crosshair" className="viewfinder-crosshair" />
        </div>
      )}
      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          <button
            className="btn btn-secondary mx-2"
            onClick={() => {
              setError(null);
              setRegistration(null);
            }}
          >
            <i class="bi bi-arrow-repeat"></i>
          </button>
        </div>
      )}
      <CheckInOffCanvas registration={registration} setRegistration={setRegistration} getCheckInNumbers={getCheckInNumbers} />
    </div>
  );
};

export default ReaderComponent;
