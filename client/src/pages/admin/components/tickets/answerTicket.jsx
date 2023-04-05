import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import LoadingScreen from "../../../../utils/loadingScreen";

import { Editor } from "@tinymce/tinymce-react";
import tinyConfig from "../../config/tiny.config";
import uploadImage from "../../functions/uploadImage";
import { toast } from "react-toastify";

const dayjs = require("dayjs");

const AnswerTicket = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    setValue,
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const fetchTicket = async () => {
    try {
      setIsLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const response = await fetch(`/api/tickets/${id}`, {
        method: "GET",
        headers: myHeaders,
      });

      const parseResponse = await response.json();
      setTicket(parseResponse.data);
      setValue("firstName", parseResponse.data.ticket_name);
      setValue("email", parseResponse.data.ticket_email);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      setIsLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("token", localStorage.token);
      myHeaders.append("Content-type", "application/json");

      const response = await fetch(`/api/tickets/${ticket.ticket_id}`, {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(data),
      });

      const parseResponse = await response.json();
      if (parseResponse.type === "success") {
        toast.success(parseResponse.message, { theme: "colored" });
        navigate("/painel/ouvidoria");
      } else {
        toast.error(parseResponse.message, { theme: "colored" });
      }
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTicket();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="bg-light">
      <div className="px-lg-5 py-lg-5">
        <div className="p-3 bg-white rounded rounded-2 shadow px-5">
          <h1>Chamado ({ticket?.ticket_id})</h1>
          <hr />
          <div className="row">
            <div className="col-12 col-lg-3 mb-3 mb-lg-0">
              <div>
                <div className="card">
                  <div className="card-header">Informações do Chamado:</div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <i className="bi bi-person-circle"></i> {ticket?.ticket_name}
                    </li>
                    <li className="list-group-item">
                      <i className="bi bi-envelope-at-fill"></i> {ticket?.ticket_email}
                    </li>
                    <li className="list-group-item">
                      <i className="bi bi-telephone-fill"></i> {ticket?.ticket_phone}
                    </li>
                    <li className="list-group-item">
                      <i className="bi bi-calendar-fill"></i> {dayjs(ticket?.ticket_date).format("DD/MM/YYYY HH:mm")}
                    </li>
                  </ul>
                </div>
                <ul className="list-group"></ul>
              </div>
              <div className="card mt-3">
                <div className="card-header">Mensagem:</div>
                <div className="card-body">{ticket?.ticket_message}</div>
              </div>
            </div>
            <div className="col-12 col-lg-9">
              <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="news-text">Corpo do email</label>
                <Controller
                  name="messageBody"
                  control={control}
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
                <div className="d-flex justify-content-between mt-3">
                  <a href="/painel/ouvidoria" className="btn btn-secondary me-3 px-3 py-2">
                    Voltar
                  </a>
                  <input type="submit" className="btn btn-success px-5 py-2" defaultValue="Enviar" disabled={!watch("messageBody")} />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerTicket;
