import { toast } from "react-toastify";
const dayjs = require("dayjs");

const CheckInOffCanvas = ({ registration, setRegistration, getCheckInNumbers }) => {
  const isCheckedIn = registration?.registration_checkin;

  const checkinRegistration = async (id) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("token", localStorage.token);

      const response = await fetch(`/api/registrations/checkin/${id}`, { method: "POST", headers: myHeaders });
      const parseResponse = await response.json();

      if (parseResponse.type === "error") {
        return toast[parseResponse.type](parseResponse.message, { theme: "colored" });
      }
      toast[parseResponse.type](parseResponse.message, { theme: "colored" });
      setRegistration(null);
    } catch (error) {
      console.log(error);
    } finally {
      getCheckInNumbers();
    }
  };

  if (registration) {
    return (
      <div
        className="offcanvas show offcanvas-start"
        tabindex="-1"
        id="offcanvas"
        aria-labelledby="offcanvasLabel"
        style={{ backgroundColor: isCheckedIn ? "#bb2d3b" : "var(--primary-color)" }}
      >
        <div className="offcanvas-header">
          <h5  style={{ 
                  color: 'var(--secondary-color)'
                }} className="offcanvas-title" id="offcanvasLabel">
            Confirmar Inscrição
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => setRegistration(null)}
          ></button>
        </div>
        <div  style={{ 
                  color: 'var(--secondary-color)'
                }} className="offcanvas-body">
          <div className="d-flex justify-content-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path
                fill-rule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
              />
            </svg>
          </div>
          <div>
            <i  style={{ 
                  color: 'var(--secondary-color)'
                }} className="bi bi-person-fill fs-1"></i>
            <span className="fs-3 ms-2">
              {registration.user_first_name} {registration.user_last_name}
            </span>
          </div>
          <div>
            <i  style={{ 
                  color: 'var(--secondary-color)'
                }} className="bi bi-people-fill fs-1"></i>
            <span className="fs-3 ms-2">{registration.category_name}</span>
          </div>
          <div>
            <i  style={{ 
                  color: 'var(--secondary-color)'
                }} className="bi bi-calendar-fill fs-1"></i>
            <span className="fs-3 ms-2">{dayjs(registration.user_birth_date).format("DD/MM/YYYY")}</span>
          </div>
          <div className="d-flex justify-content-evenly mt-3">
            {!isCheckedIn ? (
              <>
                <button data-bs-dismiss="offcanvas" onClick={() => setRegistration(null)} className="btn btn-lg btn-secondary">
                  Cancelar
                </button>
                <button
                  onClick={() => checkinRegistration(registration.registration_id)}
                  data-bs-dismiss="offcanvas"
                  className="btn btn-lg btn-primary"
                >
                  Check-in
                </button>
              </>
            ) : (
              <div className="d-flex justify-content-evenly align-items-center">
                <h6 className="align-middle me-3">Atleta já realizou o check-in. Por favor, tente novamente ou contate o administrador.</h6>
                <button data-bs-dismiss="offcanvas" onClick={() => setRegistration(null)} className="btn btn-lg btn-secondary shadow-sm">
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default CheckInOffCanvas;
