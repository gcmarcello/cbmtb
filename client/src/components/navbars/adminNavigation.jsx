import React, { Fragment } from "react";

const AdminNavigation = ({ screen, setScreen, saveCurrentPanel }) => {
  return (
    <Fragment>
      <nav className="sidebar mt-3 position-sticky">
        <a href="/dashboard" className="d-flex flex-column align-items-center">
          <img src="/logoconf_black.svg" alt="LOGO" className="img-fluid" height={100} width={150} />
        </a>
        <hr />
        <ul className="nav flex-column align-items-center align-items-lg-start" id="nav_accordion">
          <li className="nav-item" style={{ width: "100%" }}>
            <button className="nav-link collapsed px-2" data-bs-toggle="collapse" data-bs-target="#menu_item1" href="#" aria-expanded="false">
              <i className="bi bi-calendar-event fs-1 icon-title"></i>
              <span className="d-none d-md-inline-block ms-2">
                Eventos <i className="bi small bi-caret-down-fill"></i>
              </span>
            </button>
            <ul id="menu_item1" className="submenu collapse show list-group list-group-flush" data-bs-parent="#nav_accordion">
              <li>
                <button className="nav-link" href="#" onClick={() => saveCurrentPanel("ListEvents")}>
                  <i className="bi bi-list-task fs-6"></i> <span className="d-none d-md-inline-block ms-2">Lista</span>
                </button>
              </li>
              <li>
                <button className="nav-link" href="#" onClick={() => saveCurrentPanel("NewEvent")}>
                  <i className="bi bi-calendar-plus-fill fs-6"></i> <span className="d-none d-md-inline-block ms-2">Novo</span>
                </button>
              </li>
              <li>
                <button className="nav-link" href="#">
                  <i className="bi bi-people-fill fs-6"></i>
                  <span className="d-none d-md-inline-block ms-2">Inscritos</span>
                </button>
              </li>
            </ul>
            <hr />
          </li>
          <li className="nav-item" style={{ width: "100%" }}>
            <button className="nav-link collapsed px-2" data-bs-toggle="collapse" data-bs-target="#menu_filiados" href="#" aria-expanded="false">
              <i className="bi bi-person-vcard fs-1 icon-title"></i>
              <span className="d-none d-md-inline-block ms-2">
                Filiações <i className="bi small bi-caret-down-fill"></i>
              </span>
            </button>
            <ul id="menu_filiados" className="submenu collapse list-group list-group-flush" data-bs-parent="#nav_accordion">
              {/* <li>
                <button className="nav-link" href="#" onClick={() => saveCurrentPanel("ListEvents")}>
                  <i className="bi bi-list-task fs-6"></i> <span className="d-none d-md-inline-block ms-2">Filiados</span>
                </button>
              </li>
              <li>
                <button className="nav-link" href="#" onClick={() => saveCurrentPanel("NewEvent")}>
                  <i className="bi bi-calendar-plus-fill fs-6"></i> <span className="d-none d-md-inline-block ms-2">Novo</span>
                </button>
              </li> */}
              <li>
                <button className="nav-link" href="#">
                  <i className="bi bi-people-fill fs-6"></i>
                  <span className="d-none d-md-inline-block ms-2">Filiados</span>
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </Fragment>
  );
};

export default AdminNavigation;
