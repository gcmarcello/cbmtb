import { Fragment, useState } from "react";
import LatestNews from "../home/components/latestNews";
import NextEvents from "../home/components/nextEvents";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LoadingScreen from "../../utils/loadingScreen";
import _config from "../../_config";
import FlagshipHomeEvents from "./flagshipEvents";

const FlagshipHome = () => {
  const { flagshipLink } = useParams();
  const [flagship, setFlagship] = useState(null);
  const [nextEvent, setNextEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlagship = async (e) => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/events/flagships/${flagshipLink}`, {
          method: "GET",
        });
        const parseResponse = await response.json();
        if (parseResponse.type === "error") {
          navigate("/pagina/404");
        }
        setFlagship(parseResponse.data);
        return parseResponse.data;
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    const getEvents = async (id) => {
      try {
        const response = await fetch(
          `/api/events/flagships/event/${id}/widget`,
          {
            method: "GET",
          }
        );
        const parseResponse = await response.json();
        setNextEvent(parseResponse.data[0]);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFlagship().then((response) => getEvents(response.flagship_id));
  }, [flagshipLink]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Fragment>
      <div
        className="d-flex flex-column align-items-center justify-content-center vh-100 hero"
        style={{
          height: "50vh",
          backgroundImage: `url(${
            flagship
              ? flagship.flagship_bg || "var(--homepage-primary-bg)"
              : "var(--homepage-primary-bg)"
          })`,
        }}
      >
        <div
          className="container"
          style={{ position: "relative", top: "-110px" }}
        >
          <div className="row">
            <div className="col-12 col-lg-6 d-flex justify-content-center align-items-center my-5 pt-3 my-lg-0">
              <a href="#evento">
                <img
                  src={flagship?.flagship_logo}
                  alt=""
                  className="img-fluid"
                />
              </a>
            </div>
            <div className="col-12 col-lg-6">
              <a href={`/eventos/${nextEvent?.event_link}`}>
                <img
                  src={nextEvent?.event_image}
                  alt=""
                  className="img-fluid rounded-2 shadow"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div id="evento" style={{ position: "relative", top: "-110px" }}></div>
      <LatestNews />
      <FlagshipHomeEvents id={flagship?.flagship_id} />
    </Fragment>
  );
};

export default FlagshipHome;
