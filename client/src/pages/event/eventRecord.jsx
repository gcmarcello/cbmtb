import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingScreen from "../../utils/loadingScreen";

import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import PhotoAlbum from "react-photo-album";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import "react-lazy-load-image-component/src/effects/blur.css"; // Import the CSS for the blur effect

import { useRef } from "react";
import { LazyLoadComponent } from "react-lazy-load-image-component";

const EventRecords = () => {
  const { id } = useParams();
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [index, setIndex] = useState(-1);
  const thumbnailsRef = useRef(null);

  const fetchPhotos = async () => {
    setIsLoading(true);
    try {
      setIsLoading(true);
      const response = await fetch(`/api/events/${id}/medias`, {
        method: "GET",
      });
      const parseResponse = await response.json();
      if (parseResponse.type === "error") {
        navigate("/pagina/404");
        return;
      }
      setEvent(parseResponse.event);
      setPhotos(
        parseResponse.data.filter((file) => file.link && !file.link.endsWith("mp4")).map((photo) => ({ src: photo.link, width: 800, height: 600 }))
      );
      setVideos(parseResponse.data.filter((file) => file.link && file.link.endsWith("mp4")).map((video) => ({ src: video.link })));
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
        <h2>Mídias - {event?.name}</h2>

        <Link to={`/eventos/${event?.link}`} className="btn btn-secondary my-auto">
          Voltar ao Evento
        </Link>
      </div>
      <hr />

      <div className="row">
        <h2>Vídeos</h2>
        <div className="col-12 d-flex justify-content-center rounded-2 mb-3">
          {!videos.length && <p>Mais vídeos em breve.</p>}
          {videos.map((video, index) => (
            <>
              <video key={`video-${index}`} controls>
                <source src={video.src} type="video/mp4" />
              </video>
            </>
          ))}
        </div>
      </div>
      <div className="row">
        <h2>Fotos</h2>
        <div className="col-12 d-flex justify-content-center rounded-2 mb-3">
          {!photos.length && <p>Mais fotos em breve.</p>}
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
          <PhotoAlbum
            layout="masonry"
            photos={photos}
            renderPhoto={({ photo, wrapperStyle, renderDefaultPhoto }) => (
              <LazyLoadComponent
                placeholder={
                  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px", minWidth: "300px" }}>
                    <div className="spinner-border" role="status"></div>
                  </div>
                }
              >
                <div style={{ position: "relative", ...wrapperStyle }}>
                  {renderDefaultPhoto({ wrapped: true })}
                  {photo.title && (
                    <div
                      style={{
                        position: "absolute",
                        overflow: "hidden",
                        backgroundColor: "rgba(255 255 255 / .6)",
                        inset: "auto 0 0 0",
                        padding: 8,
                      }}
                    >
                      {photo.title}
                    </div>
                  )}
                </div>
              </LazyLoadComponent>
            )}
            targetRowHeight={150}
            onClick={({ index }) => setIndex(index)}
          />
        </div>
      </div>
    </div>
  );
};

export default EventRecords;
