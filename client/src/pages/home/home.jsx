import React, { Fragment } from "react";

import NextEvents from "./components/nextEvents";
import UserNavigation from "../../utils/userNavigation";
import Footer from "../../utils/footer";

const Home = ({ userAuthentication, setUserAuthentication, userName, userAdmin }) => {
  return (
    <Fragment>
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 hero">
        <a href="#hero-anchor">
          <img src="./logoconf_white.svg" alt="" className="img-fluid" />
        </a>
      </div>
      <NextEvents />
    </Fragment>
  );
};

export default Home;
