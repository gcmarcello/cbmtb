import React, { Fragment, useEffect, useState } from "react";
import LatestNews from "./components/latestNews";
import _config from "../../_config";
import NextEvents from "./components/nextEvents";
import { Link } from "react-router-dom";
import Flagships from "./components/flagships";
const dayjs = require("dayjs");

const Home = () => {
  return (
    <Fragment>
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 hero">
        <a href="#hero-anchor">
          <img src={_config.images.secondaryLogo} alt="" className="img-fluid" />
        </a>
      </div>
      <LatestNews />
      <Flagships />
      <NextEvents />
    </Fragment>
  );
};

export default Home;
