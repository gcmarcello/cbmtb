// Modules
import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";

import tinyConfig from "../../config/tiny.config";
import uploadImage from "../../functions/uploadImage";
// Functions

const NewEvent = () => {
  const navigate = useNavigate();
  const {
    getValues,
    setValue,
    watch,
    control,
    trigger,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "category", // unique name for your Field Array
    rules: {
      required: "Please append at least 1 item",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      const formValues = getValues();

      Object.keys(formValues).forEach((key) => {
        if (key !== "category") {
          formData.append(key, formValues[key]);
        } else {
          formData.append("categories", JSON.stringify(data.category));
        }
      });

      const myHeaders = new Headers();
      myHeaders.append("token", localStorage.token);

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formData,
      };

      const response = await fetch("/api/events/", requestOptions); // eslint-disable-next-line
      const parseResponse = await response.json();
      navigate("/painel/eventos");
      toast[parseResponse.type](parseResponse.message, { theme: "colored" });
    } catch (error) {
      toast.error(error, { theme: "colored" });
    }
  };

  useEffect(() => {
    append({}, { shouldFocus: false });
  }, []);

  const [externalRegistration, setExternalRegistration] = useState(false);
  const [fileSize, setFileSize] = useState(false);

  const onCheckboxToggle = (event) => {
    if (event.target.checked) {
      setExternalRegistration(true);
    } else {
      setExternalRegistration(false);
      setValue("external", "");
      trigger("external");
    }
  };

  return (
    <Fragment>
      <div className="bg-light">
        <div className="px-lg-5 py-lg-5">
          <div className="p-3 bg-white rounded rounded-2 shadow">
            <div className="container-fluid px-3 mt-3 mb-5">
              <div className="d-flex justify-content-between">
                <h2 className="mb-0">Criar Evento</h2>
                <a href="/painel/eventos/" className="btn btn-secondary">
                  Voltar
                </a>
              </div>

              <hr />
              <form onSubmit={handleSubmit(onSubmit)} className="needs-validation" noValidate>
                <div className="row my-3">
                  <div className="col-12 col-lg-6">
                    <label htmlFor="name">Nome do Evento</label>
                    <input
                      id="name"
                      className={`form-control ${errors.name?.type ? "is-invalid" : getValues("name") ? "is-valid" : ""}`}
                      {...register("name", {
                        required: true,
                        pattern: /.{2,}/,
                      })}
                      aria-invalid={errors.name ? "true" : "false"}
                    />
                  </div>
                  <div className="col-12 col-lg-6">
                    <label htmlFor="location">Local do Evento</label>
                    <input
                      id="location"
                      className={`form-control ${errors.location?.type ? "is-invalid" : getValues("location") ? "is-valid" : ""}`}
                      {...register("location", {
                        required: true,
                        pattern: /.{2,}/,
                      })}
                      aria-invalid={errors.location ? "true" : "false"}
                    />
                  </div>
                </div>

                <div className="row my-3">
                  <div className="col-12 col-lg-6">
                    <label htmlFor="price">Link do evento</label>
                    <div className="input-group">
                      <span className="input-group-text" id="basic-addon1">
                        {window.location.origin}/eventos/
                      </span>
                      <input
                        id="link"
                        className={`form-control ${errors.link?.type ? "is-invalid" : getValues("link") ? "is-valid" : ""}`}
                        {...register("link", {
                          required: true,
                          pattern: /^[a-z0-9]{2,20}$/,
                        })}
                        aria-invalid={errors.link ? "true" : "false"}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-lg-6 ">
                    <label htmlFor="price">Inscrição Externa</label>
                    <div className="input-group">
                      <span className="input-group-text" id="basic-addon1">
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" onChange={(e) => onCheckboxToggle(e)} />
                          <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                            Habilitar
                          </label>
                        </div>
                      </span>
                      <input
                        id="external"
                        name="external"
                        className={`form-control ${
                          externalRegistration ? (errors.external?.type ? "is-invalid" : getValues("external") ? "is-valid" : "") : ""
                        }`}
                        {...register("external", {
                          required: externalRegistration,
                          pattern: /^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]+(\/[^\s]*)?$/,
                        })}
                        aria-invalid={errors.external ? "true" : "false"}
                        disabled={!externalRegistration}
                      />
                    </div>
                  </div>
                </div>

                <div className="row my-3">
                  <div className="col-12 col-lg-6">
                    <label htmlFor="location">Imagem Principal do Evento</label>
                    <div className="input-group">
                      <Controller
                        name="image"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <input
                            id="image"
                            accept="image/*"
                            type="file"
                            onChange={(e) => {
                              field.onChange(e.target.files[0]);
                              setFileSize(e.target.files[0]?.size);
                            }}
                            className={`form-control ${errors.image?.type ? "is-invalid" : getValues("image") ? "is-valid" : ""}`}
                            aria-invalid={errors.image ? "true" : "false"}
                          />
                        )}
                      />

                      <button type="button" className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#eventImageModal">
                        <i className="bi bi-zoom-in"></i>
                      </button>
                    </div>
                    <div className="d-flex justify-content-between">
                      <small id="userHelp" className="form-text text-muted">
                        O tamanho indicado é de 800x475.
                      </small>
                      <small id="userHelp" className="form-text text-muted">
                        Formato JPEG, PNG, GIF, WEBP. Tamanho: {fileSize / 1000 || 0}/5000kb
                      </small>
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <label htmlFor="price">Máximo de Participantes</label>
                    <div className="input-group">
                      <span className="input-group-text" id="basic-addon1">
                        <i className="bi bi-people-fill"></i>
                      </span>
                      <input
                        id="attendees"
                        name="attendees"
                        type="number"
                        className={`form-control ${errors.attendees?.type ? "is-invalid" : getValues("attendees") ? "is-valid" : ""}`}
                        {...register("attendees", { required: true, min: 2 })}
                        aria-invalid={errors.attendees ? "true" : "false"}
                        placeholder="(ex. 1000)"
                      />
                    </div>
                  </div>
                </div>

                <div className="row my-3">
                  <div className="col-12 col-lg-6 my-1">
                    <label htmlFor="date">Início do Evento</label>
                    <input
                      type="datetime-local"
                      id="dateStart"
                      name="dateStart"
                      className={`form-control ${errors.dateStart?.type ? "is-invalid" : watch("dateStart") ? "is-valid" : ""}`}
                      {...register("dateStart", { required: true })}
                    />
                  </div>
                  <div className="col-12 col-lg-6 my-1">
                    <label htmlFor="date">Término do Evento</label>
                    <input
                      type="datetime-local"
                      id="dateEnd"
                      name="dateEnd"
                      className={`form-control ${errors.dateEnd?.type ? "is-invalid" : watch("dateEnd") ? "is-valid" : ""}`}
                      {...register("dateEnd", { required: true })}
                    />
                  </div>
                </div>
                <div className="row my-3">
                  <div className="col-12 col-lg-6 my-1">
                    <label htmlFor="date">Início das Inscrições</label>
                    <input
                      type="datetime-local"
                      id="registrationStart"
                      name="registrationStart"
                      className={`form-control ${errors.registrationStart?.type ? "is-invalid" : watch("registrationStart") ? "is-valid" : ""}`}
                      {...register("registrationStart", { required: true })}
                    />
                  </div>
                  <div className="col-12 col-lg-6 my-1">
                    <label htmlFor="date">Término das Inscrições</label>
                    <input
                      type="datetime-local"
                      id="registrationEnd"
                      name="registrationEnd"
                      className={`form-control ${errors.registrationEnd?.type ? "is-invalid" : watch("registrationEnd") ? "is-valid" : ""}`}
                      {...register("registrationEnd", { required: true })}
                    />
                  </div>
                </div>

                <div className="row my-3 mb-5">
                  <div className="col-12">
                    <label htmlFor="description" className="form-label">
                      Descrição
                    </label>
                    <Controller
                      name="description"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: false,
                      }}
                      render={({ field: { onChange, value, ref } }) => (
                        <Editor
                          value={value}
                          ref={ref}
                          apiKey={'c7la9x1bfdh9hbz7m2td5jsqdjhl7alzdzg65kj6crmro9hd'}
                          onEditorChange={(content) => onChange(content)}
                          init={{
                            language: "pt_BR",
                            language_url: "/langs/pt_BR.js",
                            height: 500,
                            menubar: true,
                            images_upload_handler: async (blobInfo) => {
                              const url = await uploadImage(blobInfo.blob());
                              if (typeof url !== "string") {
                                throw new Error("Arquivo muito grande.");
                              }
                              return url;
                            },
                            plugins: tinyConfig.plugins,
                            toolbar: tinyConfig.toolbar,
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="rules" className="form-label mt-4">
                      Regulamento
                    </label>
                    <Controller
                      name="rules"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: false,
                      }}
                      render={({ field: { onChange, value, ref } }) => (
                        <Editor
                          value={value}
                          ref={ref}
                          apiKey={'c7la9x1bfdh9hbz7m2td5jsqdjhl7alzdzg65kj6crmro9hd'}
                          onEditorChange={(content) => onChange(content)}
                          init={{
                            language: "pt_BR",
                            language_url: "/langs/pt_BR.js",
                            height: 500,
                            menubar: true,
                            images_upload_handler: async (blobInfo) => {
                              const url = await uploadImage(blobInfo.blob());
                              if (typeof url !== "string") {
                                throw new Error("Arquivo muito grande.");
                              }
                              return url;
                            },
                            plugins: tinyConfig.plugins,
                            toolbar: tinyConfig.toolbar,
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="details" className="form-label mt-4">
                      Detalhes
                    </label>
                    <Controller
                      name="details"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: false,
                      }}
                      render={({ field: { onChange, value, ref } }) => (
                        <Editor
                          value={value}
                          ref={ref}
                          apiKey={'c7la9x1bfdh9hbz7m2td5jsqdjhl7alzdzg65kj6crmro9hd'}
                          onEditorChange={(content) => onChange(content)}
                          init={{
                            language: "pt_BR",
                            language_url: "/langs/pt_BR.js",
                            height: 500,
                            menubar: true,
                            images_upload_handler: async (blobInfo) => {
                              const url = await uploadImage(blobInfo.blob());
                              if (typeof url !== "string") {
                                throw new Error("Arquivo muito grande.");
                              }
                              return url;
                            },
                            plugins: tinyConfig.plugins,
                            toolbar: tinyConfig.toolbar,
                          }}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between">
                  <h2 className="mt-3">Categorias</h2>
                  <button
                    className="btn btn-success h-25"
                    onClick={(e) => {
                      e.preventDefault();
                      append({});
                    }}
                  >
                    Adicionar
                  </button>
                </div>
                <hr />
                {fields.map((field, index) => (
                  <div className="row" key={`category-${index}`}>
                    <div className="col-12 col-lg-3">
                      <label htmlFor="categoryName" className="form-label">
                        Nome da Categoria
                      </label>
                      <input
                        type="text"
                        name="categoryName"
                        id="categoryName"
                        className={`form-control ${
                          errors.category && errors.category[index]?.name ? "is-invalid" : getValues(`category.${index}.name`) ? "is-valid" : ""
                        }`}
                        onChange={(e) => console.log(e)}
                        {...register(`category.${index}.name`, {
                          required: true,
                        })}
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
                        className={`form-control ${
                          errors.category && errors.category[index]?.minAge ? "is-invalid" : getValues(`category.${index}.name`) ? "is-valid" : ""
                        }`}
                        {...register(`category.${index}.minAge`, {
                          required: true,
                        })}
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
                        className={`form-control ${
                          errors.category && errors.category[index]?.maxAge ? "is-invalid" : getValues(`category.${index}.name`) ? "is-valid" : ""
                        }`}
                        {...register(`category.${index}.maxAge`, {
                          required: true,
                        })}
                      />
                    </div>
                    <div className="col-12 col-lg-2 mt-2 mt-lg-0">
                      <label htmlFor="categoryGender" className="form-label">
                        Sexo
                      </label>
                      <select
                        defaultValue=""
                        className={`form-select ${
                          errors.category && errors.category[index]?.gender ? "is-invalid" : getValues(`category.${index}.gender`) ? "is-valid" : ""
                        }`}
                        aria-label="Default select example"
                        id="categoryGender"
                        name="categoryGender"
                        {...register(`category.${index}.gender`, {
                          required: true,
                        })}
                      >
                        <option value="" disabled>
                          Selecione
                        </option>
                        <option value="unisex">Unissex</option>
                        <option value="masc">Masc.</option>
                        <option value="fem">Fem.</option>
                      </select>
                    </div>
                    <div className="col-6 col-lg-2 mt-2 mt-lg-0">
                      <label htmlFor="categoryPrice" className="form-label">
                        Preço
                      </label>
                      <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">
                          R$
                        </span>
                        <input
                          type="number"
                          name="categoryPrice"
                          id="categoryPrice"
                          className={`form-control ${
                            errors.category && errors.category[index]?.price ? "is-invalid" : getValues(`category.${index}.name`) ? "is-valid" : ""
                          }`}
                          {...register(`category.${index}.price`, {
                            required: true,
                          })}
                        />
                      </div>
                    </div>
                    <div className="col-6 col-lg-1 mt-2 mt-lg-0 d-flex justify-content-center align-items-end">
                      <button
                        style={{ maxHeight: "42px", maxWidth: "60px" }}
                        className="btn btn-danger form-control"
                        onClick={(e) => {
                          e.preventDefault();
                          if (!index) {
                            return;
                          }
                          remove(index);
                        }}
                        disabled={!index}
                      >
                        <i className="bi bi-x-circle"></i>
                      </button>
                    </div>
                    <hr className="my-3" />
                  </div>
                ))}

                <div className="d-flex justify-content-end">
                  <input type="submit" className="btn btn-success my-2 px-5 btn-lg" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default NewEvent;
