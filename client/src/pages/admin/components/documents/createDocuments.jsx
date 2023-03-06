import React, { Fragment, useState, useRef } from "react";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import LoadingScreen from "../../../../utils/loadingScreen";
import { imageToBase64 } from "../../functions/imageToBase64";

const CreateDocuments = ({ documentChange, setDocumentChange }) => {
  const {
    register,
    handleSubmit,
    getValues,
    unregister,
    watch,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const [fileSize, setFileSize] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInput = useRef(null);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setDocumentChange(true);
      if (getValues("fileSize") > 5000) {
        return toast.error("Imagem excede o tamanho máximo de 5000KB (5MB).", { theme: "colored" });
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const body = data;

      const response = await fetch(`/api/documents/`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(body),
      });

      const parseResponse = await response.json();
      toast[parseResponse.type](parseResponse.message, { theme: "colored" });
    } catch (error) {
      toast.error(`Erro ao enviar arquivo. ${error.message}`);
    } finally {
      reset();
      setIsLoading(false);
      setDocumentChange(false);
    }
  };

  const handleFileChange = (event) => {
    setIsLoading(true);
    const file = event.target.files[0];
    if (file) {
      imageToBase64(file).then((data) => {
        register("file", { value: data.image, required: true });
        register("fileSize", { value: data.size });
        setFileSize(data.size);
      });
    } else {
      unregister("file");
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Fragment>
      <form className="collapse" id="collapseNewDocument" onSubmit={handleSubmit(onSubmit)}>
        <div className="row mb-3">
          <div className="col-12 col-lg-6">
            <label htmlFor="document-title">Nome do Documento</label>
            <input
              id="title"
              className={`form-control ${errors.title?.type ? "is-invalid" : getValues("title") ? "is-valid" : ""} `}
              {...register("title", { required: true, pattern: /.{2,}/ })}
              aria-invalid={errors.title ? "true" : "false"}
            />
          </div>
          <div className="col-12 col-lg-6">
            <label htmlFor="file">Arquivo</label>
            <input
              id="file"
              accept=".pdf"
              type="file"
              name="file"
              className={`form-control`}
              onChange={handleFileChange}
              aria-invalid={errors.file ? "true" : "false"}
              ref={fileInput}
            />
            <span className="text-muted">
              <small>Formato PDF. Tamanho: {fileSize || 0}/5000kb</small>
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-lg-6">
            <label htmlFor="description">Descrição do Documento</label>
            <input
              id="description"
              className={`form-control ${errors.description?.type ? "is-invalid" : getValues("description") ? "is-valid" : ""} `}
              {...register("description", { required: false })}
              aria-invalid={errors.description ? "true" : "false"}
            />
          </div>
          <div className="col-12 col-lg-6">
            <div className="row">
              <div className="col-12 col-lg-6">
                <label htmlFor="year">Ano do Documento</label>
                <input
                  id="year"
                  type="number"
                  pattern="\d*"
                  className={`form-control ${errors.year?.type ? "is-invalid" : getValues("year") ? "is-valid" : ""} `}
                  {...register("year", { required: true, max: 2099, min: 2009 })}
                  aria-invalid={errors.year ? "true" : "false"}
                />
              </div>
              <div className="col-12 col-lg-6">
                <label htmlFor="general">Documento Geral?</label>
                <div className="form-check form-switch">
                  <input
                    id="general"
                    type={"checkbox"}
                    className={`form-check-input ${errors.general?.type ? "is-invalid" : getValues("general") ? "is-valid" : ""} `}
                    {...register("general")}
                    aria-invalid={errors.general ? "true" : "false"}
                  />
                  <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                    Default switch checkbox input
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <input type="submit" className="btn btn-success my-2 px-5 btn-lg" disabled={!watch("file")} />
      </form>
    </Fragment>
  );
};

export default CreateDocuments;
