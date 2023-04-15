import { useEffect, useState } from "react";
import Table from "../table";
import InputMask from "react-input-mask";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
const dayjs = require("dayjs");
const cepSearch = require("cep-promise");

const ListUsers = () => {
  const [userList, setUserList] = useState([]);
  const [cepLoading, setCepLoading] = useState(false);
  const [userListChange, setUserListChange] = useState(false);
  const {
    watch,
    getValues,
    setValue,
    setError,
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const caseInsensitiveSort = (rowA, rowB, columnId) => {
    const valueA = rowA.values[columnId];
    const valueB = rowB.values[columnId];

    // Convert the values to lowercase strings if they are strings, otherwise use the original values
    const stringA = typeof valueA === "string" ? valueA.toLowerCase() : valueA;
    const stringB = typeof valueB === "string" ? valueB.toLowerCase() : valueB;

    return String(stringA).localeCompare(String(stringB));
  };

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
      Header: "Email",
      accessor: "user_email",
      className: "d-none d-lg-table-cell",
    },
    {
      Header: "CPF",
      accessor: "user_cpf",
      className: "d-none d-lg-table-cell",
    },
    {
      Header: "Status",
      accessor: "user_confirmed",
      className: "d-none d-lg-table-cell",
      Cell: ({ value }) => (value ? <span className="badge bg-success">Confirmado</span> : <span className="badge bg-danger">Pendente</span>),
      sortType: caseInsensitiveSort,
    },
    {
      Header: "Cargo",
      accessor: "user_role",
      className: "d-none d-lg-table-cell",
      Cell: ({ value }) => {
        switch (value) {
          case "user":
            return <span className="badge bg-primary">Usuário</span>;
          case "admin":
            return <span className="badge bg-warning text-dark">Administrador</span>;
          default:
            return value;
        }
      },
    },
    {
      Header: "Infos",
      accessor: "user_id",
      Cell: ({ row }) => {
        return (
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={() => onOpenModal(row.original)}
          >
            <i className="bi bi-pencil-fill"></i>
          </button>
        );
      },
    },
  ];

  const handleCep = async () => {
    try {
      setCepLoading(true);
      let info = await cepSearch(getValues("cep"));
      setValue("state", info.state);
      setValue("city", info.city);
      setValue("address", info.street);
      setValue("number", "");
      setValue("apartment", "");
      return true;
    } catch (error) {
      setError("cep", {
        type: "server",
        message: "CEP Inválido.",
      });
      setValue("state", "");
      setValue("city", "");
      setValue("address", "");
      return false;
    } finally {
      setCepLoading(false);
    }
  };

  const listUsers = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const response = await fetch(`/api/users/list`, {
        method: "GET",
        headers: myHeaders,
      }); // eslint-disable-next-line
      const parseResponse = await response.json();
      setUserList(parseResponse);
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async (data) => {
    try {
      setUserListChange(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const response = await fetch(`/api/users/admin`, {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(data),
      });
      const parseResponse = await response.json();
      toast[parseResponse.type](parseResponse.message, { theme: "colored" });
    } catch (err) {
      console.log(err.message);
    } finally {
      setUserListChange(false);
      reset();
    }
  };

  const onOpenModal = (userInfo) => {
    reset({
      firstName: userInfo.user_first_name,
      lastName: userInfo.user_last_name,
      email: userInfo.user_email,
      cpf: userInfo.user_cpf,
      phone: userInfo.user_phone,
      gender: userInfo.user_gender,
      birthDate: dayjs(userInfo.user_birth_date).format("YYYY-MM-DD"),
      cep: userInfo.user_cep,
      state: userInfo.user_state,
      city: userInfo.user_city,
      address: userInfo.user_address,
      number: userInfo.user_number,
      apartment: userInfo.user_apartment,
      userId: userInfo.user_id,
      userStatus: userInfo.user_confirmed,
    });
  };

  useEffect(() => {
    if (!userListChange) {
      listUsers();
    }
  }, [userListChange]);

  return (
    <div className="bg-light">
      <div className="px-lg-5 py-lg-5">
        <div className="p-3 bg-white rounded rounded-2 shadow">
          <h1>Lista de Usuários</h1>
          <hr />
          <Table data={userList} columns={columns} customPageSize={100} sortByColumn={[{ id: "user_first_name", desc: false }]} />
          <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Editar Usuário
                  </h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="needs-validation mt-2 px-2" noValidate>
                  <div className="modal-body">
                    <div className="row mb-2">
                      <div className="col-12 col-lg-6">
                        <label htmlFor="firstName">
                          Nome<span className="text-danger">*</span>
                        </label>
                        <input
                          id="firstName"
                          className={`form-control ${errors.firstName?.type ? "is-invalid" : ""}`}
                          {...register("firstName", { required: true, pattern: /^([A-Za-z]+\s*){3,}$/i })}
                          aria-invalid={errors.firstName ? "true" : "false"}
                        />
                      </div>
                      <div className="col-12 col-lg-6">
                        <label htmlFor="lastName">
                          Sobrenome<span className="text-danger">*</span>
                        </label>
                        <input
                          id="lastName"
                          className={`form-control ${errors.lastName?.type ? "is-invalid" : ""}`}
                          {...register("lastName", { required: true, pattern: /^([A-Za-z]+\s*){3,}$/i })}
                          aria-invalid={errors.fullName ? "true" : "false"}
                        />
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-12 col-lg-6">
                        <label htmlFor="email">
                          Email<span className="text-danger">*</span>
                        </label>
                        <input
                          id="email"
                          className={`form-control ${errors.email?.type ? "is-invalid" : ""}`}
                          {...register("email", { required: true, pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/ })}
                          aria-invalid={errors.email ? "true" : "false"}
                        />
                        <small id="couponLink" className="form-text text-muted">
                          O usuário terá de confirmar o novo e-mail antes de fazer login novamente.
                        </small>
                      </div>

                      <div className="col-12 col-lg-6">
                        <label htmlFor="name">
                          CPF<span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="cpf"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: true,
                            pattern: /^(\d{3}\.){2}\d{3}-\d{2}$/,
                          }}
                          render={({ field }) => (
                            <InputMask
                              mask="999.999.999-99"
                              className={`form-control ${errors.cpf ? "is-invalid" : ""}`}
                              maskChar=""
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {(inputProps) => <input {...inputProps} type="text" />}
                            </InputMask>
                          )}
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-12 col-lg-6">
                        <label htmlFor="phone">Telefone</label>
                        <Controller
                          name="phone"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: true,
                            pattern: /^\d{2}\s\d{5}-\d{4}$/,
                          }}
                          render={({ field }) => (
                            <InputMask
                              mask="99 99999-9999"
                              className={`form-control ${errors.phone ? "is-invalid" : ""} mb-1`}
                              maskChar=""
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {(inputProps) => <input {...inputProps} type="text" />}
                            </InputMask>
                          )}
                        />
                        <div className="row">
                          <div className="col-12 col-lg-6">
                            <label htmlFor="birthDate">Data de Nascimento</label>
                            <input
                              id="birthDate"
                              type="date"
                              className={`form-control ${errors.birthDate?.type ? "is-invalid" : ""}`}
                              {...register("birthDate", {
                                required: true,
                                pattern: /^\d{4}-\d{2}-\d{2}$/i,
                                validate: (date) => dayjs().diff(date, "year") > 1,
                              })}
                              aria-invalid={errors.birthDate ? "true" : "false"}
                            />
                          </div>
                          <div className="col-12 col-lg-6">
                            <label htmlFor="gender">
                              Sexo<span className="text-danger">*</span>
                            </label>
                            <select
                              id="gender"
                              defaultValue=""
                              className={`form-select ${errors.gender?.type ? "is-invalid" : ""} mb-1`}
                              {...register("gender", { required: true })}
                            >
                              <option value="">Selecionar</option>
                              <option value="Masculino">Masculino</option>
                              <option value="Feminino">Feminino</option>
                            </select>
                          </div>
                        </div>
                        {errors.birthDate && (
                          <div className="alert alert-danger mt-2" role="alert">
                            Por favor, verifique sua data de nascimento.
                          </div>
                        )}
                      </div>

                      <div className="col-12 col-lg-6">
                        <div className="row">
                          <div className="col-12 col-xl-5">
                            <label htmlFor="name">
                              CEP<span className="text-danger">*</span>
                              <span className="text-muted small">
                                {" "}
                                (Não sabe? Clique{" "}
                                <a href="https://www2.correios.com.br/sistemas/buscacep/buscaCep.cfm" target="_blank" rel="noreferrer">
                                  aqui.
                                </a>
                                )
                              </span>
                            </label>
                            <Controller
                              name="cep"
                              control={control}
                              defaultValue=""
                              rules={{
                                required: true,
                                validate: (value) => {
                                  if (/^\d{5}-\d{3}$/.test(value) && handleCep()) {
                                    return true;
                                  }
                                  return false;
                                },
                              }}
                              render={({ field }) => (
                                <InputMask
                                  mask="99999-999"
                                  name="cep"
                                  className={`form-control ${errors.cep ? "is-invalid" : cepLoading ? "is-loading" : ""} `}
                                  maskChar=""
                                  value={field.value}
                                  onChange={field.onChange}
                                >
                                  {(inputProps) => <input {...inputProps} type="text" />}
                                </InputMask>
                              )}
                            />
                          </div>
                          <div className="col-12 col-xl-3">
                            <label htmlFor="state">
                              Estado<span className="text-danger">*</span>
                            </label>
                            <select
                              id="state"
                              defaultValue=""
                              className={`form-select ${errors.state ? "is-invalid" : ""} mb-1`}
                              {...register("state", { required: true })}
                            >
                              <option value="" disabled>
                                Selecione
                              </option>
                              <option value="AC">AC</option>
                              <option value="AL">AL</option>
                              <option value="AP">AP</option>
                              <option value="AM">AM</option>
                              <option value="BA">BA</option>
                              <option value="CE">CE</option>
                              <option value="DF">DF</option>
                              <option value="ES">ES</option>
                              <option value="GO">GO</option>
                              <option value="MA">MA</option>
                              <option value="MT">MT</option>
                              <option value="MS">MS</option>
                              <option value="MG">MG</option>
                              <option value="PA">PA</option>
                              <option value="PB">PB</option>
                              <option value="PR">PR</option>
                              <option value="PE">PE</option>
                              <option value="PI">PI</option>
                              <option value="RJ">RJ</option>
                              <option value="RN">RN</option>
                              <option value="RS">RS</option>
                              <option value="RO">RO</option>
                              <option value="RR">RR</option>
                              <option value="SC">SC</option>
                              <option value="SP">SP</option>
                              <option value="SE">SE</option>
                              <option value="TO">TO</option>
                            </select>
                          </div>
                          <div className="col-12 col-xl-4">
                            <label htmlFor="city">
                              Cidade<span className="text-danger">*</span>
                            </label>
                            <input
                              id="city"
                              className={`form-control ${errors.city?.type ? "is-invalid" : ""}`}
                              {...register("city", { required: true, pattern: /^([A-Za-zÀ-ÖØ-öø]+\s*){3,}$/i })}
                              aria-invalid={errors.city ? "true" : "false"}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 col-lg-5">
                            <label htmlFor="address">
                              Endereço<span className="text-danger">*</span>
                            </label>
                            <input
                              id="address"
                              className={`form-control ${errors.address?.type ? "is-invalid" : ""}`}
                              {...register("address", { required: true, pattern: /.{2,}/ })}
                              aria-invalid={errors.address ? "true" : "false"}
                            />
                          </div>
                          <div className="col-12 col-lg-3">
                            <label htmlFor="number">Número</label>
                            <input
                              id="number"
                              className={`form-control ${errors.number?.type ? "is-invalid" : ""}`}
                              {...register("number", { required: false, pattern: /.{2,}/ })}
                              aria-invalid={errors.number ? "true" : "false"}
                            />
                          </div>
                          <div className="col-12 col-lg-4">
                            <label htmlFor="apartment">Complemento</label>
                            <input
                              id="apartment"
                              className={`form-control ${errors.apartment?.type ? "is-invalid" : ""}`}
                              {...register("apartment", {
                                required: false,
                                pattern: /.{2,}/,
                              })}
                              aria-invalid={errors.apartment ? "true" : "false"}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row"></div>
                    </div>
                  </div>
                  <div className="modal-footer justify-content-between">
                    <div className="">
                      <button
                        type="button"
                        id="userStatus"
                        className={`btn btn-${watch("userStatus") ? "success" : "danger"} me-2`}
                        onClick={(e) => {
                          e.preventDefault();
                          setValue("userStatus", !getValues("userStatus"));
                        }}
                      >
                        {watch("userStatus") ? "Confirmado" : "Pendente"} (Clique para alterar)
                      </button>
                    </div>
                    <div className="">
                      <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">
                        Cancelar
                      </button>
                      <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                        Salvar
                      </button>
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

export default ListUsers;
