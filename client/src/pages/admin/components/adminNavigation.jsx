import React, { Fragment, useEffect, useState } from "react";

import _config from "../../../_config";
import LoadingScreen from "../../../utils/loadingScreen";

const AdminNavigation = () => {
  const [openTicketNumber, setOpenTicketNumber] = useState(null);

  const listTickets = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const response = await fetch(`/api/tickets/`, {
        method: "GET",
        headers: myHeaders,
      }); // eslint-disable-next-line
      const parseResponse = await response.json();
      setOpenTicketNumber(parseResponse.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    listTickets();
  }, []);

  return (
    <Fragment>
      <nav className="navbar navbar-expand-lg navbar-light shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img
              src={_config.images.dashboardLogo}
              alt="LOGO"
              className="img-fluid"
              height={100}
              width={150}
            />
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
            <ul
              className="navbar-nav me-auto my-2 my-lg-0"
              style={{ "--bs-scroll-height": "100px" }}
            >
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="/painel/eventos"
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
                <a
                  href="/painel/documentos"
                  className="nav-link"
                  aria-current="page"
                  style={{ border: "0", background: "none" }}
                >
                  Documentos
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="/painel/usuarios"
                  className="nav-link"
                  aria-current="page"
                  style={{ border: "0", background: "none" }}
                >
                  Usuários
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="/painel/ouvidoria"
                  className="nav-link position-relative"
                  aria-current="page"
                  style={{ border: "0", background: "none" }}
                >
                  Ouvidoria{" "}
                  <span
                    className="position-absolute translate-middle badge rounded-pill bg-danger"
                    style={{ top: 5, left: 85 }}
                  >
                    {openTicketNumber?.length > 0 &&
                      openTicketNumber.filter(
                        (ticket) => ticket.ticket_status === "pending"
                      ).length}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </Fragment>
  );
};

export default AdminNavigation;
