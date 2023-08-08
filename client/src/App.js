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
import UserWay from "./components/userWay";
import ListFlagships from "./pages/admin/components/flagships/listFlagships";
import UpdateFlagship from "./pages/admin/components/flagships/updateFlagship";
import NewFlagship from "./pages/admin/components/flagships/newFlagship";
import { UserContext } from "./context/userContext";
import EventRecords from "./pages/event/eventRecord";
import CheckInPage from "./pages/admin/components/checkin/checkInPage";
import AdminPanel from "./pages/admin/adminPanel";
import CompleteEvent from "./pages/admin/components/events/completeEvent";

function App() {
  const [userAuthentication, setUserAuthentication] = useState(false);
  const [userAdmin, setUserAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({ userName: null, userRole: null });
  let location = useLocation();
  let page = location.pathname.split("/")[1];

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
      setUserInfo({
        userName: parseData.name || null,
        userRole: parseData.role || null,
      });
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
    <UserContext.Provider
      value={{ userInfo: userInfo, setUserInfo: setUserInfo }}
    >
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
        {!(page === "painel") && <UserNavigation />}
        {page === "painel" &&
          userInfo.userRole &&
          userInfo.userRole !== "user" && <AdminNavigation />}
        <main>
          <Routes>
            <Route exact path="/cadastro" element={<Register />} />
            <Route exact path="/login" element={<Login />} />
            <Route
              exact
              path="/painel/"
              element={
                <PrivateRoute roles={["staff", "press", "organizer"]}>
                  <AdminPanel />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/painel/eventos"
              element={
                <PrivateRoute roles={["staff"]}>
                  <ListEvents />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/painel/eventos/novo"
              element={
                <PrivateRoute>
                  <NewEvent />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/painel/eventos/:id/checkin"
              element={
                <PrivateRoute roles={["staff"]}>
                  <CheckInPage />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/painel/eventos/:id/finalizar"
              element={
                <PrivateRoute>
                  <CompleteEvent />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/painel/eventos/:id/:tab?"
              element={
                <PrivateRoute>
                  <EditEventPanel />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/painel/noticias"
              element={
                <PrivateRoute roles={["press", "organizer"]}>
                  <ListNews />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/painel/noticias/nova"
              element={
                <PrivateRoute roles={["press", "organizer"]}>
                  <NewNews />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/painel/noticias/:id"
              element={
                <PrivateRoute roles={["press", "organizer"]}>
                  <EditNews />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/painel/documentos/"
              element={
                <PrivateRoute>
                  <ListDocuments />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/painel/documentos/novo"
              element={
                <PrivateRoute>
                  <NewDocument />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/painel/ouvidoria/"
              element={
                <PrivateRoute>
                  <ListTickets />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/painel/ouvidoria/:id"
              element={
                <PrivateRoute>
                  <AnswerTicket />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/painel/usuarios"
              element={
                <PrivateRoute>
                  <ListUsers />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/painel/flagships"
              element={
                <PrivateRoute>
                  <ListFlagships />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/painel/flagships/novo"
              element={
                <PrivateRoute>
                  <NewFlagship />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/painel/flagships/:id"
              element={
                <PrivateRoute>
                  <UpdateFlagship />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/usuario/:panel?"
              element={
                <PrivateRoute roles={["user", "staff", "press", "organizer"]}>
                  <UserPanel />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/inscricao/:id/:coupon?"
              element={
                <PrivateRoute roles={["user", "staff", "press", "organizer"]}>
                  <Registration />
                </PrivateRoute>
              }
            />
            <Route exact path="/" element={<Home />} />
            <Route exact path="/:flagshipLink/" element={<FlagshipHome />} />
            {/* <Route exact path="/pagamento/:linkId" element={<Payments />} /> */}
            <Route
              exact
              path="/confirmacao/:id"
              element={<ConfirmationPage />}
            />
            <Route exact path="/eventos/:id" element={<EventPage />} />
            <Route exact path="/eventos/" element={<AllEvents />} />
            {_config.pages.federacoes && (
              <Route exact path="/federacoes/" element={<Federations />} />
            )}
            <Route exact path="/imprensa/" element={<Imprensa />} />
            <Route
              exact
              path="/eventos/:id/midias"
              element={<EventRecords />}
            />
            <Route exact path="/noticias/" element={<AllNews />} />
            <Route exact path="/noticias/:title" element={<NewsPage />} />
            <Route exact path="/senha/:requestId" element={<PasswordReset />} />
            <Route exact path="/ouvidoria/" element={<Ouvidoria />} />
            <Route exact path="/ouvidoria/:id" element={<TicketPanel />} />
            <Route exact path="/transparencia/" element={<Documents />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </main>
        {!(
          page === "cadastro" ||
          page === "painel" ||
          page === "senha" ||
          page === "inscricao"
        ) && <Footer />}
      </Fragment>
    </UserContext.Provider>
  );
}
export default App;
