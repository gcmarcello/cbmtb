// Modules
import React, { Fragment, useState } from "react";
import { useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules, formats } from "../../../utils/quillSettings";
import { toast } from "react-toastify";

// Components
import loadingScreen from "../../../utils/loadingScreen";

// Functions
import { imageToBase64 } from "../functions/imageToBase64";
import { handleCategoryChange, handleCategorySubmit, deleteCategory } from "../functions/handleCategories";
import { handleFileChange, handleChange, resetForm, handleSubmit } from "../functions/handleForm";

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
    categoryGender: "",
  });
  const { categoryName, minAge, maxAge, categoryGender } = category;
  const [selectedImage, setSelectedImage] = useState();
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isImageSubmitted, setIsImageSubmitted] = useState(false);
  const [base64Image, setBase64Image] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const config = {
    bucketName: "cbmtb",
    dirName: "eventphotos" /* optional */,
    region: "sa-east-1",
    accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_S3_SECRET_KEY,
  };

  useEffect(() => {
    imageToBase64(selectedImage).then((data) => {
      setBase64Image(data);
    });
  }, [selectedImage]);

  useEffect(() => {
    async function submitForm() {
      if (isImageSubmitted) {
        try {
          const body = { name, location, link, base64Image, price, date, attendees, description, rules, details, categories };

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
          resetForm("event", formInputs, setFormInputs, category, setCategory);
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

  return (
    <Fragment>
      <div className="container-fluid mt-3">
        <h1>Criar Evento</h1>
        <form encType="multipart/form-data">
          <div className="row my-3">
            <div className="col-12 col-lg-4">
              <label htmlFor="name">Nome do Evento</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={name}
                onChange={(e) => handleChange(e, "text", formInputs, setFormInputs)}
              />
            </div>
            <div className="col-12 col-lg-4">
              <label htmlFor="location">Local do Evento</label>
              <input
                type="text"
                id="location"
                name="location"
                className="form-control"
                value={location}
                onChange={(e) => handleChange(e, "text", formInputs, setFormInputs)}
              />
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
                  onChange={(e) => handleChange(e, "text", formInputs, setFormInputs)}
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
                  onChange={(e) => handleFileChange(e, setSelectedImage, setIsImageSelected, imagePreview, setImagePreview)}
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
                  onChange={(e) => handleChange(e, "text", formInputs, setFormInputs)}
                  placeholder="100"
                />
                <span className="input-group-text">,00</span>
              </div>
            </div>
            <div className="col-12 col-lg-3 my-1">
              <label htmlFor="date">Data</label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-control"
                value={date}
                onChange={(e) => handleChange(e, "text", formInputs, setFormInputs)}
              />
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
                  onChange={(e) => handleChange(e, "text", formInputs, setFormInputs)}
                  placeholder="(ex. 1000)"
                />
              </div>
            </div>
          </div>
          <div className="row my-3">
            <div className="col-12">
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
                onChange={(e) => handleChange(e, "description", formInputs, setFormInputs)}
              />
            </div>
            <div className="col-12">
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
                onChange={(e) => handleChange(e, "rules", formInputs, setFormInputs)}
              />
            </div>
            <div className="col-12">
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
                onChange={(e) => handleChange(e, "details", formInputs, setFormInputs)}
              />
            </div>
          </div>
          <hr className="my-4" />
          <h2 className="mt-3">Categorias</h2>
          <div className="row">
            <div className="col-12 col-lg-3">
              <label htmlFor="categoryName" className="form-label">
                Nome da Categoria
              </label>
              <input
                type="text"
                name="categoryName"
                id="categoryName"
                value={categoryName}
                className="form-control"
                onChange={(e) => handleCategoryChange(category, setCategory, e)}
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
                min={1}
                max={120}
                onChange={(e) => handleCategoryChange(category, setCategory, e)}
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
                onChange={(e) => handleCategoryChange(category, setCategory, e)}
              />
            </div>
            <div className="col-12 col-lg-3 mt-2 mt-lg-0">
              <label htmlFor="categoryGender" className="form-label">
                Sexo
              </label>
              <select
                className={`form-select`}
                aria-label="Default select example"
                id="categoryGender"
                name="categoryGender"
                value={categoryGender}
                onChange={(e) => handleCategoryChange(category, setCategory, e)}
              >
                <option value="" disabled={true}>
                  Selecione
                </option>
                <option value="masc">Masculino</option>
                <option value="fem">Feminino</option>
                <option value="unisex">Unissex</option>
              </select>
            </div>
            <div className="col-12 col-lg-2">
              <div className="mt-3"></div>
              <button
                className="btn btn-secondary form-control mt-3 my-3 mb-lg-0"
                onClick={(e) => handleCategorySubmit(formInputs, setFormInputs, e, resetForm, category, setCategory)}
              >
                Criar
              </button>
            </div>
            <div className="col-12">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Idade Mín</th>
                    <th>Idade Máx</th>
                    <th>Sexo</th>
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
                          <td>{category.gender}</td>
                          <td>
                            <button className="btn btn-danger" onClick={(e) => deleteCategory(formInputs, setFormInputs, e, category.index)}>
                              <i className="bi bi-x-circle"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={5}>
                        <span className="d-flex justify-content-center">Nenhuma categoria criada.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button className="btn btn-success my-3" onClick={(e) => handleSubmit(e, setIsLoading, setEventChange, setIsImageSubmitted)}>
              Criar Evento
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default NewEvent;
