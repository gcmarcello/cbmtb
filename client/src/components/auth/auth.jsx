import React, { Fragment, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Login from "../../pages/login/login";

import { UserContext } from "../../context/userContext";

const PrivateRoute = (props) => {
  const roles = props.roles || ["admin"];
  const { userInfo } = useContext(UserContext);
  console.log(roles.indexOf(userInfo.userRole));

  if (userInfo.userRole !== "admin") {
    if (roles.indexOf(userInfo.userRole) === -1) {
      return <Login />;
    }
  }

  return <Fragment>{props.children}</Fragment>;
};

export default PrivateRoute;
