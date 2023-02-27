import React, { useState, useEffect, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

import { parseDate } from "../../utils/functions/parseDate";

import LoadingScreen from "../../utils/loadingScreen";

const AllNews = () => {
  const [allNews, setAllNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllNews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/news/public/all`, {
        method: "GET",
      });
      const parseResponse = await response.json();
      for (let i = 0; i < parseResponse.length; i++) {
        parseResponse[i].formattedDate = parseDate(parseResponse[i].news_date);
        parseResponse[i].formattedUpdate = parseDate(parseResponse[i].news_last_update);
      }
      setAllNews(parseResponse);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  function Items({ currentItems }) {
    return (
      <>
        {currentItems &&
          currentItems.map((news) => (
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
                  <i className="bi bi-calendar-fill"></i> {news.formattedDate}
                </small>
              </div>
            </div>
          ))}
      </>
    );
  }

  function PaginatedItems({ itemsPerPage, itemList }) {
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    // Simulate fetching items from another resources.
    // (This could be items from props; or items loaded in a local state
    // from an API endpoint with useEffect and useState)
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = itemList.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(itemList.length / itemsPerPage);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
      const newOffset = (event.selected * itemsPerPage) % itemList.length;
      setItemOffset(newOffset);
    };

    return (
      <>
        <div className="d-flex flex-wrap justify-content-evenly">
          <Items currentItems={currentItems} />
        </div>
        <div className="d-flex justify-content-center">
          <ReactPaginate
            breakLabel="..."
            nextLabel="Próximo >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="< Anterior"
            renderOnZeroPageCount={null}
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
          />
        </div>
      </>
    );
  }

  useEffect(() => {
    fetchAllNews();
  }, []);

  return (
    <div className="container inner-page">
      <h1>Notícias</h1>
      <div className="row">
        <div className="col-12">
          <PaginatedItems itemsPerPage={5} itemList={allNews} />
        </div>
      </div>
    </div>
  );
};

export default AllNews;
