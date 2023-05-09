import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Table from "../table";
import LoadingScreen from "../../../../utils/loadingScreen";

const CompleteEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [registrationInfo, setRegistrationInfo] = useState(null);
  const [suspendedUsers, setSuspendedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(null);

  const getCheckInNumbers = async () => {
    try {
      setIsLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const response = await fetch(`/api/registrations/${id}/noshow`, {
        method: "GET",
        headers: myHeaders,
      });
      const parseResponse = await response.json();
      if (parseResponse.type === "error") {
        toast[parseResponse.type](parseResponse.message, { theme: "colored" });
      }
      if (parseResponse.data.eventInfo.event_status === "completed") {
        toast.error("Esse evento já foi finalizado.", { theme: "colored" });
        navigate("/painel/eventos");
      }
      setRegistrationInfo(parseResponse.data);
      setSuspendedUsers(
        parseResponse.data.attendeeCount.map((user) => ({
          user_id: user.user_id,
          user_name: `${user.user_first_name}${user.user_last_name}`,
          suspended: true,
        }))
      );
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCheckInNumbers();
  }, []);

  const toggleSuspension = (event) => {
    const updatedArray = suspendedUsers.map((user) => {
      if (event.target.id === user.user_id) {
        return { ...user, suspended: event.target.checked };
      }
      return user;
    });
    setSuspendedUsers(updatedArray);
  };

  const columns = [
    {
      Header: "Nome",
      accessor: "user_first_name",
      Cell: ({ row, value }) => `${value} ${row.original.user_last_name}`,
    },
    {
      Header: "Suspender",
      accessor: "user_id",
      Cell: ({ value, row: { index } }) => (
        <>
          <input type="hidden" name="" id="" defaultValue={value} />
          <input
            type="checkbox"
            className="btn-check"
            name="suspend"
            id={`${value}`}
            onChange={(event) => {
              toggleSuspension(event);
            }}
            checked={suspendedUsers.find((user) => user.user_id === value).suspended}
          />
          <label className="btn btn-outline-danger" htmlFor={`${value}`}>
            {suspendedUsers.find((user) => user.user_id === value).suspended ? "Suspenso" : "Suspender"}
          </label>
        </>
      ),
    },
  ];

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(suspendedUsers);
      setIsLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("token", localStorage.token);
      myHeaders.append("Content-type", "application/json");

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(suspendedUsers),
      };

      const response = await fetch(`/api/events/${id}/complete`, requestOptions);
      const parseResponse = await response.json();
      toast[parseResponse.type](parseResponse.message, { theme: "colored" });
      if (parseResponse.type === "success") {
        navigate("/painel/eventos");
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="bg-light">
      <div className="px-lg-5 py-lg-5">
        <div className="p-3 bg-white rounded rounded-2 shadow">
          <h1>Finalizar {registrationInfo?.eventInfo.event_name}</h1>

          {/* <button onClick={toggleCheckboxes} type="button">
            {masterCheckbox ? "Uncheck all" : "Check all"}
          </button> */}
          <div className="container-fluidz">
            <div className="row">
              <div className="col-12">
                <p>
                  Para finalizar o evento, verifique a lista de não comparecimentos e selecione os atletas que apresentaram justificativa para a
                  ausência. Os demais atletas terão o CPF suspenso, e deverão entrar em contato para reaver seu cadastro.
                </p>
                <h3>Não Comparecimentos</h3>
                <form onSubmit={(e) => onSubmit(e)}>
                  {registrationInfo && <Table data={registrationInfo.attendeeCount} columns={columns} customPageSize={5} />}

                  <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">
                      Finalizar
                    </button>
                  </div>

                  <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1 className="modal-title fs-5" id="exampleModalLabel">
                            Finalizar Evento
                          </h1>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                          Tem certeza de que deseja finalizar o evento? Ele será marcado como finalizado e os atletas que não compareceram serão
                          suspensos de acordo com a seleção na lista anterior.
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                            Cancelar
                          </button>
                          <input type="submit" className="btn btn-success" data-bs-dismiss="modal" value={"Finalizar"} />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteEvent;
