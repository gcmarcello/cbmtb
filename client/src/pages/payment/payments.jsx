import React, { Fragment, useEffect, useState } from "react";
import LoadingScreen from "../../utils/loadingScreen";
import UserNavigation from "../../utils/userNavigation";

const Payments = () => {
  const [paymentcode, setPaymentCode] = useState("");

  const fetchPayment = async () => {
    try {
      const response = await fetch(`/api/payments/pix`, {
        method: "GET",
      });
      const parseResponse = await response.json();
      setPaymentCode(parseResponse);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPayment();
  }, []);

  return (
    <Fragment>
      <UserNavigation />
      <div className="container inner-page">
        {paymentcode ? (
          <div>
            <p>{paymentcode.qrcode}</p>
            <br />
            <img src={paymentcode.imagemQrcode} alt="Imagem do QRCode" />
          </div>
        ) : (
          <LoadingScreen />
        )}
      </div>
    </Fragment>
  );
};

export default Payments;
