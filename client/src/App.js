import { useEffect, useState, Fragment } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// React Components
// eslint-disable-next-line
import UserNavigation from "./utils/userNavigation";
import UserPanel from "./pages/user/user";
import Payments from "./pages/payment/payments";
import Register from "./pages/register/register";
import Login from "./pages/login/login";
import Federations from "./pages/federacoes/federations";
import Dashboard from "./pages/admin/dashboard";
import LoadingScreen from "./utils/loadingScreen";
import Home from "./pages/home/home";
import EventPage from "./pages/event/event";
import NewsPage from "./pages/news/news";
import Registration from "./pages/registration/registration";
import Page404 from "./utils/404";
import Footer from "./utils/footer";
import AllNews from "./pages/news/allNews";
import Documents from "./pages/documents/documents";
import AllEvents from "./pages/event/allEvents";
import Imprensa from "./pages/forms/imprensa";
import Ouvidoria from "./pages/forms/ouvidoria";

function App() {
  const [userAuthentication, setUserAuthentication] = useState(false);
  const [userAdmin, setUserAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  let location = useLocation();

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
      setUserName(parseData.givenName);
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
      {location.pathname !== "/dashboard" && location.pathname !== "/dashboard/" && (
        <UserNavigation userAuthentication={userAuthentication} userName={userName} userAdmin={userAdmin} setUserAdmin={setUserAdmin} />
      )}
      <main>
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
            element={
              !userAuthentication ? (
                <Register userAuthentication={userAuthentication} setUserAuthentication={setUserAuthentication} />
              ) : (
                <Navigate to="/usuario" />
              )
            }
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
                <Navigate to="/usuario" />
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
          <Route exact path="/pagamento/:linkId" element={<Payments />} />
          <Route exact path="/eventos/" element={<AllEvents />} />
          <Route exact path="/federacoes/" element={<Federations />} />
          <Route exact path="/imprensa/" element={<Imprensa />} />
          <Route exact path="/noticias/" element={<AllNews />} />
          <Route exact path="/noticias/:title" element={<NewsPage />} />
          <Route exact path="/ouvidoria/" element={<Ouvidoria />} />
          <Route exact path="/transparencia/" element={<Documents />} />
          <Route
            exact
            path="/usuario"
            element={
              userAuthentication ? (
                <UserPanel userAuthentication={userAuthentication} setUserAuthentication={setUserAuthentication} userName={userName} />
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
      </main>
      {location.pathname !== "/dashboard" && location.pathname !== "/dashboard/" && (
        <Footer userAuthentication={userAuthentication} userName={userName} />
      )}
    </Fragment>
  );
}
export default App;
