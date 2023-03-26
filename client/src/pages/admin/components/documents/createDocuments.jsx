import React, { Fragment, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";

import LoadingScreen from "../../../../utils/loadingScreen";

const CreateDocuments = () => {
  const {
    register,
    handleSubmit,
    getValues,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const [isLoading, setIsLoading] = useState(false);
  const fileInput = useRef(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      if (fileInput.current?.files[0].size / 1024 > 5000) {
        return toast.error("Imagem excede o tamanho máximo de 5000KB (5MB).", { theme: "colored" });
      }

      const myHeaders = new Headers();
      myHeaders.append("token", localStorage.token);

      const formData = new FormData();
      const formValues = getValues();

      Object.keys(formValues).forEach((key) => {
        formData.append(key, formValues[key]);
      });

      const response = await fetch(`/api/documents/`, {
        method: "POST",
        headers: myHeaders,
        body: formData,
      });

      const parseResponse = await response.json();
      navigate("/painel/documentos");
      toast[parseResponse.type](parseResponse.message, { theme: "colored" });
    } catch (error) {
      toast.error(`Erro ao enviar arquivo. ${error.message}`);
    } finally {
      reset();
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Fragment>
      <div className="bg-light">
        <div className="px-lg-5 py-lg-5">
          <div className="p-3 bg-white rounded rounded-2 shadow">
            <form onSubmit={handleSubmit(onSubmit)}>
              <h1>Novo Documento</h1>
              <hr />
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
                  <Controller
                    name="file"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <input
                        id="file"
                        accept=".pdf"
                        type="file"
                        onChange={(e) => {
                          field.onChange(e.target.files[0]);
                        }}
                        ref={fileInput}
                        className={`form-control ${errors.file?.type ? "is-invalid" : getValues("file") ? "is-valid" : ""}`}
                        aria-invalid={errors.file ? "true" : "false"}
                      />
                    )}
                  />
                  <span className="text-muted">
                    <small>Formato PDF. Tamanho: {Math.ceil(fileInput?.current?.files[0]?.size / 1024) || 0}/5000kb</small>
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
                      <label htmlFor="general"> </label>
                      <div className="form-check form-switch d-flex">
                        <input
                          id="general"
                          type={"checkbox"}
                          className={`form-check-input`}
                          style={{ height: "1.5rem", width: "calc(2rem + 0.75rem)", borderRadius: "3rem" }}
                          {...register("general")}
                          aria-invalid={errors.general ? "true" : "false"}
                        />
                        <label className="form-check-label align-middle my-1 ms-2" htmlFor="flexSwitchCheckDefault">
                          Documento Destaque?
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <input type="submit" className="btn btn-success my-2 " disabled={!watch("file")} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CreateDocuments;
