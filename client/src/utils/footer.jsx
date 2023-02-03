import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <footer className="pt-5 pb-1">
          <div className="row">
            <div className="col-4 col-md-4 mb-3">
              <h5>
                <i className="bi bi-bicycle"></i> CBMTB
              </h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2">
                  <a href="/" className="nav-link p-0 text-muted">
                    Início
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a href="/" className="nav-link p-0 text-muted">
                    Filiação
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a href="/" className="nav-link p-0 text-muted">
                    Transparência
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a href="/" className="nav-link p-0 text-muted">
                    Notícias
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a href="/" className="nav-link p-0 text-muted">
                    Federações
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-md-7 offset-md-1 mb-3">
              <form>
                <h5>Inscreva-se na nossa Newsletter!</h5>
                <p>Receba as novidades e notícias da Confederação no seu e-mail.</p>
                <div className="container">
                  <div className="row p-0">
                    <div className="col-12 col-lg-8 p-0 mx-1 my-1">
                      <label htmlFor="newsletter1" className="visually-hidden">
                        Endereço de Email
                      </label>
                      <input id="newsletter1" type="text" className="form-control" placeholder="Endereço de Email" />
                    </div>
                    <div className="col-12 col-lg-2 p-0 mx-1 my-1">
                      <button className="btn btn-success form-control" type="button">
                        Inscreva-se
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-between pt-4 mt-4 border-top">
            <p>© 2023 CBMTB. Todos os direitos reservados.</p>
            <ul className="list-unstyled d-flex">
              <li className="ms-3">
                <a className="link-dark" href="/">
                  <i className="bi bi-twitter text-white fs-2"></i>
                </a>
              </li>
              <li className="ms-3">
                <a className="link-dark" href="/">
                  <i className="bi bi-instagram text-white fs-2"></i>
                </a>
              </li>
              <li className="ms-3">
                <a className="link-dark" href="/">
                  <i className="bi bi-facebook text-white fs-2"></i>
                </a>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </footer>
  );
};

export default Footer;
