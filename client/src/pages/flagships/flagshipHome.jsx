import { Fragment, useState } from "react";
import LatestNews from "../home/components/latestNews";
import NextEvents from "../home/components/nextEvents";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LoadingScreen from "../../utils/loadingScreen";
import _config from "../../_config";

const FlagshipHome = () => {
  const { flagshipLink } = useParams();
  const [flagship, setFlagship] = useState(null);
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
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFlagship();
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
          backgroundImage: `url(${flagship ? flagship.flagship_bg || "var(--homepage-primary-bg)" : "var(--homepage-primary-bg)"})`,
        }}
      >
        <a href="#evento">
          <img src={flagship?.flagship_logo} alt="" className="img-fluid" style={{ position: "relative", top: "-110px" }} />
        </a>
      </div>
      <div id="evento" style={{ position: "relative", top: "-110px" }}></div>
      <LatestNews />
      {/* <div className="container-fluid  pt-3">
        <div className="row">
          <div className="col-12 ">
            <h1>Últimas Edições</h1>
            <div id="eventos" style={{ position: "relative", top: "-110px" }}></div>
          </div>
        </div>
      </div> */}

      <NextEvents />
    </Fragment>
  );
};

export default FlagshipHome;
