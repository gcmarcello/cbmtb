import React, { Fragment, useState, useEffect } from "react";

// React Components
import Panel from "./components/panel";
import AdminNavigation from "./components/adminNavigation";

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
      <AdminNavigation screen={screen} setScreen={setScreen} saveCurrentPanel={saveCurrentPanel} />
      <div className="container-lg">
        <Panel screen={screen} setScreen={setScreen} saveCurrentPanel={saveCurrentPanel} />
      </div>
    </Fragment>
  );
};

export default Dashboard;
