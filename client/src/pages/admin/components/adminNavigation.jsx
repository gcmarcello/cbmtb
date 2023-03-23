import React, { Fragment } from "react";

const AdminNavigation = () => {
  return (
    <Fragment>
      <nav className="navbar navbar-expand-lg navbar-light shadow-sm">
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
                <a className="nav-link active fw-bolder" aria-current="page" href="/painel">
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
                    <a href="/painel/eventos" className="dropdown-item">
                      Listar Eventos
                    </a>
                  </li>
                  <li>
                    <a href="/painel/eventos/novo" className="dropdown-item">
                      Novo Evento
                    </a>
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
                    <a href="/painel/noticias" className="dropdown-item">
                      Listar Notícias
                    </a>
                  </li>
                  <li>
                    <a href="/painel/noticias/nova" className="dropdown-item">
                      Nova Notícia
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <button className="nav-link" aria-current="page" style={{ border: "0", background: "none" }}>
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
