import React, { Fragment, useState, useEffect } from "react";

// React Components
import Panel from "./panel";
import AdminNavigation from "../navbars/adminNavigation";

const Dashboard = () => {
  const [screen, setScreen] = useState("ListEvents");

  const saveCurrentPanel = (panel) => {
    let settings = JSON.parse(localStorage.getItem("settings")) || {};
    settings.panel = panel;
    localStorage.setItem("settings", JSON.stringify(settings));
    setScreen(panel);
  };

  useEffect(() => {
    if (localStorage.getItem("settings")) {
      let jsonSettings = JSON.parse(localStorage.getItem("settings"));
      setScreen(jsonSettings.panel);
    }
    document.title = "CBMTB - Painel";
  }, [screen]);

  return (
    <Fragment>
      <div className="container-fluid">
        <div className="row">
          <div className="col-2 col-sm-2 col-md-3 col-xl-2 bg-light min-vh-100 ">
            <AdminNavigation screen={screen} setScreen={setScreen} saveCurrentPanel={saveCurrentPanel} />
          </div>
          <div className="col-10 col-sm-9 col-xl-9 p-0 ms-sm-3 ms-xl-5 ms-md-0 ">
            <Panel screen={screen} setScreen={setScreen} saveCurrentPanel={saveCurrentPanel} />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Dashboard;
