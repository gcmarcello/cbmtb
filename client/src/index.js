import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import "./css/variables.css";
import App from "./App";

import { BrowserRouter as Router } from "react-router-dom";

document.documentElement.lang = 'pt'
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  //<React.StrictMode>
  <Router>
    <App />
  </Router>
  //</React.StrictMode>
);
