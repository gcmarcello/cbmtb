import dayjs from "dayjs";
import { useEffect, useRef } from "react";
import { Fragment, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingScreen from "../../utils/loadingScreen";
import _config from "../../_config";
import ReCAPTCHA from "react-google-recaptcha";

const TicketPanel = (props) => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState(null);
  const [panel, setPanel] = useState("messages");
  const [isLoading, setIsLoading] = useState(false);

  const {
    setValue,
    watch,
    reset,
    register,
    getValues,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const reCaptchaComponent = useRef(null);

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
      myHeaders.append("Content-type", "application/json");

      const response = await fetch(`/api/tickets/public/${ticket.ticket_id}`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(data),
      });

      const parseResponse = await response.json();
      if (parseResponse.type === "success") {
        toast.success(parseResponse.message, { theme: "colored" });
        reset();
        setMessages([parseResponse.data, ...messages]);
      } else {
        toast.error(parseResponse.message, { theme: "colored" });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Fragment>
      <div className="container inner-page">
        <div className="row">
          <div className="mb-2">
            <span className="h1">Responder Chamado </span>
            <span className="text-muted d-none d-lg-inline-block">({ticket?.ticket_id})</span>
            <div className="text-muted d-block d-lg-none">({ticket?.ticket_id})</div>
          </div>
          <hr />
          <p className="text-justify px-3">
            Esse é o painel onde você tem acesso ao histórico de mensagens e painel de envio de nova mensagem para nossa equipe. Ele possui um link
            único, e só pode ser acessado através do link em que você clicou em seu email.
          </p>
          <div className="btn-group d-flex d-lg-none mb-3" role="group">
            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id="btnradio1"
              defaultChecked
              onClick={(e) => {
                setPanel("messages");
              }}
            />
            <label className="btn btn-outline-primary" htmlFor="btnradio1">
              Histórico
            </label>

            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id="btnradio2"
              onClick={(e) => {
                setPanel("form");
              }}
            />
            <label className="btn btn-outline-primary" htmlFor="btnradio2">
              Responder
            </label>
          </div>
          <div
            className={`col-12 col-lg-6 overflow-auto mt-4 d-lg-block ${panel === "messages" ? "d-block" : "d-none"}`}
            style={{ maxHeight: "500px" }}
          >
            {messages?.length &&
              messages?.map((message, index) => (
                <div key={`message-${index}`} className="card mb-3" style={{ width: "100%" }}>
                  <div className={`card-header d-flex justify-content-between flex-row${!message.user_id && "-reverse"}`}>
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
                      {message?.user_id ? _config.entidade.abbreviation : ticket.ticket_name.split(" ")[0]}{" "}
                    </div>
                    <div>{dayjs(message.message_date).format("DD/MM/YYYY HH:mm")}</div>
                  </div>

                  <div className="card-body" dangerouslySetInnerHTML={{ __html: message.message_body }}></div>
                </div>
              ))}
          </div>
          <div className={`col-12 col-lg-6 d-lg-block ${panel === "form" ? "d-block" : "d-none"}`}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="messageBody">Corpo da Mensagem</label>
              <textarea
                id="messageBody"
                name="messageBody"
                className={`form-control ${errors.messageBody?.type ? "is-invalid" : getValues("messageBody") ? "is-valid" : ""} mb-3`}
                {...register("messageBody", { required: true })}
              />
              <div className="d-flex align-items-center flex-column flex-lg-row justify-content-center justify-content-lg-between mt-3">
                <Controller
                  name="reCaptcha"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange } }) => (
                    <ReCAPTCHA
                      className="d-flex justify-content-center"
                      hl="pt-BR"
                      ref={reCaptchaComponent}
                      sitekey={_config.site.reCaptchaSiteKey}
                      onChange={onChange}
                      onExpired={(e) => {
                        setValue("reCaptcha", "");
                        reCaptchaComponent.current.reset();
                      }}
                    />
                  )}
                />
                <input type="submit" className="btn btn-success px-5 py-2  mt-2 mt-lg-0" value="Enviar" disabled={!watch("reCaptcha")} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TicketPanel;
