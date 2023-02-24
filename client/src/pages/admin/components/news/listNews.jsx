import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

import EditNews from "./editNews";

import { parseDate } from "../../../../utils/functions/parseDate";

const ListNews = ({ newsChange, setNewsChange, saveCurrentPanel }) => {
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getNews = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const response = await fetch("/api/news/", {
        method: "GET",
        headers: myHeaders,
      });
      const parseResponse = await response.json();

      for (let i = 0; i < parseResponse.length; i++) {
        parseResponse[i].formattedDate = parseDate(parseResponse[i].news_date, "complete");
        parseResponse[i].formattedUpdate = parseDate(parseResponse[i].news_last_update, "complete");
      }

      setNewsList(parseResponse);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleNews = async (id, boolean) => {
    try {
      setNewsChange(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const response = await fetch(`/api/news/toggle/${id}/${boolean}`, {
        method: "PUT",
        headers: myHeaders,
      });
      const parseResponse = await response.json();
      toast[parseResponse.type](parseResponse.message, { theme: "colored" });
      setNewsChange(false);
    } catch (err) {
      console.log(err);
    }
  };

  function Items({ currentItems }) {
    return (
      <>
        {currentItems &&
          currentItems.map((news) => (
            <tr key={`news-${news.news_id}`}>
              <td>{news.news_title}</td>
              <td className="d-none d-lg-table-cell">{news.formattedDate}</td>
              <td className="d-none d-lg-table-cell">{news.formattedUpdate}</td>
              <td>
                <EditNews news={news} setNewsChange={setNewsChange} setIsLoading={setIsLoading} />
                {!news.news_status ? (
                  <button className="btn btn-success my-1 ms-1" onClick={(e) => toggleNews(news.news_id, 1)}>
                    <i className="bi bi-check-circle"> Publicar</i>
                  </button>
                ) : (
                  <button className="btn btn-danger my-1 ms-1" onClick={(e) => toggleNews(news.news_id, 0)}>
                    <i className="bi bi-x-circle"> Despublicar</i>
                  </button>
                )}
              </td>
            </tr>
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
        <Items currentItems={currentItems} />
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
      </>
    );
  }

  useEffect(() => {
    getNews();
  }, [newsChange]);

  return (
    <Fragment>
      <div className="container-fluid mt-3">
        <h1>Lista de Notícias</h1>
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>Nome</th>
              <th className="d-none d-lg-table-cell">Data</th>
              <th className="d-none d-lg-table-cell">Última Atualização</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {!isLoading ? (
              <PaginatedItems itemsPerPage={4} itemList={newsList} />
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  <div className="spinner-border" role="status"></div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="d-flex justify-content-end">
          <button className="btn btn-success" onClick={() => saveCurrentPanel("NewNews")} disabled={isLoading}>
            Criar Notícia
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default ListNews;
