import React, { Fragment } from "react";

import config from "../_config.js";

const UserNavigation = ({
  userAuthentication,
  setUserAuthentication,
  userName,
  userAdmin,
}) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("settings");
    document.location.reload(true);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-light shadow-lg sticky-top userbar">
      <div className="container-fluid pb-2">
        <a href="/">
          <img
            src={config.logoUrl}
            className="img-fluid"
            alt={`Logo da ${config.entidade.name}`}
            height={90}
            width={250}
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-around"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav me-auto me-lg-0 mb-2 mb-lg-0 navigation-list">
            <li className="d-block d-md-none">
              <hr />
            </li>
            <li className="nav-item">
              <a className="nav-link" aria-current="page" href="/eventos">
                Eventos
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/transparencia">
                Transparência
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/noticias">
                Notícias
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" aria-current="page" href="/federacoes">
                Federações
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="/"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Contato
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a className="dropdown-item" href="/ouvidoria">
                    Ouvidoria
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="/imprensa">
                    Cadastro de Imprensa
                  </a>
                </li>
              </ul>
            </li>
            {userAuthentication ? (
              <li className="nav-item dropdown border rounded border-white border-1 rounded mt-3 mt-lg-0">
                <a
                  className="nav-link dropdown-toggle mx-3 mx-lg-0"
                  href="/"
                  id="navbarprofile"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i
                    className="bi bi-person-circle fs-3"
                    style={{ verticalAlign: "middle" }}
                  ></i>{" "}
                  <span className="fw-semibold p-2">{userName}</span>
                </a>

                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {userAdmin ? (
                    <li>
                      <a className="dropdown-item" href="/painel">
                        Administrativo
                      </a>
                      <hr className="dropdown-divider" />
                    </li>
                  ) : (
                    <Fragment />
                  )}
                  <li>
                    <a className="dropdown-item" href="/usuario/">
                      Minha Página
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/usuario/perfil">
                      Editar Perfil
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li className="d-flex">
                    <button
                      className="btn btn-danger flex-fill mx-1"
                      onClick={() => {
                        handleLogout();
                      }}
                    >
                      Sair
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item d-flex justify-content-evenly align-items-center ">
                <a
                  className="btn btn-primary me-2 px-5 px-lg-3 fw-bold"
                  aria-current="page"
                  href="/login"
                >
                  Entrar
                </a>
                <a
                  className="btn btn-warning ms-2 px-5 px-lg-3 fw-bold"
                  aria-current="page"
                  href="/cadastro"
                >
                  Cadastro
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default UserNavigation;
