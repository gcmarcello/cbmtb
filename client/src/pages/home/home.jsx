import React, { Fragment } from "react";
import LatestNews from "./components/latestNews";
import _config from "../../_config";
import NextEvents from "./components/nextEvents";

const Home = ({
  userAuthentication,
  setUserAuthentication,
  userName,
  userAdmin,
}) => {
  return (
    <Fragment>
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 hero">
        <a href="#hero-anchor">
          <img
            src={_config.images.secondaryLogo}
            alt=""
            className="img-fluid"
          />
        </a>
      </div>
      <LatestNews />
      <NextEvents />
    </Fragment>
  );
};

export default Home;
