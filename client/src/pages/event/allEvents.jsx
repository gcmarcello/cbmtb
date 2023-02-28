import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

import { parseDate } from "../../utils/functions/parseDate";

import LoadingScreen from "../../utils/loadingScreen";

const AllEvents = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/events/public/`, {
        method: "GET",
      });
      const parseResponse = await response.json();
      for (let i = 0; i < parseResponse.length; i++) {
        parseResponse[i].formattedDate = parseDate(parseResponse[i].event_date);
        parseResponse[i].date = parseDate(parseResponse[i].event_date, "calendar");
        parseResponse[i].title = parseResponse[i].event_name;
      }
      setAllEvents(parseResponse);
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
          currentItems.map((event) => (
            <div key={event.event_id} className="card main-page-card m-3 shadow-lg" style={{ width: "18rem" }}>
              <a className="stretched-link" href={`/evento/${event.event_link}`}>
                <img src={event.event_image} className="card-img-top" alt="..." height={169.73} width={286} />
              </a>
              <hr className="my-0" />
              <div className="card-body">
                <h5 className="card-title">{event.event_name}</h5>
                <p>{event.news_subtitle}</p>
              </div>
              <div className={`card-footer d-flex justify-content-between align-items-center`}>
                <small className="text-muted">
                  <i className="bi bi-geo-alt-fill"></i> {event.event_location}
                </small>
                <small className="text-muted">
                  <i className="bi bi-calendar-fill"></i> {event.formattedDate}
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
    fetchAllEvents();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="container inner-page">
      <h1>Eventos</h1>
      <div className="row">
        <div className="col-12">
          <PaginatedItems itemsPerPage={5} itemList={allEvents} />
        </div>
      </div>
    </div>
  );
};

export default AllEvents;
