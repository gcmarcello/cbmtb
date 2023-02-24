import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules, formats } from "../../../../utils/quillSettings";
import { toast } from "react-toastify";

import { imageToBase64 } from "../../functions/imageToBase64";
import { handleFileChange } from "../../functions/handleForm";
import ImagePreview from "../imagePreview";

const NewNews = ({ saveCurrentPanel }) => {
  const [news, setNews] = useState({
    title: "",
    subtitle: "",
    text: "",
  });
  const { title, subtitle, text } = news;
  const fileInput = useRef(null);

  // Image Upload States
  const [selectedImage, setSelectedImage] = useState();
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [base64ImageSize, setBase64ImageSize] = useState(null);

  const handleNewsChange = (e, quill) => {
    if (!quill) {
      setNews({ ...news, [e.target.name]: e.target.value });
    } else {
      setNews({ ...news, text: e });
    }
  };

  const handleFormReset = (e) => {
    e.preventDefault();
    setNews({ title: "", subtitle: "", text: "<p><br></p>" });
    fileInput.current.value = "";

    setSelectedImage();
    setIsImageSelected(false);
    setImagePreview(null);
    setBase64Image(null);
  };

  useEffect(() => {
    imageToBase64(selectedImage).then((data) => {
      setBase64Image(data.image);
      setBase64ImageSize(data.size);
    });
  }, [selectedImage]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (parseFloat(base64ImageSize) > 2000) {
        return toast.error("Imagem excede o tamanho máximo de 2000KB (2MB).", { theme: "colored" });
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const body = { title, subtitle, text, base64Image };

      const response = await fetch(`/api/news/`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(body),
      });

      const parseResponse = await response.json();
      saveCurrentPanel("ListNews");
      toast[parseResponse.type](parseResponse.message, { theme: "colored" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container-fluid mt-3">
      <h1>Nova Notícia</h1>
      <form>
        <div className="row">
          <div className="col-12 col-lg-6">
            <label htmlFor="news-title" className="mt-3">
              Título da Notícia
            </label>
            <input type="text" id="news-title" name="title" className="form-control" value={title} onChange={(e) => handleNewsChange(e)} />
          </div>
          <div className="col-12 col-lg-6">
            <label htmlFor="selectedImage" className="mt-3">
              Imagem da Notícia
            </label>
            <div className="input-group">
              <input
                className="form-control"
                type="file"
                accept="image/*"
                name="selectedImage"
                id="selectedImage"
                onChange={(e) => handleFileChange(e, setSelectedImage, setIsImageSelected, imagePreview, setImagePreview)}
                ref={fileInput}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                data-bs-toggle="modal"
                data-bs-target="#eventImageModal"
                disabled={!isImageSelected}
              >
                <i className="bi bi-zoom-in"></i>
              </button>
            </div>
            <div className="d-flex justify-content-between">
              <small id="userHelp" className="form-text text-muted">
                A resolução indicada é de 1920x1080.
              </small>
              <small id="userHelp" className="form-text text-muted">
                Tamanho: {base64ImageSize || 0}/2000KB
              </small>
            </div>
          </div>
        </div>
        <label htmlFor="news-title" className="mt-3">
          Sub-Título da Notícia
        </label>

        <input type="text" id="news-subtitle" name="subtitle" className="form-control" value={subtitle} onChange={(e) => handleNewsChange(e)} />

        <ImagePreview isImageSelected={isImageSelected} imagePreview={imagePreview} modalId={"newsImageModalLabel"} />
        <label htmlFor="news-text" className="mt-3">
          Corpo da Notícia
        </label>
        <ReactQuill
          theme="snow"
          id="news-text"
          name="text"
          value={text}
          modules={modules}
          formats={formats}
          onChange={(e) => handleNewsChange(e, "quill")}
        />
        <div className="d-flex mt-3 justify-content-end">
          <button
            className="btn btn-secondary me-3"
            onClick={(e) => {
              handleFormReset(e);
            }}
          >
            Limpar Formulário
          </button>
          <button
            className="btn btn-success"
            onClick={(e) => {
              handleFormSubmit(e);
            }}
            disabled={!(news.title && news.subtitle && selectedImage)}
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewNews;
