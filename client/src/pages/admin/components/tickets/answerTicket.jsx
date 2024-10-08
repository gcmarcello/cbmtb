import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import LoadingScreen from "../../../../utils/loadingScreen";

import { Editor } from "@tinymce/tinymce-react";
import tinyConfig from "../../config/tiny.config";
import uploadImage from "../../functions/uploadImage";
import { toast } from "react-toastify";
import _config from "../../../../_config";

const dayjs = require("dayjs");

const AnswerTicket = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    setValue,
    watch,
    reset,
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
      setTicket(parseResponse.data.ticket);
      setMessages(parseResponse.data.messages);
      setValue("firstName", parseResponse.data.ticket.ticket_name);
      setValue("email", parseResponse.data.ticket.ticket_email);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("token", localStorage.token);
      myHeaders.append("Content-type", "application/json");

      const response = await fetch(`/api/tickets/admin/${ticket.ticket_id}`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(data),
      });

      const parseResponse = await response.json();
      if (parseResponse.type === "success") {
        toast.success(parseResponse.message, { theme: "colored" });
        reset();
        setMessages([parseResponse.data, ...messages]);
        setTicket({ ...ticket, ticket_status: "awaiting" });
        /* navigate("/painel/ouvidoria"); */
      } else {
        toast.error(parseResponse.message, { theme: "colored" });
      }
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  const resolveTicket = async () => {
    try {
      setIsLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("token", localStorage.token);
      myHeaders.append("Content-type", "application/json");

      const response = await fetch(`/api/tickets/${ticket.ticket_id}`, {
        method: "PUT",
        headers: myHeaders,
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
      <div className="px-0 px-lg-5 py-lg-5">
        <div className="p-3 bg-white rounded rounded-2 shadow px-lg-5">
          <div className="d-flex justify-content-between align-items-end">
            <div>
              <span className="h1">Chamado </span>
              <span className="text-muted">({ticket?.ticket_id})</span>
            </div>
            <div>
              <Link to="/painel/ouvidoria" className="btn btn-secondary  px-3 ">
                Voltar
              </Link>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="row">
              <div className="col-12 mb-lg-3">
                <div className="d-flex justify-content-center">
                  <ul className="list-group list-group-horizontal-lg">
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
                      <i className="bi bi-calendar-fill"></i>{" "}
                      {dayjs(ticket?.ticket_date).format("DD/MM/YYYY HH:mm")}
                    </li>
                    <li className="list-group-item">
                      <i className="bi bi-flag-fill"></i>{" "}
                      {ticket?.ticket_status === "pending" ? (
                        <span className="badge bg-danger">Pendente</span>
                      ) : ticket?.ticket_status === "awaiting" ? (
                        <span className="badge bg-warning text-dark">
                          Aguardando Resposta
                        </span>
                      ) : (
                        <span className="badge bg-success">Finalizado</span>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="row flex-column-reverse flex-lg-row">
            <div className="col-12 col-lg-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="news-text">Corpo da mensagem</label>
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
                <div className="d-flex justify-content-between mt-3">
                  <button
                    className="btn btn-outline-success px-5 py-2 mt-lg-0"
                    data-bs-toggle="modal"
                    data-bs-target="#resolveModal"
                  >
                    Resolvido
                  </button>

                  <div
                    className="modal fade"
                    id="resolveModal"
                    tabindex="-1"
                    aria-labelledby="resolveModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">
                            Confirmar Resolução
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">Deseja resolver esse chamado?</div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            className="btn btn-success"
                            data-bs-dismiss="modal"
                            onClick={(e) => {
                              resolveTicket();
                            }}
                          >
                            Resolvido
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <input
                    type="submit"
                    className="btn btn-success px-5 py-2"
                    defaultValue="Enviar"
                    disabled={!watch("messageBody")}
                  />
                </div>
              </form>
            </div>

            <div
              className="col-12 col-lg-6 overflow-auto "
              style={{ maxHeight: "500px" }}
            >
              <label htmlFor="news-text">Histórico de Mensagens</label>
              {messages?.map((message, index) => (
                <div
                  key={`message-${index}`}
                  className="card mb-3"
                  style={{ width: "100%" }}
                >
                  <div
                    className={`card-header d-flex justify-content-between flex-row${
                      !message.user_id && "-reverse"
                    }`}
                  >
                    <div>
                      <img
                        src={
                          !message.user_id
                            ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                            : _config.images.primaryLogo
                        }
                        alt=""
                        height={30}
                        width={30}
                        className="rounded-circle me-2"
                      />
                      {message?.user_id
                        ? _config.entidade.abbreviation
                        : ticket.ticket_name.split(" ")[0]}{" "}
                    </div>
                    <div>{dayjs(message.message_date).format("DD/MM/YYYY HH:mm")}</div>
                  </div>

                  <div
                    className="card-body"
                    dangerouslySetInnerHTML={{ __html: message.message_body }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerTicket;
