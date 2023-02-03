import React, { Fragment, useState } from "react";
import { useEffect } from "react";
import ReactQuill from "react-quill";
import { modules, formats } from "../../../utils/quillSettings";
import { toast } from "react-toastify";

import LoadingScreen from "../../../utils/loadingScreen";

const EditEvent = ({ eventChange, setEventChange, event }) => {
  let dateToParse = new Date(event.event_date);
  let dateToParseDay = String(dateToParse.getDate()).padStart(2, 0);
  let dateToParseMonth = String(dateToParse.getMonth() + 1).padStart(2, 0);
  let dateToParseYear = String(dateToParse.getFullYear());
  event.parsedDate = `${dateToParseYear}-${dateToParseMonth}-${dateToParseDay}`;

  const [formInputs, setFormInputs] = useState({
    name: event.event_name,
    price: event.event_price,
    location: event.event_location,
    date: event.parsedDate,
    attendees: event.event_max_attendees,
    description: event.event_description,
    rules: event.event_rules,
    details: event.event_details,
    link: event.event_link,
    imageLink: event.event_image,
  });
  const { name, price, location, date, attendees, description, rules, details, link, imageLink } = formInputs; // eslint-disable-next-line
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

  const [selectedImage, setSelectedImage] = useState();
  const [imagePreview, setImagePreview] = useState(null);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [isImageSubmitted, setIsImageSubmitted] = useState(false);

  const handleChange = (e, type) => {
    if (type === "text") {
      setFormInputs({ ...formInputs, [e.target.name]: e.target.value });
    } else {
      setFormInputs({ ...formInputs, [type]: e });
    }
  };

  const handleFileChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setIsImageSelected(true);
    URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleFileCancel = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e, id) => {
    e.preventDefault();
    if (selectedImage) {
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
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    setEventChange(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const response = await fetch(`/api/events/delete/${id}`, {
        method: "DELETE",
        headers: myHeaders,
      });
      setEventChange(false);
    } catch (err) {
      console.log(err);
    }
  };

  const createCategory = async (e, id) => {
    e.preventDefault();
    setCategoryChange(true);
    try {
      setIsLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const body = { categoryName, categoryMinAge, categoryMaxAge, categoryGender };

      const response = await fetch(`/api/categories/${id}`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(body),
      });
      const parseResponse = await response.json();
      toast.success(parseResponse.message, { theme: "colored" });
      setNewCategory({
        categoryName: "",
        categoryMinAge: "",
        categoryMaxAge: "",
        categoryGender: "",
      });
    } catch (error) {
      toast.error(error.message, { theme: "colored" });
    } finally {
      setCategoryChange(false);
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);
      const response = await fetch(`/api/categories/${event.event_id}`, {
        method: "GET",
        headers: myHeaders,
      });
      const parseResponse = await response.json();
      setCategories(parseResponse);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCategoryChange = (e, categoryId) => {
    const updatedCategories = categories.map((category) => {
      if (category.category_id === categoryId) {
        return { ...category, [e.target.name]: e.target.value };
      }
      return category;
    });
    setCategories(updatedCategories);
  };

  const handleNewCategoryChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleDeleteCategory = async (e, id) => {
    e.preventDefault();
    setEventChange(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: myHeaders,
      });
      const parseResponse = await response.json();
      setCategories(categories.filter((category) => category.category_id !== id));
      toast.success(parseResponse.message, { theme: "colored" });
      setEventChange(false);
    } catch (err) {
      toast.error(err.message, { theme: "colored" });
      console.log(err);
    }
  };

  useEffect(() => {
    if (event.event_id) {
      fetchCategories();
    } //eslint-disable-next-line
  }, [categoryChange, formInputs]);

  useEffect(() => {
    async function submitForm() {
      if (isImageSubmitted) {
        try {
          setEventChange(true);
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append("token", localStorage.token);

          const body = { name, price, location, date, attendees, description, rules, details, link, categories, imageLink };
          const response = await fetch(`/api/events/update/${event.event_id}`, {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify(body),
          });
          const parseResponse = await response.json();
          toast.success(parseResponse.message, { theme: "colored" });
          setEventChange(false);
        } catch (err) {
          console.log(err);
        }
      }
    }
    submitForm(); // eslint-disable-next-line
  }, [isImageSubmitted]);

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
                <input type="text" id="name" name="name" className="form-control" value={name} onChange={(e) => handleChange(e, "text")} />
                <label htmlFor="location">Local do Evento</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="form-control"
                  value={location}
                  onChange={(e) => handleChange(e, "text")}
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
                    onChange={(e) => handleChange(e, "text")}
                    placeholder="evento"
                    maxLength={20}
                  />
                </div>
                <label htmlFor="selectedImage">Imagem do Evento</label>
                <img src={imagePreview ? imagePreview : imageLink} alt="" className="img-fluid my-2" />
                <input
                  className="form-control"
                  type="file"
                  accept="image/*"
                  name="selectedImage"
                  id="selectedImage"
                  onChange={(e) => handleFileChange(e)}
                />
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
                    onChange={(e) => handleChange(e, "text")}
                    placeholder="100"
                  />
                  <span className="input-group-text">,00</span>
                </div>
                <label htmlFor="date">Data</label>
                <input type="date" id="date" name="date" className="form-control" value={date} onChange={(e) => handleChange(e, "text")} />
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
                    onChange={(e) => handleChange(e, "text")}
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
                  onChange={(e) => handleChange(e, "description")}
                />
                <label htmlFor="rules" className="form-label">
                  Regulamento
                </label>
                <ReactQuill theme="snow" id="rules" name="rules" value={rules} onChange={(e) => handleChange(e, "rules")} />
                <label htmlFor="details" className="form-label">
                  Detalhes
                </label>
                <ReactQuill theme="snow" id="details" name="details" value={details} onChange={(e) => handleChange(e, "details")} />
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
                            onChange={(e) => handleNewCategoryChange(e)}
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
                            onChange={(e) => handleNewCategoryChange(e)}
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
                            onChange={(e) => handleNewCategoryChange(e)}
                          />
                        </div>
                        <div className="col-3">
                          <label htmlFor="name">Sexo</label>
                          <select
                            className="form-select"
                            id="categoryGender"
                            name="categoryGender"
                            value={categoryGender}
                            onChange={(e) => handleNewCategoryChange(e)}
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
                          <button className="btn btn-success form-control" onClick={(e) => createCategory(e, event.event_id)}>
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
                                        onChange={(e) => handleCategoryChange(e, category.category_id)}
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <input
                                      id={`${category.category_id}-minage`}
                                      name="category_minage"
                                      value={category.category_minage}
                                      className="form-control"
                                      onChange={(e) => handleCategoryChange(e, category.category_id)}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      id={`${category.category_id}-maxage`}
                                      name="category_maxage"
                                      value={category.category_maxage}
                                      className="form-control"
                                      onChange={(e) => handleCategoryChange(e, category.category_id)}
                                    />
                                  </td>
                                  <td>
                                    <select
                                      className={`form-select`}
                                      aria-label="Default select example"
                                      id={`${category.category_id}-gender`}
                                      name="category_gender"
                                      value={category.category_gender}
                                      onChange={(e) => handleCategoryChange(e, category.category_id)}
                                    >
                                      <option value="masc">Masc.</option>
                                      <option value="fem">Fem.</option>
                                      <option value="unisex">Unissex</option>
                                    </select>
                                  </td>
                                  <td className="text-center">
                                    <button className="btn btn-danger" onClick={(e) => handleDeleteCategory(e, category.category_id)}>
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
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={(e) => handleDelete(e, event.event_id)}>
                  Remover Evento
                </button>
              </div>
              <div>
                <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal" onClick={() => handleFileCancel()}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={(e) => handleSubmit(e, event.event_id)}>
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
