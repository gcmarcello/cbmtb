import React from "react";

import { useForm } from "react-hook-form";
import _config from "../_config";

import config from "../_config";

const Footer = ({ userAuthentication }) => {
  const {
    getValues,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    /* try {
      const response = await fetch(`/api/users/register`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const parseResponse = await response.json();
      if (parseResponse.type === "success") {
        setIsRegistered(true);
      } else {
        console.log(parseResponse);
      }
    } catch (err) {
      console.log(err.message);
    } */
  };

  return (
    <footer className="footer ">
      <div className="container">
        <footer className="pt-5 pb-1">
          <div className="row">
            <div className="col-4 col-md-4 mb-3">
              <h5>
                <i className="bi bi-bicycle"></i> {config.entidade.name}
              </h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2">
                  <a href="/" className="nav-link p-0 text-muted">
                    Início
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
                {_config.pages.federacoes && (
                  <li className="nav-item mb-2">
                    <a href="/" className="nav-link p-0 text-muted">
                      Federações
                    </a>
                  </li>
                )}
              </ul>
            </div>
            {!userAuthentication ? (
              <div className="col-md-7 offset-md-1 mb-3">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <h5>Inscreva-se na nossa Newsletter!</h5>
                  <p>Receba as novidades e notícias da Confederação no seu e-mail.</p>
                  <div className="container">
                    <div className="row align-items-center">
                      <div className="col-12 col-lg-8 p-0 mx-1 my-1">
                        <label htmlFor="newsletter1" className="visually-hidden">
                          Endereço de Email
                        </label>
                        <input
                          id="newsletterEmail"
                          className={`form-control ${errors.email?.type ? "is-invalid" : getValues("newsletterEmail") ? "is-valid" : ""}`}
                          {...register("newsletterEmail", {
                            required: true,
                            pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/,
                          })}
                          aria-invalid={errors.email ? "true" : "false"}
                          placeholder="Endereço de email"
                        />
                        {errors.email && (
                          <div className="alert alert-danger mt-2" role="alert">
                            Por favor, insira o seu nome.
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-lg-2 p-0 mx-1">
                        <input type="submit" className="btn btn-success my-2 px-5" value={"Inscreva-se"} />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-between pt-4 mt-4 border-top">
            <p>© 2023 {config.entidade.name}. Todos os direitos reservados.</p>
            <ul className="list-unstyled d-flex">
              <li className="ms-3">
                <a className="link-dark" href={config.redes.twitter}>
                  <i  style={{ 
                  color: 'var(--secondary-color)'
                }}
                className="bi bi-twitter fs-2"></i>
                </a>
              </li>
              <li className="ms-3">
                <a className="link-dark" href={config.redes.instagram}>
                  <i  style={{ 
                  color: 'var(--secondary-color)'
                }} className="bi bi-instagram fs-2"></i>
                </a>
              </li>
              <li className="ms-3">
                <a className="link-dark" href={config.redes.facebook}>
                  <i  style={{ 
                  color: 'var(--secondary-color)'
                }} className="bi bi-facebook fs-2"></i>
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
