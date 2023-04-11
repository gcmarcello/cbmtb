import React, { Fragment } from "react";
import Table from "../table";
import xlsx from "json-as-xlsx";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
const dayjs = require("dayjs");

const ListRegistrations = (props) => {
  const {
    watch,
    getValues,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const columns = [
    {
      Header: "Nome",
      accessor: "user_first_name",
    },
    {
      Header: "Sobrenome",
      accessor: "user_last_name",
    },
    {
      Header: "Categoria",
      accessor: "category_name",
    },
    {
      Header: "Camisa",
      accessor: "registration_shirt",
      Cell: ({ value }) => value.toUpperCase(),
    },
    {
      Header: "Status",
      accessor: "registration_status",
      Cell: ({ value }) => {
        switch (value) {
          case "completed":
            return <span className="badge bg-success">Confirmada</span>;
          case "cancelled":
            return <span className="badge bg-danger">Cancelada</span>;
          case "pending":
            return <span className="badge bg-warning text-dark">Pendente</span>;
          default:
        }
      },
    },
    {
      Header: "Telefone",
      accessor: "user_phone",
    },
    {
      Header: "Email",
      accessor: "user_email",
    },
    {
      Header: "Opções",
      accessor: "registration_id",
      disableSortBy: true,
      Cell: ({ value, row }) => (
        <Fragment>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target={`#updateRegistrationModal`}
            onClick={() => onOpenModal(row.original)}
          >
            <i className="bi bi-pencil"></i>
          </button>
        </Fragment>
      ),
    },
  ];

  const onOpenModal = (userInfo) => {
    reset({
      registrationId: userInfo.registration_id,
      registrationFirstName: userInfo.user_first_name,
      registrationLastName: userInfo.user_last_name,
      registrationEmail: userInfo.user_email,
      registrationCategory: userInfo.category_id,
      registrationCategoryName: userInfo.category_name,
      registrationDate: userInfo.registration_date,
      registrationPhone: userInfo.user_phone,
      registrationBirthDate: userInfo.user_birth_date,
      registrationShirt: userInfo.registration_shirt,
    });
  };

  function formatText(text) {
    let words = text.split("_");
    words = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    return words.join(" ");
  }

  const generateXlsx = () => {
    const data = props.event.categories.map((category) => ({
      sheet: category.category_name,
      columns: Object.keys(props.event.registrations[0]).map((column) => ({
        label: formatText(column),
        value: column,
      })),
      content: props.event.registrations
        .filter((registration) => registration.category_name === category.category_name)
        .map(function (registration) {
          let registrationDate = dayjs(registration.registration_date).format("DD/MM/YYYY HH:mm");
          let birthDate = dayjs(registration.user_birth_date).format("DD/MM/YYYY");
          registration.registration_date = registrationDate;
          registration.user_birth_date = birthDate;
          registration.age = dayjs().diff(registration.user_birth_date, "year");

          return registration;
        }),
    }));
    const settings = {
      fileName: `${props.event.event_name} - Inscritos`, // Name of the resulting spreadsheet
      extraLength: 3, // A bigger number means that columns will be wider
      writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
      writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
      RTL: false, // Display the columns from right-to-left (the default value is false)
    };
    xlsx(data, settings);
  };

  const onSubmit = async (data) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const response = await fetch(`/api/registrations/`, {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(data),
      });
      console.log(data);
      const parseResponse = await response.json();
      toast[parseResponse.type](parseResponse.message, { theme: "colored" });
      if (parseResponse.type === "success") {
        const index = props.event.registrations.findIndex((registration) => registration.registration_id === data.registrationId);
        const updatedRegistration = {
          ...props.event.registrations[index],
          registration_shirt: data.registrationShirt,
          category_id: data.registrationCategory,
          category_name: props.event.categories.filter((category) => category.category_id === data.registrationCategory)[0].category_name,
        };
        props.setEvent({
          ...props.event,
          registrations: [...props.event.registrations.slice(0, index), updatedRegistration, ...props.event.registrations.slice(index + 1)],
        });
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      reset();
    }
  };

  return (
    <div className="p-lg-3">
      <Table data={props.event.registrations} columns={columns} generateXlsx={generateXlsx} customPageSize={50} />

      <div className="modal fade" id={`updateRegistrationModal`} tabIndex="-1" aria-labelledby="updateRegistrationModalLabel" aria-hidden="true">
        <form onSubmit={handleSubmit(onSubmit)} className="needs-validation mt-2 px-2" noValidate>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="updateRegistrationModalLabel">
                  Atualizar Inscrição - {props.event.event_name}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <ul className="list-group mb-2">
                  <li className="list-group-item">
                    <strong>Nome:</strong> {getValues("registrationFirstName")} {getValues("registrationLastName")}
                  </li>
                  <li className="list-group-item">
                    <strong>Email:</strong> {getValues("registrationEmail")}
                  </li>
                  <li className="list-group-item">
                    <strong>Telefone:</strong> {getValues("registrationPhone")}
                  </li>
                  <li className="list-group-item">
                    <strong>Data de Nascimento:</strong> {dayjs(getValues("registrationBirthDate")).format("DD/MM/YYYY")}
                  </li>
                  <li className="list-group-item">
                    <strong>Data da Inscrição:</strong> {dayjs(getValues("registrationDate")).format("DD/MM/YYYY HH:mm")}
                  </li>
                </ul>
                <label htmlFor="gender">Categoria</label>
                <select
                  id="gender"
                  defaultValue=""
                  className={`form-select ${errors.gender?.type ? "is-invalid" : ""} mb-1`}
                  {...register("registrationCategory", { required: true })}
                >
                  {props.event.categories.map((category) => (
                    <option key={category.category_id} value={category.category_id}>
                      {category.category_name}
                    </option>
                  ))}
                </select>

                <label htmlFor="gender">Tamanho da Camisa</label>
                <select
                  id="gender"
                  defaultValue=""
                  className={`form-select ${errors.gender?.type ? "is-invalid" : ""} mb-1`}
                  {...register("registrationShirt", { required: true })}
                >
                  <option value="pp">PP</option>
                  <option value="p">P</option>
                  <option value="m">M</option>
                  <option value="g">G</option>
                  <option value="gg">GG</option>
                  <option value="xgg">XGG</option>
                </select>
              </div>
              <small className="text-muted mx-3 mb-1">ID: {getValues("registrationId")}</small>
              <div className="modal-footer justify-content-between">
                <button
                  type="button"
                  className="btn btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target={`#removeRegistrationModal`}
                  data-bs-dismiss="modal"
                >
                  Cancelar Inscrição
                </button>
                <div>
                  <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">
                    Voltar
                  </button>
                  <button type="submit" className="btn btn-success" data-bs-dismiss="modal">
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="modal fade" id={`removeRegistrationModal`} tabIndex="-1" aria-labelledby="removeRegistrationModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="removeRegistrationModalLabel">
                Cancelar inscrição
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Tem certeza que deseja cancelar esta inscrição? O inscrito receberá um email com a confirmação do cancelamento.
            </div>
            <small className="text-muted mx-3 mb-1">ID: {getValues("registrationId")}</small>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-toggle="modal"
                data-bs-target="#updateRegistrationModal"
                data-bs-dismiss="modal"
              >
                Voltar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => props.deleteRegistration(watch("registrationId"), true)}
                data-bs-dismiss="modal"
              >
                Cancelar Inscrição
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListRegistrations;
