import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ConfirmationPage = ({ setUserAuthentication, setUserAdmin, setUserName }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const confirmAccount = async () => {
    try {
      const response = await fetch(`/api/confirmations/${id}`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      });
      const parseResponse = await response.json();

      if (parseResponse.token) {
        localStorage.setItem("token", parseResponse.token);
        setUserName(parseResponse.givenName);
        setUserAuthentication(true);
        parseResponse.role === "admin" ? setUserAdmin(true) : setUserAdmin(false);
        navigate("/usuario");
      } else {
        toast[parseResponse.type](parseResponse.message, { theme: "colored" });
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    confirmAccount();
  }, []);
};

export default ConfirmationPage;
