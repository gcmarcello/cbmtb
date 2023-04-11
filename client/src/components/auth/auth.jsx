import React, { Fragment } from "react";
import { Navigate } from "react-router-dom";

import Login from "../../pages/login/login";

const PrivateRoute = (props) => {
  let loginComponent;
  let isPanel;

  if (window.location.pathname.split("/")[1] === "painel") {
    isPanel = true;
    loginComponent = true;
  }

  return (
    <Fragment>
      {props.userAuthentication ? (
        isPanel ? (
          props.userAdmin ? (
            props.children
          ) : (
            <Navigate to="/" replace />
          )
        ) : (
          props.children
        )
      ) : loginComponent ? (
        <Login
          userAuthentication={props.userAuthentication}
          setUserAuthentication={props.setUserAuthentication}
          setUserAdmin={props.setUserAdmin}
          userAdmin={props.userAdmin}
          setUserName={props.setUserName}
          userName={props.userName}
        />
      ) : (
        <Navigate to="/login" replace />
      )}
    </Fragment>
  );
};

export default PrivateRoute;
