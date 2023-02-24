import React, { Fragment, useState } from "react";
import { useEffect } from "react";
import ReactQuill from "react-quill";
import { modules, formats } from "../../../../utils/quillSettings";
import { toast } from "react-toastify";

import LoadingScreen from "../../../../utils/loadingScreen";

import { parseDateToForm, handleChange, handleFileChange, cancelFileUpload, handleDelete } from "../../functions/handleForm";
import {
  fetchCategories,
  createCategoryEditingEvent,
  deletedSavedCategory,
  handleCategoryChange,
  handleNewCategoryChange,
} from "../../functions/handleCategories";
import { imageToBase64 } from "../../functions/imageToBase64";

const EditEvent = ({ eventChange, setEventChange, event }) => {
  const [formInputs, setFormInputs] = useState({
    name: event.event_name,
    price: event.event_price,
    location: event.event_location,
    date: parseDateToForm(event.event_date),
    attendees: event.event_max_attendees,
    description: event.event_description,
    rules: event.event_rules,
    details: event.event_details,
    link: event.event_link,
    imageLink: event.event_image,
  });
  const { name, price, location, date, attendees, description, rules, details, link, imageLink } = formInputs;
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newCategory, setNewCategory] = useState({
    categoryName: "",
    categoryMinAge: "",
    categoryMaxAge: "",
    categoryGender: "",
  });
  const [categoryChange, setCategoryChange] = useState(false);
  const { categoryName, categoryMinAge, categoryMaxAge, categoryGender } = newCategory;

  // Image Upload States
  const [selectedImage, setSelectedImage] = useState();
  const [imagePreview, setImagePreview] = useState(null);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [base64Image, setBase64Image] = useState(null);

  const submitForm = async () => {
    try {
      setEventChange(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const body = { name, price, location, date, attendees, description, rules, details, link, categories, base64Image };
      const response = await fetch(`/api/events/${event.event_id}`, {
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
      setEventChange(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (event.event_id) {
      fetchCategories(event.event_id, setCategories);
    } //eslint-disable-next-line
  }, [categoryChange, formInputs]);

  useEffect(() => {
    if (isImageSelected) {
      imageToBase64(selectedImage).then((data) => {
        setBase64Image(data.image);
      });
    }
  }, [selectedImage, isImageSelected]);

  return (
    <Fragment>
      <button className="btn btn-dark ms-1" data-bs-toggle="modal" data-bs-target={`#modal-event-${event.event_id}`}>
        <i className="bi bi-gear"></i>
      </button>
      <div
        className="modal modal-lg fade"
        id={`modal-event-${event.event_id}`}
        tabIndex="-1"
        aria-labelledby={`modal-label-event-${event.event_id}`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id={`modal-label-event-${event.event_id}`}>
                Editar - {event.event_name}
              </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <label htmlFor="name">Nome do Evento</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={name}
                  onChange={(e) => handleChange(e, "text", formInputs, setFormInputs)}
                />
                <label htmlFor="location">Local do Evento</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="form-control"
                  value={location}
                  onChange={(e) => handleChange(e, "text", formInputs, setFormInputs)}
                />
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
                <div className="d-flex flex-column">
                  <label htmlFor="selectedImage">Imagem do Evento</label>
                  <img
                    src={imagePreview ? imagePreview : imageLink}
                    alt=""
                    className="img-fluid my-2"
                    style={{ width: "100%", maxWidth: "800px", maxHeight: "475px" }}
                  />
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    name="selectedImage"
                    id="selectedImage"
                    onChange={(e) => handleFileChange(e, setSelectedImage, setIsImageSelected, imagePreview, setImagePreview)}
                  />
                </div>
                <label htmlFor="price">Preço da Inscrição</label>
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
                <label htmlFor="date">Data</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => handleChange(e, "text", formInputs, setFormInputs)}
                />
                <label htmlFor="price">Número de Participantes</label>
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
                    placeholder="Número máximo (ex. 1000)"
                  />
                </div>
                <hr />
                <label htmlFor="description" className="form-label">
                  Descrição
                </label>
                <ReactQuill
                  modules={modules}
                  formats={formats}
                  theme="snow"
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => handleChange(e, "description", formInputs, setFormInputs)}
                />
                <label htmlFor="rules" className="form-label">
                  Regulamento
                </label>
                <ReactQuill
                  theme="snow"
                  id="rules"
                  name="rules"
                  value={rules}
                  onChange={(e) => handleChange(e, "rules", formInputs, setFormInputs)}
                />
                <label htmlFor="details" className="form-label">
                  Detalhes
                </label>
                <ReactQuill
                  theme="snow"
                  id="details"
                  name="details"
                  value={details}
                  onChange={(e) => handleChange(e, "details", formInputs, setFormInputs)}
                />
                <hr />
                <h4>Categorias</h4>
                <div className="container-fluid">
                  {isLoading ? (
                    <LoadingScreen />
                  ) : (
                    <Fragment>
                      <div className="row">
                        <div className="col-5">
                          <label htmlFor="name">Nome</label>
                          <input
                            type="text"
                            id="categoryName"
                            name="categoryName"
                            className="form-control"
                            value={categoryName}
                            onChange={(e) => handleNewCategoryChange(e, setNewCategory, newCategory)}
                          />
                        </div>
                        <div className="col-2">
                          <label htmlFor="name">Id. Min.</label>
                          <input
                            type="number"
                            id="categoryMinAge"
                            name="categoryMinAge"
                            className="form-control"
                            value={categoryMinAge}
                            onChange={(e) => handleNewCategoryChange(e, setNewCategory, newCategory)}
                          />
                        </div>
                        <div className="col-2">
                          <label htmlFor="name">Id. Max.</label>
                          <input
                            type="number"
                            id="categoryMaxAge"
                            name="categoryMaxAge"
                            className="form-control"
                            value={categoryMaxAge}
                            onChange={(e) => handleNewCategoryChange(e, setNewCategory, newCategory)}
                          />
                        </div>
                        <div className="col-3">
                          <label htmlFor="name">Sexo</label>
                          <select
                            className="form-select"
                            id="categoryGender"
                            name="categoryGender"
                            value={categoryGender}
                            onChange={(e) => handleNewCategoryChange(e, setNewCategory, newCategory)}
                          >
                            <option value="" disabled={true}>
                              Selecione
                            </option>
                            <option value="masc">Masc.</option>
                            <option value="fem">Fem.</option>
                            <option value="unisex">Unissex</option>
                          </select>
                        </div>
                      </div>
                      <div className="row my-3">
                        <div className="col-12">
                          <button
                            className="btn btn-success form-control"
                            onClick={(e) =>
                              createCategoryEditingEvent(
                                e,
                                event.event_id,
                                setIsLoading,
                                setNewCategory,
                                setCategoryChange,
                                categoryName,
                                categoryMinAge,
                                categoryMaxAge,
                                categoryGender
                              )
                            }
                          >
                            Criar Categoria
                          </button>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <table className="table">
                            <thead>
                              <tr>
                                <td colSpan={2}>Nome</td>
                                <td>Idade Max.</td>
                                <td>Idade Min.</td>
                                <td>Sexo</td>
                                <td></td>
                              </tr>
                            </thead>
                            <tbody>
                              {categories.map((category) => (
                                <tr key={`category-${category.category_id}`}>
                                  <td colSpan={2}>
                                    <div>
                                      <input
                                        id={`${category.category_id}-name`}
                                        name="category_name"
                                        value={category.category_name}
                                        className="form-control"
                                        onChange={(e) => handleCategoryChange(e, category.category_id, categories, setCategories)}
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <input
                                      id={`${category.category_id}-minage`}
                                      name="category_minage"
                                      value={category.category_minage}
                                      className="form-control"
                                      onChange={(e) => handleCategoryChange(e, category.category_id, categories, setCategories)}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      id={`${category.category_id}-maxage`}
                                      name="category_maxage"
                                      value={category.category_maxage}
                                      className="form-control"
                                      onChange={(e) => handleCategoryChange(e, category.category_id, categories, setCategories)}
                                    />
                                  </td>
                                  <td>
                                    <select
                                      className={`form-select`}
                                      aria-label="Default select example"
                                      id={`${category.category_id}-gender`}
                                      name="category_gender"
                                      value={category.category_gender}
                                      onChange={(e) => handleCategoryChange(e, category.category_id, categories, setCategories)}
                                    >
                                      <option value="masc">Masc.</option>
                                      <option value="fem">Fem.</option>
                                      <option value="unisex">Unissex</option>
                                    </select>
                                  </td>
                                  <td className="text-center">
                                    <button
                                      className="btn btn-danger"
                                      onClick={(e) => deletedSavedCategory(e, category.category_id, categories, setCategories)}
                                    >
                                      <i className="bi bi-x-circle"></i>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </Fragment>
                  )}
                </div>
              </form>
            </div>

            <div className="modal-footer justify-content-between">
              <div>
                <button
                  type="button"
                  className="btn btn-danger"
                  data-bs-dismiss="modal"
                  onClick={(e) => handleDelete(e, event.event_id, setEventChange)}
                >
                  Remover Evento
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  data-bs-dismiss="modal"
                  onClick={() => cancelFileUpload(setSelectedImage, setImagePreview)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  data-bs-dismiss="modal"
                  onClick={(e) => {
                    submitForm();
                  }}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditEvent;
