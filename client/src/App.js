import { useEffect, useState, Fragment } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* React Components */

// Events
import ListEvents from "./pages/admin/components/events/listEvents";
import NewEvent from "./pages/admin/components/events/newEvent";
import EditEventPanel from "./pages/admin/components/events/editEventPanel";
// News
import ListNews from "./pages/admin/components/news/listNews";
import NewNews from "./pages/admin/components/news/newNews";
import EditNews from "./pages/admin/components/news/editNews";

import UserNavigation from "./utils/userNavigation";
import UserPanel from "./pages/user/user";
import Payments from "./pages/payment/payments";
import Register from "./pages/register/register";
import Login from "./pages/login/login";
import Federations from "./pages/federacoes/federations";
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
import ConfirmationPage from "./pages/confirmation/confirmation";
import PrivateRoute from "./components/auth/auth";
import AdminNavigation from "./pages/admin/components/adminNavigation";
import ListDocuments from "./pages/admin/components/documents/listDocuments";
import NewDocument from "./pages/admin/components/documents/createDocuments";
import PasswordReset from "./pages/login/passwordReset";

function App() {
  const [userAuthentication, setUserAuthentication] = useState(false);
  const [userAdmin, setUserAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  let location = useLocation();
  let page = location.pathname.split("/")[1];

  let loginProps = {
    userAuthentication: userAuthentication,
    setUserAuthentication: setUserAuthentication,
    userAdmin: userAdmin,
    setUserAdmin: setUserAdmin,
    userName: userName,
    setUserName: setUserName,
  };

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
      {!(page === "painel") ? (
        <UserNavigation userAuthentication={userAuthentication} userName={userName} userAdmin={userAdmin} setUserAdmin={setUserAdmin} />
      ) : (
        <AdminNavigation userAuthentication={userAuthentication} userName={userName} userAdmin={userAdmin} setUserAdmin={setUserAdmin} />
      )}
      <main>
        <Routes>
          <Route exact path="/cadastro" element={!userAuthentication ? <Register /> : <Navigate to="/usuario" />} />
          <Route exact path="/login" element={!userAuthentication ? <Login {...loginProps} /> : <Navigate to="/usuario" />} />
          <Route
            exact
            path="/painel/"
            element={
              <PrivateRoute {...loginProps}>
                <Navigate to="/painel/eventos" />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/painel/eventos"
            element={
              <PrivateRoute {...loginProps}>
                <ListEvents userAdmin={userAdmin} userName={userName} />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/painel/eventos/novo"
            element={
              <PrivateRoute {...loginProps}>
                <NewEvent userAdmin={userAdmin} userName={userName} />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/painel/eventos/:id/:tab?"
            element={
              <PrivateRoute {...loginProps}>
                <EditEventPanel />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/painel/noticias"
            element={
              <PrivateRoute {...loginProps}>
                <ListNews />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/painel/noticias/nova"
            element={
              <PrivateRoute {...loginProps}>
                <NewNews />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/painel/noticias/:id"
            element={
              <PrivateRoute {...loginProps}>
                <EditNews />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/painel/documentos/"
            element={
              <PrivateRoute {...loginProps}>
                <ListDocuments />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/painel/documentos/novo"
            element={
              <PrivateRoute {...loginProps}>
                <NewDocument />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/usuario/:panel?"
            element={
              <PrivateRoute userAuthentication={userAuthentication}>
                <UserPanel userAuthentication={userAuthentication} setUserAuthentication={setUserAuthentication} userName={userName} />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/inscricao/:id"
            element={
              <PrivateRoute userAuthentication={userAuthentication}>
                <Registration userAdmin={userAdmin} userName={userName} />
              </PrivateRoute>
            }
          />
          <Route exact path="/" element={<Home />} />
          <Route exact path="/pagamento/:linkId" element={<Payments />} />
          <Route exact path="/confirmacao/:id" element={<ConfirmationPage {...loginProps} />} />
          <Route exact path="/evento/:id" element={<EventPage />} />
          <Route exact path="/eventos/" element={<AllEvents />} />
          <Route exact path="/federacoes/" element={<Federations />} />
          <Route exact path="/imprensa/" element={<Imprensa />} />
          <Route exact path="/noticias/" element={<AllNews />} />
          <Route exact path="/noticias/:title" element={<NewsPage />} />
          <Route exact path="/senha/:requestId" element={<PasswordReset {...loginProps} />} />
          <Route exact path="/ouvidoria/" element={<Ouvidoria />} />
          <Route exact path="/transparencia/" element={<Documents />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </main>
      {!(page === "cadastro" || page === "painel" || page === "senha") && <Footer userAuthentication={userAuthentication} userName={userName} />}
    </Fragment>
  );
}
export default App;
