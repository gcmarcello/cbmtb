import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingScreen from "../../utils/loadingScreen";

import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Inline from "yet-another-react-lightbox/plugins/inline";
import PhotoAlbum from "react-photo-album";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { useRef } from "react";

const EventRecords = () => {
  const { eventLink } = useParams();
  const [photos, setPhotos] = useState([]);
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [index, setIndex] = useState(-1);
  const thumbnailsRef = useRef(null);

  const fetchPhotos = async () => {
    setIsLoading(true);
    try {
      setIsLoading(true);
      const response = await fetch(`/api/events/records/event/${eventLink}`, {
        method: "GET",
      });
      const parseResponse = await response.json();
      if (parseResponse.type === "error") {
        navigate("/404");
        return;
      }
      setEvent(parseResponse.event);
      setPhotos(parseResponse.data.map((photo) => ({ src: photo.link, width: 800, height: 600 })));
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="inner-page container">
      <div className="d-flex flex-column flex-lg-row justify-content-between">
        <h2>Mídias - {event?.event_name}</h2>

        <Link to={`/eventos/${event?.event_link}`} className="btn btn-secondary my-auto">
          Voltar ao Evento
        </Link>
      </div>
      <hr />

      <div className="row">
        <div className="col-12 d-flex justify-content-center rounded-2 mb-3">
          <Lightbox
            plugins={[Thumbnails]}
            thumbnails={{ ref: thumbnailsRef }}
            on={{
              click: () => {
                (thumbnailsRef.current?.visible ? thumbnailsRef.current?.hide : thumbnailsRef.current?.show)?.();
              },
            }}
            open={index >= 0}
            index={index}
            close={() => setIndex(-1)}
            slides={photos}
          />
        </div>
        <div className="col-12">
          <PhotoAlbum layout="masonry" photos={photos} targetRowHeight={150} onClick={({ index }) => setIndex(index)} />
        </div>
      </div>
    </div>
  );
};

export default EventRecords;
