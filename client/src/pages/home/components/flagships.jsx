import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Flagships = () => {
  const [flagships, setFlagships] = useState(null);

  const fetchFlagship = async () => {
    try {
      const response = await fetch(`/api/events/flagships/`, {
        method: "GET",
      });
      const parseResponse = await response.json();
      if (!parseResponse.data) {
        return;
      }
      setFlagships(parseResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFlagship();
  }, []);

  if (!flagships) {
    return null;
  }

  return (
    <div className="container-fluid shadow" style={{ backgroundColor: "var(--primary-color)" }}>
      <div className="row pb-5 pt-2 justify-content-center align-items-center">
        <h1  style={{ 
                  color: 'var(--secondary-color)'
                }}>Principais Eventos</h1>
        {flagships?.map((flagship) => (
          <div key={flagship.flagship_id} className="col-12 col-lg-4 d-flex mt-5 mt-lg-3 justify-content-center align-items-center">
            <Link to={`/${flagship.flagship_link}`}>
              <img src={flagship.flagship_logo} alt={`Thumbnail do Evento ${flagship.flagship_name}`} className="img-fluid flagship-logo" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flagships;
