import React, { useState, useEffect, Fragment } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";

import { fetchEvent, fetchCategories, fetchProfile } from "../utils/fetchEventFunctions";
import UserNavigation from "./navbars/userNavigation";
import { toast } from "react-toastify";

const Registration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [event, setEvent] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile().then((result) => setUser(result));
    fetchEvent(id).then((result) => setEvent(result));
    if (event.event_id) {
      fetchCategories(event.event_id).then((result) => setCategories(result));
    }
  }, [id, event.event_id]);

  if (event.event_status === false) {
    toast.error("As inscrições para este evento não estão abertas.", { theme: "colored" });
    return <Navigate to="/" />;
  }

  return (
    <Fragment>
      <UserNavigation />
      <div className="container-fluid"></div>
    </Fragment>
  );
};

export default Registration;
