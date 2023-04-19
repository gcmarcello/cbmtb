import React, { Fragment, useState } from "react";
import { useEffect } from "react";
const dayjs = require("dayjs");

const LatestNews = ({ category }) => {
  const [newsList, setNewsList] = useState([]);

  const getNews = async (e) => {
    try {
      const response = await fetch(`/api/news/public/${category && category}`, {
        method: "GET",
      });
      const parseResponse = await response.json();
      setNewsList(parseResponse);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getNews();
  }, []);

  return (
    <Fragment>
      <div className="container-fluid d-flex flex-column bg-light pt-3">
        <div id="hero-anchor"></div>
        <div className="row">
          <div className="col-12">
            <h1>Últimas Notícias</h1>
            <div className={`d-flex flex-wrap justify-content-${newsList > 2 ? "evenly" : "center"}`}>
              {newsList < 1 ? (
                <h3>Em breve, mais notícias!</h3>
              ) : (
                newsList.map((news) => (
                  <div key={news.news_id} className="card main-page-card m-3 shadow-lg" style={{ width: "18rem" }}>
                    <a className="stretched-link" href={`/noticias/${news.news_link}`}>
                      <img src={news.news_image_link} className="card-img-top" alt="..." height={169.73} width={286} />
                    </a>
                    <hr className="my-0" />
                    <div className="card-body">
                      <h5 className="card-title">{news.news_title}</h5>
                      <p>{news.news_subtitle}</p>
                    </div>
                    <div className={`card-footer d-flex justify-content-between align-items-center`}>
                      <small className="text-muted">
                        <i className="bi bi-tag-fill"></i> {news.news_category}
                      </small>
                      <small className="text-muted">
                        <i className="bi bi-calendar-fill"></i> {dayjs(news.news_date).format("DD/MM/YYYY")}
                      </small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-2"></div>
          <div className="col-8 d-flex justify-content-center my-3">
            <a href="/noticias">
              <button className="btn btn-lg btn-primary">Ver Mais</button>
            </a>
          </div>
          <div className="col-2"></div>
        </div>
      </div>
    </Fragment>
  );
};

export default LatestNews;
