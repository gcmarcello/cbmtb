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
import ListTickets from "./pages/admin/components/tickets/listTickets";
import AnswerTicket from "./pages/admin/components/tickets/answerTicket";
import ListUsers from "./pages/admin/components/users/listUsers";
import _config from "./_config";
import TicketPanel from "./pages/forms/ticketPanel";
import FlagshipHome from "./pages/flagships/flagshipHome";
import PedalEdition from "./pages/event/eventRecord";
import UserWay from "./components/userWay";
import ListFlagships from "./pages/admin/components/flagships/listFlagships";
import UpdateFlagship from "./pages/admin/components/flagships/updateFlagship";
import NewFlagship from "./pages/admin/components/flagships/newFlagship";

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
      <UserWay />
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
        userAuthentication && (
          <AdminNavigation userAuthentication={userAuthentication} userName={userName} userAdmin={userAdmin} setUserAdmin={setUserAdmin} />
        )
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
            path="/painel/ouvidoria/"
            element={
              <PrivateRoute {...loginProps}>
                <ListTickets />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/painel/ouvidoria/:id"
            element={
              <PrivateRoute {...loginProps}>
                <AnswerTicket />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/painel/usuarios"
            element={
              <PrivateRoute {...loginProps}>
                <ListUsers />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/painel/flagships"
            element={
              <PrivateRoute {...loginProps}>
                <ListFlagships />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/painel/flagships/novo"
            element={
              <PrivateRoute {...loginProps}>
                <NewFlagship />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/painel/flagships/:id"
            element={
              <PrivateRoute {...loginProps}>
                <UpdateFlagship />
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
            path="/inscricao/:id/:coupon?"
            element={
              <PrivateRoute {...loginProps}>
                <Registration userAdmin={userAdmin} userName={userName} />
              </PrivateRoute>
            }
          />
          <Route exact path="/" element={<Home />} />
          <Route exact path="/:flagshipLink/" element={<FlagshipHome />} />
          <Route exact path="/pagamento/:linkId" element={<Payments />} />
          <Route exact path="/confirmacao/:id" element={<ConfirmationPage {...loginProps} />} />
          <Route exact path="/eventos/:id" element={<EventPage />} />
          <Route exact path="/eventos/" element={<AllEvents />} />
          {_config.pages.federacoes && <Route exact path="/federacoes/" element={<Federations />} />}
          <Route exact path="/imprensa/" element={<Imprensa />} />
          <Route exact path="/eventos/:eventLink/midias" element={<PedalEdition />} />
          <Route exact path="/noticias/" element={<AllNews />} />
          <Route exact path="/noticias/:title" element={<NewsPage />} />
          <Route exact path="/senha/:requestId" element={<PasswordReset {...loginProps} />} />
          <Route exact path="/ouvidoria/" element={<Ouvidoria />} />
          <Route exact path="/ouvidoria/:id" element={<TicketPanel />} />
          <Route exact path="/transparencia/" element={<Documents />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </main>
      {!(page === "cadastro" || page === "painel" || page === "senha" || page === "inscricao") && (
        <Footer userAuthentication={userAuthentication} userName={userName} />
      )}
    </Fragment>
  );
}
export default App;
