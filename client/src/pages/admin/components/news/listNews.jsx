import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

import Table from "../table";

const ListNews = () => {
  const [newsList, setNewsList] = useState([]);

  const columns = [
    {
      Header: "Notícia",
      accessor: "news_title",
    },
    {
      accessor: "formattedDate",
      Header: "Data",
    },
    {
      accessor: "formattedUpdate",
      Header: "Última Atualização",
    },
    {
      Header: "Status",
      accessor: "news_status",
      Cell: ({ value, row }) => (
        <div>
          {value ? (
            <span role="button" className="badge text-bg-success" onClick={() => toggleNews(row.original.news_id, !value)}>
              Publicada
            </span>
          ) : (
            <span role="button" className="badge text-bg-danger" onClick={() => toggleNews(row.original.news_id, !value)}>
              Não Publicada
            </span>
          )}
        </div>
      ),
    },
    {
      accessor: "news_id",
      Header: "Opções",
      Cell: ({ value }) => (
        <div>
          <a href={`/painel/noticias/${value}/`} className="btn btn-dark mx-1">
            <i className="bi bi-gear-fill"></i>
          </a>
        </div>
      ),
    },
  ];

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
        const date = new Date(parseResponse[i].news_date);
        const update = new Date(parseResponse[i].news_last_update);
        parseResponse[i].formattedDate = date.toLocaleString("pt-BR");
        parseResponse[i].formattedUpdate = update.toLocaleString("pt-BR");
      }
      setNewsList(parseResponse);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleNews = async (id, boolean) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const response = await fetch(`/api/news/toggle/${id}/${boolean}`, {
        method: "PUT",
        headers: myHeaders,
      });
      const parseResponse = await response.json();
      toast[parseResponse.type](parseResponse.message, { theme: "colored" });
      getNews();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getNews();
  }, []);

  return (
    <div className="bg-light">
      <div className="px-lg-5 py-lg-5">
        <div className="p-3 bg-white rounded rounded-2 shadow">
          <Table data={newsList} columns={columns} />
          <div className="d-flex justify-content-end">
            <a href="noticias/nova" className="btn btn-success">
              Nova Notícia
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListNews;
