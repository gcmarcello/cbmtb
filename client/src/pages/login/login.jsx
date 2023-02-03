import React, { Fragment, useState } from "react";

import UserNavigation from "../../utils/userNavigation";

const Login = ({ userAuthentication, setUserAuthentication, setUserAdmin, userAdmin, setUserName, userName }) => {
  const [loginInputs, setLoginInputs] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const { username, password } = loginInputs;

  const handleChange = (e) => {
    setLoginInputs({ ...loginInputs, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const body = { username, password };

      const res = await fetch(`/api/users/login`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(body),
      });
      const parseData = await res.json();
      if (parseData.token) {
        localStorage.setItem("token", parseData.token);
        setUserName(parseData.name);
        setUserAuthentication(true);
        parseData.role === "admin" ? setUserAdmin(true) : setUserAdmin(false);
        setError(null);
      } else {
        setUserAuthentication(false);
        setError(parseData);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <Fragment>
      <UserNavigation
        userAuthentication={userAuthentication}
        setUserAuthentication={setUserAuthentication}
        userName={userName}
        userAdmin={userAdmin}
      />
      <div className="container inner-page">
        <div className="row my-3 d-flex justify-content-center">
          <div className="col-12 text-center">
            <h1>Entrar</h1>
          </div>
          <div className="col-10 col-sm-8 col-lg-6">
            <form>
              <label htmlFor="username">Usuário</label>
              <input type="text" id="username" name="username" className="form-control mb-3" value={username} onChange={(e) => handleChange(e)} />
              <label htmlFor="username">Senha</label>
              <input type="password" id="password" name="password" className="form-control mb-3" value={password} onChange={(e) => handleChange(e)} />
              <hr />
              <button className="btn btn-success form-control mb-3" onClick={(e) => handleSubmit(e)}>
                Login
              </button>
              {error ? (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi flex-shrink-0 me-2 bi-exclamation-triangle-fill"></i>
                  <div>{error}</div>
                </div>
              ) : (
                <Fragment />
              )}
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
