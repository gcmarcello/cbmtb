import React, { Fragment } from "react";
import { Navigate } from "react-router-dom";

import Login from "../../pages/login/login";

const PrivateRoute = (props) => {
  let loginComponent;
  if (props.children.type.name === "Dashboard") {
    loginComponent = true;
  }

  return (
    <Fragment>
      {props.userAuthentication ? (
        props.children
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
        <Navigate to="/login" />
      )}
    </Fragment>
  );
};

export default PrivateRoute;
