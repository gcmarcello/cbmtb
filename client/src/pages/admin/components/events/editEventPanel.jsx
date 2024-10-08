import React, { Fragment, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";

import EditEvent from "./components/editEvent";
import EditKits from "./components/editKits";
import EditRegistering from "./components/editRegistering";
import LoadingScreen from "../../../../utils/loadingScreen";
import { isoTimezone } from "./functions/isoDateTimezone";
import { useEffect } from "react";
import EditCategories from "./components/editCategories";
import ListRegistrations from "./listRegistrations";

const EditEventPanel = () => {
  const { id, tab } = useParams();
  const [event, setEvent] = useState();
  const [flagships, setFlagships] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();


  const {
    getValues,
    setValue,
    reset,
    watch,
    trigger,
    setFocus,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {},
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      const formValues = getValues();
      Object.keys(formValues).forEach((key) => {
        if (key !== "category" && key !== "coupon") {
          formData.append(key, formValues[key]);
        }
        if (key === "category") {
          formData.append("categories", JSON.stringify(data.category));
        }
        if (key === "coupon") {
          formData.append("coupons", JSON.stringify(data.coupon));
        }
      });

      const myHeaders = new Headers();
      myHeaders.append("token", localStorage.token);

      let requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: formData,
      };

      const response = await fetch(`/api/events/${id}`, requestOptions); // eslint-disable-next-line
      const parseResponse = await response.json();

      if (parseResponse.type === "success") {
        navigate("/painel/eventos");
      }

      toast[parseResponse.type](parseResponse.message, { theme: "colored" });
    } catch (error) {
      console.log(error);
      toast.error(error, { theme: "colored" });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRegistration = async (id, admin) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const response = await fetch(`/api/registrations/${admin && "admin/"}${event.event_id}/${id}`, {
        method: "DELETE",
        headers: myHeaders,
      });

      const parseResponse = await response.json();
      if (parseResponse.type === "success") {
        setEvent({ ...event, registrations: event.registrations.filter((registration) => registration.registration_id !== id) });
        toast.success(parseResponse.message, { theme: "colored" });
      }
    } catch (err) {
      console.log(err.message);
    }
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

    const getFlagships = async () => {
      setIsLoading(true);
      try {
        const flagships = await fetch(`/api/events/flagships`, {
          method: "GET",
        });
        const parseFlagships = await flagships.json();
        setFlagships(parseFlagships.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    getEvent();
    getFlagships();
  }, [id]);

  useEffect(() => {
    if (event) {
      const parsedInfo = {
        name: event.event_name,
        location: event.event_location,
        link: event.event_link,
        attendees: event.event_general_attendees,
        imageOld: event.event_image,
        external: event.event_external,
        dateStart: isoTimezone(event.event_date_start),
        dateEnd: isoTimezone(event.event_date_end),
        registrationStart: isoTimezone(event.event_registrations_start),
        registrationEnd: isoTimezone(event.event_registrations_end),
        description: event.event_description,
        rules: event.event_rules,
        details: event.event_details,
        flagship: event.flagship_id,
      };

      reset(parsedInfo);
    }
  }, [event, reset]);

  if (isLoading || !event) return <LoadingScreen />;

  return (
    <Fragment>
      <div className="bg-light">
        <div className="px-lg-5 py-lg-5">
          <div className="p-3 bg-white rounded rounded-2 shadow">
            <div className="d-flex flex-column flex-lg-row justify-content-between">
              <h2 className="text-center">{event?.event_name}</h2>
              <div className="d-flex flex-lg-row flex-column">
                <Link to="/painel/eventos" className="btn btn-secondary my-1 w-100">
                  Voltar
                </Link>
                <button className="btn btn-success ms-lg-2 my-1 w-100" onClick={handleSubmit(onSubmit)}>
                  Salvar
                </button>
              </div>
            </div>

            <hr />
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${tab === undefined && "active"} `}
                  id="evento-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#evento"
                  type="button"
                  role="tab"
                  aria-controls="evento"
                  aria-selected="true"
                >
                  Evento
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${tab === "inscricao" && "active"} `}
                  id="inscricao-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#inscricao"
                  type="button"
                  role="tab"
                  aria-controls="inscricao"
                  aria-selected="false"
                >
                  Inscrição
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${tab === "categorias" && "active"} `}
                  id="categorias-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#categorias"
                  type="button"
                  role="tab"
                  aria-controls="categorias"
                  aria-selected="false"
                >
                  Categorias
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${tab === "kits" && "active"} `}
                  id="kits-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#kits"
                  type="button"
                  role="tab"
                  aria-controls="kits"
                  aria-selected="false"
                >
                  Kits
                </button>
              </li>

              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${tab === "inscritos" && "active"} `}
                  id="inscritos-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#inscritos"
                  type="button"
                  role="tab"
                  aria-controls="inscritos"
                  aria-selected="false"
                >
                  Inscritos
                </button>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div className={`tab-pane fade ${tab === undefined && "show active"}`} id="evento" role="tabpanel" aria-labelledby="event-tab">
                <EditEvent
                  event={event}
                  flagships={flagships}
                  setFocus={setFocus}
                  getValues={getValues}
                  setValue={setValue}
                  watch={watch}
                  reset={reset}
                  trigger={trigger}
                  control={control}
                  register={register}
                  handleSubmit={handleSubmit}
                  errors={errors}
                />
              </div>
              <div
                className={`tab-pane fade ${tab === "categorias" && "show active"}`}
                id="categorias"
                role="tabpanel"
                aria-labelledby="categories-tab"
              >
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
              <div className={`tab-pane fade ${tab === "inscricao" && "show active"}`} id="inscricao" role="tabpanel" aria-labelledby="inscricao-tab">
                <EditRegistering
                  event={event}
                  control={control}
                  register={register}
                  getValues={getValues}
                  watch={watch}
                  errors={errors}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </div>
              <div className={`tab-pane fade ${tab === "kits" && "show active"}`} id="kits" role="tabpanel" aria-labelledby="kits-tab">
                <EditKits />
              </div>
              <div
                className={`tab-pane fade ${tab === "inscritos" && "show active"}`}
                id="inscritos"
                role="tabpanel"
                aria-labelledby="registrations-tab"
              >
                <ListRegistrations
                  event={event}
                  setEvent={setEvent}
                  getValues={getValues}
                  setValue={setValue}
                  reset={reset}
                  trigger={trigger}
                  control={control}
                  register={register}
                  handleSubmit={handleSubmit}
                  errors={errors}
                  useFieldArray={useFieldArray}
                  deleteRegistration={deleteRegistration}
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
