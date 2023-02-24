import React, { Fragment } from "react";

const AdminNavigation = ({ screen, setScreen, saveCurrentPanel }) => {
  return (
    <Fragment>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img src="/logoconf_black.svg" alt="LOGO" className="img-fluid" height={100} width={150} />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarScroll"
            aria-controls="navbarScroll"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarScroll">
            <ul className="navbar-nav me-auto my-2 my-lg-0" style={{ "--bs-scroll-height": "100px" }}>
              <li className="nav-item">
                <a className="nav-link active fw-bolder" aria-current="page" href="/dashboard">
                  Início
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="/"
                  id="navbarScrollingDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Eventos
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarScrollingDropdown">
                  <li>
                    <button className="dropdown-item" onClick={() => saveCurrentPanel("ListEvents")}>
                      Listar Eventos
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => saveCurrentPanel("NewEvent")}>
                      Novo Evento
                    </button>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="/"
                  id="navbarScrollingDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Notícias
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarScrollingDropdown">
                  <li>
                    <button className="dropdown-item" onClick={() => saveCurrentPanel("ListNews")}>
                      Listar Notícias
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => saveCurrentPanel("NewNews")}>
                      Nova Notícia
                    </button>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="/">
                      Something else here
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link"
                  aria-current="page"
                  style={{ border: "0", background: "none" }}
                  onClick={() => saveCurrentPanel("ListDocuments")}
                >
                  Documentos
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </Fragment>
  );
};

export default AdminNavigation;
