import React, { useEffect } from "react";
import { useState } from "react";
import { useFieldArray, Controller } from "react-hook-form";
import { toast } from "react-toastify";

const EditCategories = (props) => {
  const categories = props.event.categories;
  const control = props.control;

  const [targetCategory, setTargetCategory] = useState("");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "category", // unique name for your Field Array
    rules: {
      required: "Por favor, insira pelo menos 1 categoria.",
    },
    mode: "onChange",
  });

  useEffect(() => {
    // Set default values for fields on initial render
    if (fields.length === 0) {
      append(categories);
    }
  }, []);

  return (
    <div className="p-lg-3">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="mt-3">Categorias</h2>
        <button
          className="btn btn-success h-25"
          onClick={(e) => {
            e.preventDefault();
            append({});
          }}
        >
          Adicionar
        </button>
      </div>
      <hr />
      {fields.map((field, index) => (
        <div className="row" key={`category-${index}`}>
          <div className="col-12 col-lg-3">
            <input
              type="text"
              name="categoryId"
              id="categoryId"
              defaultValue={field.category_id || null}
              className={`d-none`}
              {...props.register(`category.${index}.category_id`, { required: false })}
            />
            <label htmlFor="categoryName" className="form-label">
              Nome da Categoria
            </label>
            <input
              type="text"
              name="categoryName"
              id="categoryName"
              defaultValue={field.category_name}
              className={`form-control ${props.errors.category && props.errors.category[index]?.name ? "is-invalid" : ""}`}
              onChange={(e) => console.log(e)}
              {...props.register(`category.${index}.category_name`, { required: true })}
            />
          </div>
          <div className="col-6 col-lg-2 mt-2 mt-lg-0">
            <label htmlFor="categoryMinAge" className="form-label">
              Idade mínima
            </label>
            <input
              type="number"
              name="minAge"
              id="categoryMinAge"
              defaultValue={field.category_minage}
              className={`form-control ${props.errors.category && props.errors.category[index]?.minAge ? "is-invalid" : ""}`}
              {...props.register(`category.${index}.category_minAge`, { required: true })}
            />
          </div>
          <div className="col-6 col-lg-2 mt-2 mt-lg-0">
            <label htmlFor="categoryMaxAge" className="form-label">
              Idade máxima
            </label>
            <input
              type="number"
              name="maxAge"
              id="categoryMaxAge"
              defaultValue={field.category_maxage}
              className={`form-control ${props.errors.category && props.errors.category[index]?.maxAge ? "is-invalid" : ""}`}
              {...props.register(`category.${index}.category_maxAge`, { required: true })}
            />
          </div>
          <div className="col-12 col-lg-2 mt-2 mt-lg-0">
            <label htmlFor="categoryGender" className="form-label">
              Sexo
            </label>
            <select
              defaultValue={field.category_gender}
              className={`form-select ${props.errors.category && props.errors.category[index]?.gender ? "is-invalid" : ""}`}
              aria-label="Default select example"
              id="categoryGender"
              name="categoryGender"
              {...props.register(`category.${index}.category_gender`, { required: true })}
            >
              <option value="" disabled>
                Selecione
              </option>
              <option value="unisex">Unissex</option>
              <option value="masc">Masc.</option>
              <option value="fem">Fem.</option>
            </select>
          </div>
          <div className="col-6 col-lg-2 mt-2 mt-lg-0">
            <label htmlFor="categoryPrice" className="form-label">
              Preço
            </label>
            <div className="input-group">
              <span className="input-group-text" id="basic-addon1">
                R$
              </span>
              <input
                type="number"
                name="categoryPrice"
                id="categoryPrice"
                defaultValue={field.category_price}
                className={`form-control ${props.errors.category && props.errors.category[index]?.price ? "is-invalid" : ""}`}
                {...props.register(`category.${index}.category_price`, { required: true })}
              />
            </div>
          </div>
          <div className="col-6 col-lg-1 mt-2 mt-lg-0 d-flex align-items-end">
            <button
              type="button"
              style={{ maxHeight: "42px", maxWidth: "60px" }}
              className="btn btn-danger form-control"
              data-bs-toggle="modal"
              data-bs-target={`#deleteCategoryModal-${field.category_id}`}
            >
              <i className="bi bi-x-circle"></i>
            </button>
            <div
              className="modal fade"
              id={`deleteCategoryModal-${field.category_id}`}
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Remover Categoria - {field.category_name}
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    Para remover uma categoria, você precisa escolher uma categoria para receber os inscritos da categoria a ser removida. Selecione a
                    categoria alvo abaixo e confirme a remoção.
                    <form className="mt-2">
                      <select className="form-select" aria-label="Categoria Alvo" defaultValue="" onChange={(e) => setTargetCategory(e.target.value)}>
                        <option value="" disabled>
                          Selecionar
                        </option>
                        {fields
                          .filter((category) => category.category_id !== field.category_id && category.category_id)
                          .map((category) => (
                            <option key={`${field.category_id}-option-${category.category_id}`} value={category.category_id}>
                              {category.category_name}
                            </option>
                          ))}
                      </select>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      onClick={(e) => {
                        e.preventDefault();
                        setTargetCategory("");
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={async (e) => {
                        e.preventDefault();
                        if (field.category_id) {
                          try {
                            const myHeaders = new Headers();
                            myHeaders.append("Content-Type", "application/json");
                            myHeaders.append("token", localStorage.token);

                            const response = await fetch(`/api/categories/${field.category_id}/${targetCategory}`, {
                              method: "DELETE",
                              headers: myHeaders,
                            });
                            const parseResponse = await response.json();
                            if (parseResponse.type === "success") {
                              remove(index);
                            }
                            toast[parseResponse.type](parseResponse.message, { theme: "colored" });
                          } catch (err) {
                            console.log(err);
                          }
                          return;
                        }
                        remove(index);
                        setTargetCategory("");
                      }}
                      disabled={!targetCategory}
                      data-bs-dismiss="modal"
                    >
                      Remover Categoria
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-3" />
        </div>
      ))}
    </div>
  );
};

export default EditCategories;
