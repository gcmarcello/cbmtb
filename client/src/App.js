import { useEffect, useState, Fragment } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// React Components
// eslint-disable-next-line
import Payments from "./pages/payment/payments";
import Register from "./pages/register/register";
import Login from "./pages/login/login";
import Dashboard from "./pages/admin/dashboard";
import LoadingScreen from "./utils/loadingScreen";
import Home from "./pages/home/home";
import EventPage from "./pages/event/event";
import Registration from "./pages/registration/registration";
import Page404 from "./utils/404";

function App() {
  const [userAuthentication, setUserAuthentication] = useState(false);
  const [userAdmin, setUserAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  const checkAuthentication = async () => {
    setLoading(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);
      const res = await fetch(`/api/users/authentication`, {
        method: "GET",
        headers: myHeaders,
      });
      const parseData = await res.json();
      setUserName(parseData.name);
      parseData.authentication === true ? setUserAuthentication(true) : setUserAuthentication(false);
      parseData.role === "admin" ? setUserAdmin(true) : setUserAdmin(false);
      setLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  if (loading === true) {
    return <LoadingScreen />;
  }

  return (
    <Fragment>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Router>
        <Routes>
          <Route path="*" element={<Page404 userAuthentication={userAuthentication} setUserAuthentication={setUserAuthentication} />} />
          <Route
            exact
            path="/"
            element={
              <Home userAuthentication={userAuthentication} setUserAuthentication={setUserAuthentication} userAdmin={userAdmin} userName={userName} />
            }
          />
          <Route
            exact
            path="/cadastro"
            element={<Register userAuthentication={userAuthentication} setUserAuthentication={setUserAuthentication} />}
          />
          <Route
            exact
            path="/login"
            element={
              !userAuthentication ? (
                <Login
                  userAuthentication={userAuthentication}
                  setUserAuthentication={setUserAuthentication}
                  setUserAdmin={setUserAdmin}
                  userAdmin={userAdmin}
                  setUserName={setUserName}
                  userName={userName}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            exact
            path="/dashboard"
            element={
              userAuthentication ? (
                userAdmin ? (
                  <Dashboard
                    userAuthentication={userAuthentication}
                    setUserAuthentication={setUserAuthentication}
                    setUserAdmin={setUserAdmin}
                    userAdmin={userAdmin}
                  />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Login
                  userAuthentication={userAuthentication}
                  setUserAuthentication={setUserAuthentication}
                  setUserAdmin={setUserAdmin}
                  userAdmin={userAdmin}
                  setUserName={setUserName}
                  userName={userName}
                />
              )
            }
          />
          <Route
            exact
            path="/evento/:id"
            element={
              <EventPage
                userAuthentication={userAuthentication}
                setUserAuthentication={setUserAuthentication}
                setUserAdmin={setUserAdmin}
                userAdmin={userAdmin}
                setUserName={setUserName}
                userName={userName}
              />
            }
          />
          <Route
            exact
            path="/inscricao/:id"
            element={
              userAuthentication ? (
                <Registration
                  userAuthentication={userAuthentication}
                  setUserAuthentication={setUserAuthentication}
                  userAdmin={userAdmin}
                  userName={userName}
                />
              ) : (
                <Login
                  userAuthentication={userAuthentication}
                  setUserAuthentication={setUserAuthentication}
                  setUserAdmin={setUserAdmin}
                  userAdmin={userAdmin}
                  setUserName={setUserName}
                  userName={userName}
                />
              )
            }
          />
          <Route
            exact
            path="/pagamento"
            element={
              userAuthentication ? (
                <Payments
                  userAuthentication={userAuthentication}
                  setUserAuthentication={setUserAuthentication}
                  userAdmin={userAdmin}
                  userName={userName}
                />
              ) : (
                <Login
                  userAuthentication={userAuthentication}
                  setUserAuthentication={setUserAuthentication}
                  setUserAdmin={setUserAdmin}
                  userAdmin={userAdmin}
                  setUserName={setUserName}
                  userName={userName}
                />
              )
            }
          />
        </Routes>
      </Router>
    </Fragment>
  );
}
export default App;
