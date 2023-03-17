import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";

import { useForm } from "react-hook-form";

import EditEvent from "./components/editEvent";
import LoadingScreen from "../../../../utils/loadingScreen";
import { isoTimezone } from "./functions/isoDateTimezone";
import { useEffect } from "react";
import EditCategories from "./components/editCategories";
import ListRegistrations from "./listRegistrations";

const EditEventPanel = () => {
  const { id } = useParams();
  const [event, setEvent] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const {
    getValues,
    setValue,
    reset,
    trigger,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {},
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  useEffect(() => {
    const getEvent = async () => {
      setIsLoading(true);
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("token", localStorage.token);

        const response = await fetch(`/api/events/update/${id}`, {
          method: "GET",
          headers: myHeaders,
        });
        const parseResponse = await response.json();
        setEvent(parseResponse);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    getEvent();
  }, [id]);

  useEffect(() => {
    if (event) {
      const parsedInfo = {
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
      };
      reset(parsedInfo);
    }
  }, [event, reset]);

  if (isLoading) return <LoadingScreen />;

  return (
    <Fragment>
      <div className="bg-light">
        <div className="px-lg-5 py-lg-5">
          <div className="p-3 bg-white rounded rounded-2 shadow">
            <div className="d-flex flex-column flex-lg-row justify-content-between">
              <h2 className="text-center">{event.event_name}</h2>
              <div className="d-flex flex-lg-row flex-column">
                <a role="button" href="/dashboard/eventos" className="btn btn-secondary my-1 w-100">
                  Voltar
                </a>
                <button className="btn btn-success my-1 w-100" onClick={handleSubmit(onSubmit)}>
                  Salvar
                </button>
              </div>
            </div>

            <hr />
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#home"
                  type="button"
                  role="tab"
                  aria-controls="home"
                  aria-selected="true"
                >
                  Evento
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#profile"
                  type="button"
                  role="tab"
                  aria-controls="profile"
                  aria-selected="false"
                >
                  Categorias
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="contact-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#contact"
                  type="button"
                  role="tab"
                  aria-controls="contact"
                  aria-selected="false"
                >
                  Inscritos
                </button>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                <EditEvent
                  event={event}
                  getValues={getValues}
                  setValue={setValue}
                  reset={reset}
                  trigger={trigger}
                  control={control}
                  register={register}
                  handleSubmit={handleSubmit}
                  errors={errors}
                />
              </div>
              <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                <EditCategories
                  event={event}
                  getValues={getValues}
                  setValue={setValue}
                  reset={reset}
                  trigger={trigger}
                  control={control}
                  register={register}
                  handleSubmit={handleSubmit}
                  errors={errors}
                />
              </div>
              <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                <ListRegistrations
                  event={event}
                  getValues={getValues}
                  setValue={setValue}
                  reset={reset}
                  trigger={trigger}
                  control={control}
                  register={register}
                  handleSubmit={handleSubmit}
                  errors={errors}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditEventPanel;
