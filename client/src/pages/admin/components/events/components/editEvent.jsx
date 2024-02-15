import React, { Fragment, useState } from "react";

import { Controller } from "react-hook-form";
import { useEffect } from "react";

import { Editor } from "@tinymce/tinymce-react";
import tinyConfig from "../../../config/tiny.config";
import uploadImage from "../../../functions/uploadImage";

const EditEvent = (props) => {
  const [externalRegistration, setExternalRegistration] = useState(
    props.event?.event_external
  );
  const [fileSize, setFileSize] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);

  const onCheckboxToggle = (event) => {
    if (event.target.checked) {
      setExternalRegistration(true);
    } else {
      setExternalRegistration(false);
      props.setValue("external", "");
      props.trigger("external");
    }
  };

  return (
    <Fragment>
      <div className="p-lg-3">
        <form
          onSubmit={props.handleSubmit(props.onSubmit)}
          className="needs-validation"
          noValidate
        >
          <div className="row mb-2">
            <div className="col-12">
              <label htmlFor="name">Nome do Evento</label>
              <input
                id="name"
                className={`form-control ${props.errors.name?.type ? "is-invalid" : ""}`}
                {...props.register("name", {
                  required: true,
                  pattern: /.{2,}/,
                })}
                aria-invalid={props.errors.name ? "true" : "false"}
              />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-12 col-lg-6">
              <label htmlFor="location">Local do Evento</label>
              <input
                id="location"
                className={`form-control ${
                  props.errors.location?.type ? "is-invalid" : ""
                }`}
                {...props.register("location", {
                  required: true,
                  pattern: /.{2,}/,
                })}
                aria-invalid={props.errors.location ? "true" : "false"}
              />
            </div>
            <div className="col-12 col-lg-6">
              <label htmlFor="flagship">Série do Evento</label>
              <select
                {...props.register("flagship")}
                defaultValue={props.watch("flagship")}
                className={`form-select ${
                  props.errors.flagship && props.errors.flagship ? "is-invalid" : ""
                }`}
              >
                <option value="">Nenhum</option>
                {props.flagships?.map((flagship) => (
                  <option
                    key={flagship.flagship_id}
                    value={flagship.flagship_id}
                    selected={flagship.flagship_id === props.watch("flagship")}
                  >
                    {flagship.flagship_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-12 col-lg-6">
              <label htmlFor="price">Link do evento</label>
              <div className="input-group">
                <span className="input-group-text" id="basic-addon1">
                  {window.location.origin}/eventos/
                </span>
                <input
                  id="link"
                  className={`form-control ${
                    props.errors.link?.type ? "is-invalid" : ""
                  }`}
                  {...props.register("link", {
                    required: true,
                    pattern: /^[a-z0-9]{2,20}$/,
                  })}
                  aria-invalid={props.errors.link ? "true" : "false"}
                />
              </div>
            </div>
            <div className="col-12 col-lg-6 ">
              <label htmlFor="price">Inscrição Externa</label>
              <div className="input-group">
                <span className="input-group-text" id="basic-addon1">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={externalRegistration}
                      onChange={(e) => onCheckboxToggle(e)}
                    />
                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                      Habilitar
                    </label>
                  </div>
                </span>
                <input
                  id="external"
                  name="external"
                  className={`form-control ${
                    props.externalRegistration
                      ? props.errors.external?.type
                        ? "is-invalid"
                        : ""
                      : ""
                  }`}
                  {...props.register("external", {
                    required: externalRegistration,
                    pattern:
                      /^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]+(\/[^\s]*)?$/,
                  })}
                  aria-invalid={props.errors.external ? "true" : "false"}
                  disabled={!externalRegistration}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-lg-6">
              <label htmlFor="location">Imagem Principal do Evento</label>
              <br />

              <div className="input-group">
                <Controller
                  name="image"
                  control={props.control}
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
                      className={`form-control ${
                        props.errors.image?.type ? "is-invalid" : ""
                      }`}
                      aria-invalid={props.errors.image ? "true" : "false"}
                    />
                  )}
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  data-bs-toggle="modal"
                  data-bs-target="#eventImageModal"
                >
                  <i className="bi bi-zoom-in"></i>
                </button>
              </div>
              <div
                className="modal fade"
                id="eventImageModal"
                tabIndex="-1"
                aria-labelledby="eventImageModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="eventImageModalLabel">
                        Imagem do Evento
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <img
                        src={fileUrl || props.getValues("imageOld")}
                        className="img-fluid rounded mx-auto d-block my-2"
                        alt=""
                      />
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Fechar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <small id="userHelp" className="form-text text-muted">
                  O tamanho indicado é de 800x475.
                </small>
                <small id="userHelp" className="form-text text-muted">
                  Formato JPEG, PNG, GIF, WEBP. Tamanho: {fileSize / 1000 || 0}
                  /5000kb
                </small>
              </div>
            </div>
            <div className="col-12 col-lg-6 d-flex align-items-center">
              <div className="form-check ms-3">
                <input
                  className="form-check-input"
                  style={{ transform: "scale(1.5)" }}
                  type="checkbox"
                  defaultChecked={props.event?.showattendees}
                  {...props.register("showAttendees")}
                  id="showAttendees"
                />
                <label className="form-check-label ms-2" htmlFor="showAttendees">
                  Exibir Lista de Inscritos
                </label>
              </div>
              <div className="form-check ms-3">
                <input
                  className="form-check-input"
                  style={{ transform: "scale(1.5)" }}
                  type="checkbox"
                  defaultChecked={props.event?.enableteamregistration}
                  {...props.register("enableTeamRegistration")}
                  id="enableTeamRegistration"
                />
                <label className="form-check-label ms-2" htmlFor="enableTeamRegistration">
                  Permitir Inscrição em Equipe
                </label>
              </div>
              <div className="form-check ms-3">
                <input
                  className="form-check-input"
                  style={{ transform: "scale(1.5)" }}
                  type="checkbox"
                  defaultChecked={props.event?.enableshirtsize}
                  {...props.register("enableShirtSize")}
                  id="enableShirtSize"
                />
                <label className="form-check-label ms-2" htmlFor="enableShirtSize">
                  Pedir Tamanho da Camisa
                </label>
              </div>
            </div>
          </div>
          <hr />
          <div className="row my-3">
            <div className="col-12 col-lg-6 my-1">
              <label htmlFor="date">Início do Evento</label>
              <input
                type="datetime-local"
                id="dateStart"
                name="dateStart"
                className={`form-control ${
                  props.errors.dateStart?.type ? "is-invalid" : ""
                }`}
                {...props.register("dateStart", { required: true })}
              />
            </div>
            <div className="col-12 col-lg-6 my-1">
              <label htmlFor="date">Término do Evento</label>
              <input
                type="datetime-local"
                id="dateEnd"
                name="dateEnd"
                className={`form-control ${
                  props.errors.dateEnd?.type ? "is-invalid" : ""
                }`}
                {...props.register("dateEnd", { required: true })}
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
                className={`form-control ${
                  props.errors.registrationStart?.type ? "is-invalid" : ""
                }`}
                {...props.register("registrationStart", { required: true })}
              />
            </div>
            <div className="col-12 col-lg-6 my-1">
              <label htmlFor="date">Término das Inscrições</label>
              <input
                type="datetime-local"
                id="registrationEnd"
                name="registrationEnd"
                className={`form-control ${
                  props.errors.registrationEnd?.type ? "is-invalid" : ""
                }`}
                {...props.register("registrationEnd", { required: true })}
              />
            </div>
          </div>
          <hr />
          <div className="row my-3 mb-2">
            <div className="col-12">
              <label htmlFor="description" className="form-label">
                Descrição
              </label>
              <Controller
                name="description"
                control={props.control}
                defaultValue={props.event?.event_description}
                rules={{
                  required: false,
                }}
                render={({ field: { onChange, value, ref } }) => (
                  <Editor
                    value={value}
                    ref={ref}
                    apiKey={"c7la9x1bfdh9hbz7m2td5jsqdjhl7alzdzg65kj6crmro9hd"}
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
              <label htmlFor="rules" className="form-label">
                Regulamento
              </label>
              <Controller
                name="rules"
                control={props.control}
                defaultValue={props.event?.event_rules}
                rules={{
                  required: false,
                }}
                render={({ field: { onChange, value, ref } }) => (
                  <Editor
                    value={value}
                    ref={ref}
                    apiKey={"c7la9x1bfdh9hbz7m2td5jsqdjhl7alzdzg65kj6crmro9hd"}
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
              <label htmlFor="details" className="form-label">
                Detalhes
              </label>

              <Controller
                name="details"
                control={props.control}
                defaultValue={props.event?.event_details}
                rules={{
                  required: false,
                }}
                render={({ field: { onChange, value, ref } }) => (
                  <Editor
                    value={value}
                    ref={ref}
                    apiKey={"c7la9x1bfdh9hbz7m2td5jsqdjhl7alzdzg65kj6crmro9hd"}
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
        </form>
      </div>
    </Fragment>
  );
};

export default EditEvent;
