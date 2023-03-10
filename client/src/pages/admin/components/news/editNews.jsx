import React, { Fragment, useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

import { fileToBase64 } from "../../functions/fileToBase64";

const EditNews = ({ newsChange, setNewsChange, news, setIsLoading }) => {
  const [newsForm, setNewsForm] = useState({
    title: news.news_title,
    image: news.news_image_link,
    subtitle: news.news_subtitle,
    newsBody: news.news_text,
  });

  const { title, image, subtitle, newsBody } = newsForm;

  // Image Upload States
  const [selectedImage, setSelectedImage] = useState();
  const [imagePreview, setImagePreview] = useState(null); //eslint-disable-next-line
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [base64Image, setBase64Image] = useState(null);
  const [base64ImageSize, setBase64ImageSize] = useState(null);

  const submitForm = async () => {
    try {
      setIsLoading(true);
      setNewsChange(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const body = { title, image, subtitle, newsBody, base64Image };
      const response = await fetch(`/api/news/${news.news_id}`, {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(body),
      });
      const parseResponse = await response.json();
      if (parseResponse.type === "success") {
        toast.success(parseResponse.message, { theme: "colored" });
      } else {
        toast.error(parseResponse.message, { theme: "colored" });
      }
      setNewsChange(false);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteNews = async () => {
    try {
      setIsLoading(true);
      setNewsChange(true);

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);
      const response = await fetch(`/api/news/${news.news_id}`, {
        method: "DELETE",
        headers: myHeaders,
      });
      const parseResponse = await response.json();
      toast[parseResponse.type](parseResponse.message, { theme: "colored" });
      setNewsChange(false);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Fragment>
      <button className="btn btn-dark ms-1" data-bs-toggle="modal" data-bs-target={`#modal-news-${news.news_id}`}>
        <i className="bi bi-gear"></i>
      </button>

      <div
        className="modal modal-lg fade"
        id={`modal-news-${news.news_id}`}
        tabIndex="-1"
        aria-labelledby={`#modal-label-${news.news_id}`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`#modal-label-${news.news_id}`}>
                Editar Notícia - {news.news_title}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <label htmlFor="title">Título da Notícia</label>
              <input className="form-control mb-3" type="text" name="title" id="title" value={title} />
              <label htmlFor="subtitle">Subtítulo da Notícia</label>
              <input className="form-control mb-3" type="text" name="subtitle" id="subtitle" value={subtitle} />
              <div className="d-flex flex-column">
                <label htmlFor="image">Imagem da Notícia</label>
                <img src={base64Image || news.news_image_link} alt="" className="img-fluid rounded mb-2" />
                <input className="form-control " type="file" accept="image/*" name="title" id="title" />
                <small id="userHelp" className="form-text text-muted mb-3">
                  O tamanho indicado é de 1920x1080.
                </small>
              </div>
              <label htmlFor="text">Corpo Da Notícia</label>
            </div>
            <div className="modal-footer justify-content-between">
              <div>
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => deleteNews()}>
                  Remover Notícia
                </button>
              </div>
              <div>
                <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">
                  Cancelar
                </button>
                <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={() => submitForm()}>
                  Salvar Mudanças
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditNews;
