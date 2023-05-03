import React, { Fragment, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";

import Login from "../../pages/login/login";

import { UserContext } from "../../context/userContext";

const PrivateRoute = (props) => {
  const roles = props.roles || ["admin"];
  const { userInfo } = useContext(UserContext);

  if (roles.indexOf(userInfo.userRole) >= 0 || userInfo.userRole === "admin") {
    return <Fragment>{props.children}</Fragment>;
  } else {
    return <Login />;
  }
};

export default PrivateRoute;
