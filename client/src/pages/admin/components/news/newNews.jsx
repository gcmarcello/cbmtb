import React, { Fragment } from "react";
import {useNavigate} from "react-router-dom"
import { toast } from "react-toastify";

import QuillEditor from "../../../../utils/quillSettings";
import { useForm, Controller } from "react-hook-form";

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

  const onSubmit = async (data) => {
    try {
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
      navigate('/painel/noticias')
      toast[parseResponse.type](parseResponse.message, { theme: "colored" });
    } catch (error) {
      console.log(error);
    }
  };

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
                render={({ field: { onChange } }) => (
                  <Fragment>
                    <QuillEditor id="body" name="body" onChange={onChange} aria-invalid={errors.body ? "true" : "false"} />
                    {errors.body?.type && (
                      <div class="alert alert-danger mt-2" role="alert">
                        A notícia não pode estar em branco!
                      </div>
                    )}
                  </Fragment>
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
