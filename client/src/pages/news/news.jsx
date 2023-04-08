import React, { useState, useEffect, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { parseDate } from "../../utils/functions/parseDate";
import _config from "../../_config";
import LoadingScreen from "../../utils/loadingScreen";

const NewsPage = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/news/${title}`, {
        method: "GET",
      });
      const parseResponse = await response.json();
      if (parseResponse.type === "error") {
        navigate("/404");
        return;
      }
      parseResponse.formattedDate = parseDate(parseResponse.news_date);
      parseResponse.formattedUpdate = parseDate(
        parseResponse.news_last_update,
        "complete"
      );
      setNews(parseResponse);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNews(); // eslint-disable-next-line
  }, []);

  if (isLoading === true) {
    return <LoadingScreen />;
  }

  return (
    <Fragment>
      <div className="container inner-page">
        <div className="">
          <h1 className="mb-0">{news.news_title}</h1>
          <p className="text-muted fw-normal">{news.news_subtitle}</p>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="fw-normal mb-0">
                <span className="d-none d-lg-inline-block">
                  {news.formattedDate} ·{" "}
                </span>{" "}
                Atualizado{" "}
                <span className="d-none d-lg-inline-block">por último em</span>
                {` ${news.formattedUpdate}`}
              </p>
            </div>

            <div className="d-flex justify-content-evenly">
              <i
                className="bi bi-facebook share-button fs-4 mx-2"
                id="facebook-share"
              >
                {" "}
              </i>
              <i
                className="bi bi-twitter share-button fs-4 mx-2"
                id="twitter-share"
              ></i>
              <a
                href={`https://api.whatsapp.com/send?text=${_config.site.url}/noticias/${news.news_link}`}
                target="_blank"
                rel="noreferrer"
              >
                <i
                  className="bi bi-whatsapp share-button fs-4 mx-2 text-decoration-none"
                  id="whatsapp-share"
                ></i>
              </a>
            </div>
          </div>

          <hr className="mt-2" />
        </div>

        <img
          src={news.news_image_link}
          style={{ maxHeight: "475px" }}
          alt="Imagem da Notícia"
          className="img-fluid rounded mx-auto d-block"
        ></img>
        <div
          dangerouslySetInnerHTML={{ __html: news.news_text }}
          className="mt-3"
        ></div>
      </div>
    </Fragment>
  );
};

export default NewsPage;
