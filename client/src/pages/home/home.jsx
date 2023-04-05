import React, { Fragment } from "react";
import LatestNews from "./components/latestNews";

import NextEvents from "./components/nextEvents";

const Home = ({ userAuthentication, setUserAuthentication, userName, userAdmin }) => {
  return (
    <Fragment>
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 hero">
        <a href="#hero-anchor">
          <img src={`${process.env.REACT_APP_BUCKET_URL}/assets/logoconf_white.svg`} alt="" className="img-fluid" />
        </a>
      </div>
      <LatestNews />
      <NextEvents />
    </Fragment>
  );
};

export default Home;
