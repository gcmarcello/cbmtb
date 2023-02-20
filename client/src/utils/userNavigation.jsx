import React, { Fragment } from "react";

const UserNavigation = ({ userAuthentication, setUserAuthentication, userName, userAdmin }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("settings");
    document.location.reload(true);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-light shadow-lg sticky-top userbar">
      <div className="container-fluid pb-2">
        <a href="/">
          <img src="/logonotxt.png" className="img-fluid" alt="Logo da CBMTB" height={90} width={250} />
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
        <div className="collapse navbar-collapse justify-content-around" id="navbarSupportedContent">
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
              <a className="nav-link" href="/">
                Filiação
              </a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Transparência
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a className="dropdown-item" href="/">
                    Confederação
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider w-100" />
                </li>
                <li>
                  <a className="dropdown-item" href="/">
                    Atletas
                  </a>
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
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Notícias
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a className="dropdown-item" href="/">
                    Notícias
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="/">
                    Fotos
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="/">
                    Vídeos
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link" aria-current="page" href="/federacoes">
                Federações
              </a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Contato
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a className="dropdown-item" href="/">
                    Ouvidoria
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="/">
                    Cadastro de Imprensa
                  </a>
                </li>
              </ul>
            </li>
            {userAuthentication ? (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="/" id="navbarprofile" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-person-circle"></i> <span className="fw-semibold p-2">{userName}</span>
                </a>

                <ul className="dropdown-menu user-dropdown" aria-labelledby="navbarDropdown">
                  {userAdmin ? (
                    <li>
                      <a className="dropdown-item" href="/dashboard">
                        Painel de Administrador
                      </a>
                      <hr className="dropdown-divider" />
                    </li>
                  ) : (
                    <Fragment />
                  )}
                  <li>
                    <a className="dropdown-item" href="/usuario">
                      Minha Página
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/">
                      Editar Perfil
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li className="">
                    <button
                      className="btn btn-danger mx-3 px-5 flex-md-fill"
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
              <li className="nav-item">
                <div className="d-flex">
                  <a className="btn btn-primary me-2 fw-bold" aria-current="page" href="/login">
                    Entrar
                  </a>
                  <a className="btn btn-warning ms-2 fw-bold" aria-current="page" href="/cadastro">
                    Cadastro
                  </a>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default UserNavigation;
