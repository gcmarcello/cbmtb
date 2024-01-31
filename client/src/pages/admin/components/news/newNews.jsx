import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useForm, Controller } from "react-hook-form";

import { Editor } from "@tinymce/tinymce-react";

import tinyConfig from "../../config/tiny.config";
import uploadImage from "../../functions/uploadImage";
import LoadingScreen from "../../../../utils/loadingScreen";
import { useState } from "react";
import { useEffect } from "react";

const NewNews = () => {
  const navigate = useNavigate();
  const {
    getValues,
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("token", localStorage.token);
      const response = await fetch(`/api/news/categories`, {
        method: "GET",
        headers: myHeaders,
      });
      const parseResponse = await response.json();
      setCategories(parseResponse);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("token", localStorage.token);

      const formData = new FormData();
      const formValues = getValues();

      Object.keys(formValues).forEach((key) => {
        formData.append(key, formValues[key]);
      });

      const response = await fetch(`/api/news/`, {
        method: "POST",
        headers: myHeaders,
        body: formData,
      });

      const parseResponse = await response.json();
      navigate("/painel/noticias");
      toast[parseResponse.type](parseResponse.message, { theme: "colored" });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="bg-light">
      <div className="px-lg-5 py-lg-5">
        <div className="p-3 bg-white rounded rounded-2 shadow">
          <div className="container-fluid px-3 mt-3 mb-5">
            <h2 className="mb-0">Nova Notícia</h2>
            <hr />
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-12 col-lg-6">
                  <label htmlFor="news-title" className="form-label">
                    Título da Notícia
                  </label>
                  <input
                    type="text"
                    id="news-title"
                    name="title"
                    className={`form-control ${errors.title?.type ? "is-invalid" : getValues("name") ? "is-valid" : ""}`}
                    {...register("title", { required: true, pattern: /.{2,}/ })}
                  />
                </div>
                <div className="col-12 col-lg-6">
                  <label htmlFor="selectedImage" className="form-label">
                    Imagem da Notícia
                  </label>
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
                          }}
                          className={`form-control ${errors.image?.type ? "is-invalid" : ""}`}
                          aria-invalid={errors.image ? "true" : "false"}
                        />
                      )}
                    />
                    <button type="button" className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#newsImageModal">
                      <i className="bi bi-zoom-in"></i>
                    </button>
                  </div>
                  <div className="d-flex justify-content-between">
                    <small id="userHelp" className="form-text text-muted">
                      A resolução indicada é de 1920x1080.
                    </small>
                    <small id="userHelp" className="form-text text-muted">
                      Tamanho: {/* Math.round(watch("image").size / 1000) ||  */ 0}/2000KB
                    </small>
                  </div>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-12 col-lg-6">
                  <label htmlFor="title" className="form-label">
                    Sub-Título da Notícia
                  </label>

                  <input
                    type="text"
                    id="subtitle"
                    name="subtitle"
                    className={`form-control ${errors.subtitle?.type ? "is-invalid" : ""}`}
                    {...register("subtitle", { required: true, pattern: /.{2,}/ })}
                  />
                </div>
                <div className="col-12 col-lg-6">
                  <label htmlFor="category" className="form-label">
                    Categoria
                  </label>
                  <select
                    id="category"
                    defaultValue=""
                    className={`form-select ${errors.gender?.type ? "is-invalid" : getValues("gender") ? "is-valid" : ""}`}
                    {...register("category", { required: true })}
                  >
                    <option value="" disabled>
                      Selecionar
                    </option>
                    {categories.map((category) => (
                      <option key={`category-${category.category_id}`} value={category.category_name}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label htmlFor="news-text" className="mt-3">
                Corpo da Notícia
              </label>
              <Controller
                name="body"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value, ref } }) => (
                  <Editor
                    value={value}
                    ref={ref}
                    apiKey={process.env.REACT_APP_REACT_ENV === "production" ? 'c7la9x1bfdh9hbz7m2td5jsqdjhl7alzdzg65kj6crmro9hd' : ""}
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
              <div className="d-flex mt-3 justify-content-end">
                <button
                  className="btn btn-secondary me-3"
                  onClick={() => {
                    reset();
                  }}
                >
                  Limpar Formulário
                </button>
                <button className="btn btn-success" onClick={(e) => {}}>
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewNews;
