export default function RegistrationDescida() {
  return (
    <div className="container inner-page pb-md-5">
      <div className="d-flex">
        <label htmlFor="user_cpf">CPF</label>
        <input
          type="text"
          id="user_cpf"
          name="user_cpf"
          className="form-control"
          disabled
        />
      </div>
    </div>
  );
}
