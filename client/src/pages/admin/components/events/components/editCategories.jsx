import React, { useEffect } from "react";
import { useFieldArray } from "react-hook-form";

const EditCategories = (props) => {
  const categories = props.event.categories;

  const control = props.control;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "category", // unique name for your Field Array
    rules: {
      required: "Por favor, insira pelo menos 1 categoria.",
    },
    mode: "onChange",
    defaultValue: categories,
  });

  useEffect(() => {
    // Set default values for fields on initial render
    if (fields.length === 0) {
      append(categories);
    }
  }, [append, fields, categories]);

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
            <label htmlFor="categoryName" className="form-label">
              Nome da Categoria
            </label>
            <input
              type="text"
              name="categoryName"
              id="categoryName"
              defaultValue={field.category_name}
              className={`form-control ${
                props.errors.category && props.errors.category[index]?.name
                  ? "is-invalid"
                  : props.getValues(`category.${index}.name`)
                  ? "is-valid"
                  : ""
              }`}
              onChange={(e) => console.log(e)}
              {...props.register(`category.${index}.name`, { required: true })}
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
              className={`form-control ${
                props.errors.category && props.errors.category[index]?.minAge
                  ? "is-invalid"
                  : props.getValues(`category.${index}.name`)
                  ? "is-valid"
                  : ""
              }`}
              {...props.register(`category.${index}.minAge`, { required: true })}
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
              className={`form-control ${
                props.errors.category && props.errors.category[index]?.maxAge
                  ? "is-invalid"
                  : props.getValues(`category.${index}.name`)
                  ? "is-valid"
                  : ""
              }`}
              {...props.register(`category.${index}.maxAge`, { required: true })}
            />
          </div>
          <div className="col-12 col-lg-2 mt-2 mt-lg-0">
            <label htmlFor="categoryGender" className="form-label">
              Sexo
            </label>
            <select
              defaultValue={field.category_gender}
              className={`form-select ${
                props.errors.category && props.errors.category[index]?.gender
                  ? "is-invalid"
                  : props.getValues(`category.${index}.gender`)
                  ? "is-valid"
                  : ""
              }`}
              aria-label="Default select example"
              id="categoryGender"
              name="categoryGender"
              {...props.register(`category.${index}.gender`, { required: true })}
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
                className={`form-control ${
                  props.errors.category && props.errors.category[index]?.price
                    ? "is-invalid"
                    : props.getValues(`category.${index}.name`)
                    ? "is-valid"
                    : ""
                }`}
                {...props.register(`category.${index}.price`, { required: true })}
              />
            </div>
          </div>
          <div className="col-6 col-lg-1 mt-2 mt-lg-0 d-flex align-items-end">
            <button
              style={{ maxHeight: "42px", maxWidth: "60px" }}
              className="btn btn-danger form-control"
              onClick={(e) => {
                e.preventDefault();
                if (fields.length < 2) {
                  return;
                }
                remove(index);
              }}
              disabled={fields.length < 2}
            >
              <i className="bi bi-x-circle"></i>
            </button>
          </div>
          <hr className="my-3" />
        </div>
      ))}
    </div>
  );
};

export default EditCategories;
