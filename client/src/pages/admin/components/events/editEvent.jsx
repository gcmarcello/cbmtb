import React, { Fragment, useState } from "react";
import QuillEditor from "../../../../utils/quillSettings";

import { toast } from "react-toastify";
import { useForm, Controller, useFieldArray } from "react-hook-form";

import LoadingScreen from "../../../../utils/loadingScreen";
import { isoTimezone } from "./functions/isoDateTimezone";

const EditEvent = ({ eventChange, setEventChange, event }) => {
  const {
    getValues,
    setValue,
    trigger,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: event.event_name,
      location: event.event_location,
      link: event.event_link,
      attendees: event.event_max_attendees,
      imageOld: event.event_image,
      dateStart: isoTimezone(event.event_date_start),
      dateEnd: isoTimezone(event.event_date_end),
      registrationStart: isoTimezone(event.event_registrations_start),
      registrationEnd: isoTimezone(event.event_registrations_end),
      description: event.event_description,
      rules: event.event_rules,
      details: event.event_details,
    },
  });
  const [externalRegistration, setExternalRegistration] = useState(false);
  const [fileSize, setFileSize] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);

  const onCheckboxToggle = (event) => {
    if (event.target.checked) {
      setExternalRegistration(true);
    } else {
      setExternalRegistration(false);
      setValue("external", "");
      trigger("external");
    }
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Fragment>
      <button className="btn btn-dark ms-1" data-bs-toggle="modal" data-bs-target={`#modal-event-${event.event_id}`}>
        <i className="bi bi-gear"></i>
      </button>
      <div
        className="modal modal-xl fade"
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
            <form onSubmit={handleSubmit(onSubmit)} className="needs-validation" noValidate>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-12 col-lg-6">
                    <label htmlFor="name">Nome do Evento</label>
                    <input
                      id="name"
                      className={`form-control ${errors.name?.type ? "is-invalid" : ""}`}
                      {...register("name", { required: true, pattern: /.{2,}/ })}
                      aria-invalid={errors.name ? "true" : "false"}
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
                        className={`form-control ${errors.attendees?.type ? "is-invalid" : ""}`}
                        {...register("attendees", { required: true, min: 2 })}
                        aria-invalid={errors.attendees ? "true" : "false"}
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
                      className={`form-control ${errors.location?.type ? "is-invalid" : ""}`}
                      {...register("location", { required: true, pattern: /.{2,}/ })}
                      aria-invalid={errors.location ? "true" : "false"}
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
                        className={`form-control ${errors.link?.type ? "is-invalid" : ""}`}
                        {...register("link", { required: true, pattern: /^[a-z0-9]{2,20}$/ })}
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
                        className={`form-control ${externalRegistration ? (errors.external?.type ? "is-invalid" : "") : ""}`}
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

                <div className="row">
                  <div className="col-12 my-3">
                    <label htmlFor="location">Imagem Principal do Evento</label>
                    <br />
                    <img src={fileUrl || getValues("imageOld")} className="img-fluid rounded mx-auto d-block my-2" alt="" />
                    <div className="input-group">
                      <Controller
                        name="image"
                        control={control}
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
                            className={`form-control ${errors.image?.type ? "is-invalid" : ""}`}
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
                </div>
                <div className="row my-3">
                  <div className="col-12 col-lg-6 my-1">
                    <label htmlFor="date">Início do Evento</label>
                    <input
                      type="datetime-local"
                      id="dateStart"
                      name="dateStart"
                      className={`form-control ${errors.dateStart?.type ? "is-invalid" : ""}`}
                      {...register("dateStart", { required: true })}
                    />
                  </div>
                  <div className="col-12 col-lg-6 my-1">
                    <label htmlFor="date">Término do Evento</label>
                    <input
                      type="datetime-local"
                      id="dateEnd"
                      name="dateEnd"
                      className={`form-control ${errors.dateEnd?.type ? "is-invalid" : ""}`}
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
                      className={`form-control ${errors.registrationStart?.type ? "is-invalid" : ""}`}
                      {...register("registrationStart", { required: true })}
                    />
                  </div>
                  <div className="col-12 col-lg-6 my-1">
                    <label htmlFor="date">Término das Inscrições</label>
                    <input
                      type="datetime-local"
                      id="registrationEnd"
                      name="registrationEnd"
                      className={`form-control ${errors.registrationEnd?.type ? "is-invalid" : ""}`}
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
                      rules={{
                        required: false,
                      }}
                      render={({ field: { onChange, value } }) => (
                        <QuillEditor
                          id="description"
                          name="description"
                          defaultValue={value}
                          onChange={onChange}
                          className={`${errors.description?.type ? "is-invalid" : ""}`}
                          aria-invalid={errors.description ? "true" : "false"}
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
                      control={control}
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
                          className={`${errors.rules?.type ? "is-invalid" : ""}`}
                          aria-invalid={errors.rules ? "true" : "false"}
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
                      control={control}
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
                          className={`${errors.details?.type ? "is-invalid" : ""}`}
                          aria-invalid={errors.details ? "true" : "false"}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer justify-content-between">
                <div>
                  <button type="button" className="btn btn-danger" data-bs-dismiss="modal">
                    Remover Evento
                  </button>
                </div>
                <div>
                  <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">
                    Cancelar
                  </button>
                  <input type="submit" className="btn btn-success" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditEvent;
