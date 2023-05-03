import { Fragment, useEffect, useState } from "react";
import Table from "../table";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import LoadingScreen from "../../../../utils/loadingScreen";
import { toast } from "react-toastify";

const UpdateFlagship = () => {
  const { id } = useParams();
  const [flagship, setFlagship] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const fetchFlagship = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/events/flagships/${id}`, {
        method: "GET",
      });
      const parseResponse = await response.json();
      setFlagship(parseResponse.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async () => {
    try {
      const formData = new FormData();
      const formValues = getValues();
      console.log(formValues);
      Object.keys(formValues).forEach((key) => {
        formData.append(key, formValues[key]);
      });

      const myHeaders = new Headers();

      myHeaders.append("token", localStorage.token);

      let requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: formData,
      };

      const response = await fetch(`/api/events/flagships/${id}`, requestOptions); // eslint-disable-next-line
      const parseResponse = await response.json();

      if (parseResponse.type === "success") {
        navigate("/painel/flagships");
      }

      toast[parseResponse.type](parseResponse.message, { theme: "colored" });
    } catch (error) {
      toast.error(error, { theme: "colored" });
    }
  };

  useEffect(() => {
    fetchFlagship();
  }, []);

  useEffect(() => {
    if (flagship) {
      const parsedInfo = {
        name: flagship.flagship_name,
        link: flagship.flagship_link,
        flagshipOldLogo: flagship.flagship_logo,
        flagshipOldBG: flagship.flagship_bg,
      };
      reset(parsedInfo);
    }
  }, [flagship]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Fragment>
      <div className="bg-light">
        <div className="px-lg-5 py-lg-5">
          <div className="p-3 bg-white rounded rounded-2 shadow">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12 col-lg-6">
                  <h1>{flagship?.flagship_name}</h1>
                </div>
                <div className="col-12 col-lg-6 d-flex justify-content-end">
                  <Link className="btn btn-secondary my-auto mx-2" to="/painel/flagships">
                    Voltar
                  </Link>
                  <button
                    className="btn btn-success my-auto"
                    onClick={() => {
                      onSubmit();
                    }}
                  >
                    Salvar
                  </button>
                </div>
                <div className="col-12 col-lg-6">
                  <label htmlFor="name">Nome da Série</label>
                  <input
                    id="name"
                    className={`form-control ${errors.name?.type ? "is-invalid" : ""}`}
                    {...register("name", {
                      required: true,
                      pattern: /.{2,}/,
                    })}
                    aria-invalid={errors.name ? "true" : "false"}
                  />
                </div>
                <div className="col-12 col-lg-6">
                  <label htmlFor="name">Link da Série</label>
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon1">
                      {window.location.origin}/
                    </span>
                    <input
                      id="link"
                      className={`form-control ${errors.name?.type ? "is-invalid" : ""}`}
                      {...register("link", {
                        required: true,
                        pattern: /.{2,}/,
                      })}
                      aria-invalid={errors.name ? "true" : "false"}
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-12 col-lg-6">
                  <label htmlFor="logo">Logo da Série</label>
                  <br />
                  <div className="d-flex justify-content-center">
                    <img
                      src={watch("logo") ? URL.createObjectURL(getValues("logo")) : getValues("flagshipOldLogo")}
                      className="img-fluid rounded-2"
                      alt="logo"
                      style={{ maxHeight: "350px" }}
                    />
                  </div>
                  <Controller
                    name="logo"
                    control={control}
                    defaultValue={null}
                    rules={{
                      required: false,
                    }}
                    render={({ field }) => (
                      <input
                        id="logo"
                        accept="image/*"
                        type="file"
                        onChange={(e) => {
                          field.onChange(e.target.files[0]);
                        }}
                        className={`form-control ${errors.logo?.type ? "is-invalid" : ""} mt-2`}
                        aria-invalid={errors.logo ? "true" : "false"}
                      />
                    )}
                  />
                </div>
                <div className="col-12 col-lg-6 mt-3 mt-lg-0">
                  <label htmlFor="name">Imagem de Fundo</label>
                  <br />
                  <div className="d-flex justify-content-center">
                    <img
                      src={watch("bg") ? URL.createObjectURL(getValues("bg")) : getValues("flagshipOldBG")}
                      className="img-fluid rounded-2"
                      alt="logo"
                      style={{ maxHeight: "350px" }}
                    />
                  </div>
                  <Controller
                    name="bg"
                    control={control}
                    defaultValue={null}
                    rules={{
                      required: false,
                    }}
                    render={({ field }) => (
                      <input
                        id="bg"
                        accept="image/*"
                        type="file"
                        onChange={(e) => {
                          field.onChange(e.target.files[0]);
                        }}
                        className={`form-control ${errors.bg?.type ? "is-invalid" : ""} mt-2`}
                        aria-invalid={errors.bg ? "true" : "false"}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateFlagship;
