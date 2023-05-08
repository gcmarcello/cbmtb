import React, { Fragment, useState, useEffect } from "react";

import { useForm, Controller } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingScreen from "../../../../utils/loadingScreen";

import { Editor } from "@tinymce/tinymce-react";

import tinyConfig from "../../config/tiny.config";
import uploadImage from "../../functions/uploadImage";

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [fileSize, setFileSize] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
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
      setIsLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("token", localStorage.token);

      const formData = new FormData();
      const formValues = getValues();
      Object.keys(formValues).forEach((key) => {
        formData.append(key, formValues[key]);
      });

      const response = await fetch(`/api/news/${news.news_id}`, {
        method: "PUT",
        headers: myHeaders,
        body: formData,
      });
      const parseResponse = await response.json();
      if (parseResponse.type === "success") {
        toast.success(parseResponse.message, { theme: "colored" });
        navigate("/painel/noticias");
      } else {
        toast.error(parseResponse.message, { theme: "colored" });
      }
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  const deleteNews = async () => {
    try {
      setIsLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);
      const response = await fetch(`/api/news/${news.news_id}`, {
        method: "DELETE",
        headers: myHeaders,
      });
      const parseResponse = await response.json();
      if (parseResponse.type === "success") {
        toast.success(parseResponse.message, { theme: "colored" });
        navigate("/painel/noticias");
      } else {
        toast.error(parseResponse.message, { theme: "colored" });
      }
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const getNews = async () => {
      setIsLoading(true);
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("token", localStorage.token);

        const response = await fetch(`/api/news/${id}`, {
          method: "GET",
          headers: myHeaders,
        });
        const parseResponse = await response.json();
        setNews(parseResponse);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    getNews();
  }, [id]);

  useEffect(() => {
    if (news) {
      reset({
        title: news.news_title,
        subtitle: news.news_subtitle,
        imageOld: news.news_image_link,
        link: news.news_link,
        body: news.news_text,
      });
    }
  }, [news, reset]);

  if (isLoading) return <LoadingScreen />;

  return (
    <Fragment>
      <div className="bg-light">
        <div className="px-lg-5 py-lg-5">
          <div className="p-3 bg-white rounded rounded-2 shadow">
            <div className="container-fluid px-3 mt-3 mb-5">
              <h2 className="mb-0">Editar Notícia</h2>
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
                        defaultValue={null}
                        rules={{
                          required: false,
                        }}
                        render={({ field }) => (
                          <input
                            id="image"
                            accept="image/*"
                            type="file"
                            onChange={(e) => {
                              field.onChange(e.target.files[0]);
                              setFileUrl(URL.createObjectURL(e.target.files[0]));
                              setFileSize(e.target.files[0]?.size);
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
                    <div className="modal fade" id="newsImageModal" tabIndex="-1" aria-labelledby="newsImageModalLabel" aria-hidden="true">
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="newsImageModalLabel">
                              Imagem da Notícia
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div className="modal-body">
                            <img src={fileUrl || getValues("imageOld")} className="img-fluid rounded mx-auto d-block my-2" alt="" />
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                              Close
                            </button>
                            <button type="button" className="btn btn-primary">
                              Save changes
                            </button>
                          </div>
                        </div>
                      </div>
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
                    <label htmlFor="link" className="form-label">
                      Link da Notícia
                    </label>

                    <div className="input-group">
                      <span className="input-group-text" id="basic-addon1">
                        {window.location.origin}/eventos/
                      </span>
                      <input
                        type="text"
                        id="link"
                        name="link"
                        className={`form-control ${errors.link?.type ? "is-invalid" : ""}`}
                        {...register("link", { required: true, pattern: /^[a-z0-9-]{1,50}$/i })}
                      />
                    </div>
                    <small id="userHelp" className="form-text text-muted">
                      Use apenas letras minúsculas, números e hífens.
                    </small>
                  </div>
                </div>

                <label htmlFor="news-text" className="mt-3">
                  Corpo da Notícia
                </label>
                <Controller
                  name="body"
                  control={control}
                  defaultValue={news?.news_text}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value, ref } }) => (
                    <Editor
                      value={value}
                      ref={ref}
                      apiKey={process.env.REACT_APP_REACT_ENV === "production" ? process.env.REACT_APP_TINYMCE_KEY : ""}
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
                <div className="d-flex mt-3 justify-content-between">
                  <div>
                    <button
                      className="btn btn-danger"
                      onClick={(e) => {
                        e.preventDefault();
                        deleteNews();
                      }}
                    >
                      Remover Notícia
                    </button>
                  </div>
                  <div>
                    <button className="btn btn-success" onClick={handleSubmit(onSubmit)}>
                      Atualizar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditNews;
