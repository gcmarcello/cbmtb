import React, { Fragment, useState } from "react";
import { useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules, formats } from "../utils/quillSettings";
import { toast } from "react-toastify";
import loadingScreen from "../utils/loadingScreen";

const NewEvent = ({ eventChange, setEventChange, saveCurrentPanel }) => {
  const [formInputs, setFormInputs] = useState({
    name: "",
    location: "",
    link: "",
    imageLink: "",
    price: "",
    date: "",
    attendees: "",
    description: "",
    rules: "",
    details: "",
    categories: [],
  });
  const { name, link, price, imageLink, location, date, attendees, description, rules, details, categories } = formInputs;
  const [category, setCategory] = useState({
    categoryName: "",
    minAge: "",
    maxAge: "",
  });
  const { categoryName, minAge, maxAge } = category;
  const [selectedImage, setSelectedImage] = useState();
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isImageSubmitted, setIsImageSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setIsImageSelected(true);
    URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleChange = (e, type) => {
    if (type === "text") {
      setFormInputs({ ...formInputs, [e.target.name]: e.target.value });
    } else {
      setFormInputs({ ...formInputs, [type]: e });
    }
  };

  const handleCategoryChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const deleteCategory = (e, index) => {
    e.preventDefault();
    setFormInputs({ ...formInputs, categories: formInputs.categories.filter((category) => category.index !== index) });
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    setFormInputs({
      ...formInputs,
      categories: [
        ...formInputs.categories,
        {
          name: category.categoryName,
          minAge: Number(category.minAge),
          maxAge: Number(category.maxAge),
          index: Number(formInputs.categories.length + 1),
        },
      ],
    });
    resetForm("category");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setEventChange(true);

      const imgurHeaders = new Headers();
      imgurHeaders.append("Authorization", `Client-ID c9152aece7f0dfe`);
      let formdata = new FormData();
      formdata.append("image", selectedImage);
      let requestOptions = {
        method: "POST",
        headers: imgurHeaders,
        body: formdata,
        redirect: "follow",
      };

      const imgurResponse = await fetch("https://api.imgur.com/3/image", requestOptions);
      const parseImgurResponse = await imgurResponse.json();
      setFormInputs({ ...formInputs, imageLink: parseImgurResponse.data.link });
      setIsImageSubmitted(true);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    async function submitForm() {
      if (isImageSubmitted) {
        try {
          const body = { name, location, link, imageLink, price, date, attendees, description, rules, details, categories };

          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append("token", localStorage.token);

          let requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(body),
          };

          const response = await fetch("/api/events/create", requestOptions); // eslint-disable-next-line
          const parseResponse = await response.json();
          setEventChange(false);
          resetForm("event");
          saveCurrentPanel("ListEvents");
          toast.success(parseResponse.message, { theme: "colored" });
        } catch (error) {
          toast.error(error.message, { theme: "colored" });
          console.log(error);
        }
        setIsLoading(false);
      }
    }
    submitForm(); // eslint-disable-next-line
  }, [isImageSubmitted]);

  const resetForm = (type) => {
    const emptyState = {};
    if (type === "event") {
      const keys = Object.keys(formInputs);
      keys.forEach((key) => {
        emptyState[key] = "";
      });
      setFormInputs(emptyState);
    } else {
      const keys = Object.keys(category);
      keys.forEach((key) => {
        emptyState[key] = "";
      });
      setCategory(emptyState);
    }
  };

  return (
    <Fragment>
      <div className="container-fluid mt-3">
        <h1>Criar Evento</h1>
        <form encType="multipart/form-data">
          <div className="row my-3">
            <div className="col-12 col-lg-4">
              <label htmlFor="name">Nome do Evento</label>
              <input type="text" id="name" name="name" className="form-control" value={name} onChange={(e) => handleChange(e, "text")} />
            </div>
            <div className="col-12 col-lg-4">
              <label htmlFor="location">Local do Evento</label>
              <input type="text" id="location" name="location" className="form-control" value={location} onChange={(e) => handleChange(e, "text")} />
            </div>

            <div className="col-12 col-lg-4">
              <label htmlFor="price">Link do evento</label>
              <div className="input-group">
                <span className="input-group-text" id="basic-addon1">
                  cbmtb.com/eventos/
                </span>
                <input
                  type="text"
                  id="link"
                  name="link"
                  className="form-control"
                  value={link}
                  onChange={(e) => handleChange(e, "text")}
                  placeholder="evento"
                  maxLength={20}
                />
              </div>
            </div>
          </div>
          <div className="row my-3">
            <div className="col-12 col-lg-4 my-1">
              <label htmlFor="location">Imagem Principal do Evento</label>
              <div className="input-group">
                <input
                  className="form-control"
                  type="file"
                  accept="image/*"
                  name="selectedImage"
                  id="selectedImage"
                  onChange={(e) => handleFileChange(e)}
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
              <small id="userHelp" className="form-text text-muted">
                O tamanho indicado é de 800x475.
              </small>

              {isImageSelected ? (
                <div className="modal fade" id="eventImageModal" tabIndex="-1" aria-labelledby="eventImageModalLabel" aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="eventImageModalLabel">
                          Preview da Imagem
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                        <img src={imagePreview} alt="Imagem do Evento" style={{ maxWidth: "100%" }} />
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                          Fechar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="col-12 col-lg-3 my-1">
              <label htmlFor="price">Preço</label>
              <div className="input-group">
                <span className="input-group-text" id="basic-addon1">
                  R$
                </span>
                <input
                  type="text"
                  id="price"
                  name="price"
                  className="form-control"
                  value={price}
                  onChange={(e) => handleChange(e, "text")}
                  placeholder="100"
                />
                <span className="input-group-text">,00</span>
              </div>
            </div>
            <div className="col-12 col-lg-3 my-1">
              <label htmlFor="date">Data</label>
              <input type="date" id="date" name="date" className="form-control" value={date} onChange={(e) => handleChange(e, "text")} />
            </div>

            <div className="col-12 col-lg-2 my-1">
              <label htmlFor="price">Participantes</label>
              <div className="input-group">
                <span className="input-group-text" id="basic-addon1">
                  <i className="bi bi-people-fill"></i>
                </span>
                <input
                  type="text"
                  id="attendees"
                  name="attendees"
                  className="form-control"
                  value={attendees}
                  onChange={(e) => handleChange(e, "text")}
                  placeholder="(ex. 1000)"
                />
              </div>
            </div>
          </div>
          <div className="row my-3">
            <div className="col-12 col-lg-4">
              <label htmlFor="description" className="form-label">
                Descrição
              </label>
              <ReactQuill
                theme="snow"
                id="description"
                name="description"
                value={description}
                modules={modules}
                formats={formats}
                onChange={(e) => handleChange(e, "description")}
              />
            </div>
            <div className="col-12 col-lg-4">
              <label htmlFor="rules" className="form-label">
                Regulamento
              </label>
              <ReactQuill
                theme="snow"
                id="rules"
                name="rules"
                value={rules}
                modules={modules}
                formats={formats}
                onChange={(e) => handleChange(e, "rules")}
              />
            </div>
            <div className="col-12 col-lg-4">
              <label htmlFor="details" className="form-label">
                Detalhes
              </label>
              <ReactQuill
                theme="snow"
                id="details"
                name="details"
                value={details}
                modules={modules}
                formats={formats}
                onChange={(e) => handleChange(e, "details")}
              />
            </div>
          </div>
          <hr className="my-4" />
          <h2 className="mt-3">Categorias</h2>
          <div className="row">
            <div className="col-12 col-lg-6">
              <label htmlFor="categoryName" className="form-label">
                Nome da Categoria
              </label>
              <input
                type="text"
                name="categoryName"
                id="categoryName"
                value={categoryName}
                className="form-control"
                onChange={(e) => handleCategoryChange(e)}
              />
            </div>
            <div className="col-6 col-lg-2 mt-2 mt-lg-0">
              <label htmlFor="categoryMinAge" className="form-label">
                Idade mínima
              </label>
              <input
                type="number"
                name="minAge"
                id="categoryMinAge"
                value={minAge}
                className="form-control"
                onChange={(e) => handleCategoryChange(e)}
              />
            </div>
            <div className="col-6 col-lg-2 mt-2 mt-lg-0">
              <label htmlFor="categoryMaxAge" className="form-label">
                Idade máxima
              </label>
              <input
                type="number"
                name="maxAge"
                id="categoryMaxAge"
                value={maxAge}
                className="form-control"
                onChange={(e) => handleCategoryChange(e)}
              />
            </div>
            <div className="col-12 col-lg-2 mt-3 mt-lg-6">
              <button className="btn btn-secondary form-control my-3" onClick={(e) => handleCategorySubmit(e)}>
                Criar Categoria
              </button>
            </div>
            <div className="col-12">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Nome da Categoria</th>
                    <th>Idade Mínima</th>
                    <th>Idade Máxima</th>
                    <th>Opções</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {formInputs.categories.length ? (
                    formInputs.categories
                      .sort((a, b) => a.minAge - b.minAge)
                      .map((category, index) => (
                        <tr key={`category-${index}`}>
                          <td>{category.name}</td>
                          <td>{category.minAge}</td>
                          <td>{category.maxAge}</td>
                          <td>
                            <button className="btn btn-danger" onClick={(e) => deleteCategory(e, category.index)}>
                              <i className="bi bi-x-circle"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={4}>
                        <span className="d-flex justify-content-center">Nenhuma categoria criada.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button className="btn btn-success my-3" onClick={(e) => handleSubmit(e)}>
              Criar Evento
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default NewEvent;
