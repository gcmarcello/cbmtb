import React, { Fragment, useState } from "react";
import QuillEditor from "../../../../../utils/quillSettings";

import { Controller } from "react-hook-form";

const EditEvent = (props) => {
  const [externalRegistration, setExternalRegistration] = useState(false);
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
        <form onSubmit={props.handleSubmit(props.onSubmit)} className="needs-validation" noValidate>
          <div className="row mb-3">
            <div className="col-12 col-lg-6">
              <label htmlFor="name">Nome do Evento</label>
              <input
                id="name"
                className={`form-control ${props.errors.name?.type ? "is-invalid" : ""}`}
                {...props.register("name", { required: true, pattern: /.{2,}/ })}
                aria-invalid={props.errors.name ? "true" : "false"}
              />
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
                  className={`form-control ${props.errors.attendees?.type ? "is-invalid" : ""}`}
                  {...props.register("attendees", { required: true, min: 2 })}
                  aria-invalid={props.errors.attendees ? "true" : "false"}
                  placeholder="(ex. 1000)"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <label htmlFor="location">Local do Evento</label>
              <input
                id="location"
                className={`form-control ${props.errors.location?.type ? "is-invalid" : ""}`}
                {...props.register("location", { required: true, pattern: /.{2,}/ })}
                aria-invalid={props.errors.location ? "true" : "false"}
              />
            </div>
          </div>

          <div className="row my-3">
            <div className="col-12 col-lg-6">
              <label htmlFor="price">Link do evento</label>
              <div className="input-group">
                <span className="input-group-text" id="basic-addon1">
                  cbmtb.com/eventos/
                </span>
                <input
                  id="link"
                  className={`form-control ${props.errors.link?.type ? "is-invalid" : ""}`}
                  {...props.register("link", { required: true, pattern: /^[a-z0-9]{2,20}$/ })}
                  aria-invalid={props.errors.link ? "true" : "false"}
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
                  className={`form-control ${props.externalRegistration ? (props.errors.external?.type ? "is-invalid" : "") : ""}`}
                  {...props.register("external", {
                    required: props.externalRegistration,
                    pattern: /^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]+(\/[^\s]*)?$/,
                  })}
                  aria-invalid={props.errors.external ? "true" : "false"}
                  disabled={!externalRegistration}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 my-3">
              <label htmlFor="location">Imagem Principal do Evento</label>
              <br />

              <div className="input-group">
                <Controller
                  name="image"
                  control={props.control}
                  defaultValue=""
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
                      className={`form-control ${props.errors.image?.type ? "is-invalid" : ""}`}
                      aria-invalid={props.errors.image ? "true" : "false"}
                    />
                  )}
                />

                <button type="button" className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#eventImageModal">
                  <i className="bi bi-zoom-in"></i>
                </button>
              </div>
              <div className="modal fade" id="eventImageModal" tabIndex="-1" aria-labelledby="eventImageModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="eventImageModalLabel">
                        Modal title
                      </h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      <img src={fileUrl || props.getValues("imageOld")} className="img-fluid rounded mx-auto d-block my-2" alt="" />
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
                  O tamanho indicado é de 800x475.
                </small>
                <small id="userHelp" className="form-text text-muted">
                  Formato JPEG, PNG, GIF, WEBP. Tamanho: {fileSize / 1000 || 0}/5000kb
                </small>
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
                className={`form-control ${props.errors.dateStart?.type ? "is-invalid" : ""}`}
                {...props.register("dateStart", { required: true })}
              />
            </div>
            <div className="col-12 col-lg-6 my-1">
              <label htmlFor="date">Término do Evento</label>
              <input
                type="datetime-local"
                id="dateEnd"
                name="dateEnd"
                className={`form-control ${props.errors.dateEnd?.type ? "is-invalid" : ""}`}
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
                className={`form-control ${props.errors.registrationStart?.type ? "is-invalid" : ""}`}
                {...props.register("registrationStart", { required: true })}
              />
            </div>
            <div className="col-12 col-lg-6 my-1">
              <label htmlFor="date">Término das Inscrições</label>
              <input
                type="datetime-local"
                id="registrationEnd"
                name="registrationEnd"
                className={`form-control ${props.errors.registrationEnd?.type ? "is-invalid" : ""}`}
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
                rules={{
                  required: false,
                }}
                render={({ field: { onChange, value } }) => (
                  <QuillEditor
                    id="description"
                    name="description"
                    defaultValue={value}
                    onChange={onChange}
                    className={`${props.errors.description?.type ? "is-invalid" : ""}`}
                    aria-invalid={props.errors.description ? "true" : "false"}
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
                defaultValue=""
                rules={{
                  required: false,
                }}
                render={({ field: { onChange, value } }) => (
                  <QuillEditor
                    id="rules"
                    name="rules"
                    defaultValue={value}
                    onChange={onChange}
                    className={`${props.errors.rules?.type ? "is-invalid" : ""}`}
                    aria-invalid={props.errors.rules ? "true" : "false"}
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
                defaultValue=""
                rules={{
                  required: false,
                }}
                render={({ field: { onChange, value } }) => (
                  <QuillEditor
                    id="details"
                    name="details"
                    defaultValue={value}
                    onChange={onChange}
                    className={`${props.errors.details?.type ? "is-invalid" : ""}`}
                    aria-invalid={props.errors.details ? "true" : "false"}
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
