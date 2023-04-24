import React, { useEffect, Fragment } from "react";
import { useState } from "react";
import { useFieldArray, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import LoadingScreen from "../../../../../utils/loadingScreen";

const EditCoupons = (props) => {
  const coupons = props.event.coupons;
  const control = props.control;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "coupon", // unique name for your Field Array
    mode: "onChange",
  });

  useEffect(() => {
    // Set default values for fields on initial render
    props.setIsLoading(true);
    if (fields.length === 0) {
      append(coupons);
    }
    props.setIsLoading(false);
  }, []);

  if (props.isLoading) {
    return <LoadingScreen />;
  }
  console.log(props.event);
  return (
    <div className="p-lg-3">
      <div className="d-flex align-items-center justify-content-between mt-2">
        {coupons.length > 1 ? (
          <div className="d-flex flex-wrap justify-content-lg-evenly flex-fill">
            <div class="card text-white bg-danger mb-3 me-2" style={{ maxWidth: "18rem", minWidth: "10rem" }}>
              <div class="card-header">Vagas Totais</div>
              <div class="card-body">
                <h5 class="card-title text-center">
                  {props.event.coupons.reduce((accumulator, currentValue) => accumulator.coupon_uses + currentValue.coupon_uses) +
                    props.event.event_max_attendees}
                </h5>
              </div>
            </div>
            <div class="card text-white bg-primary mb-3 me-2" style={{ maxWidth: "18rem", minWidth: "10rem" }}>
              <div class="card-header">Vagas</div>
              <div class="card-body">
                <h5 class="card-title text-center">{props.event.event_max_attendees}</h5>
              </div>
            </div>
            <div class="card text-white bg-success mb-3 me-2" style={{ maxWidth: "18rem", minWidth: "10rem" }}>
              <div class="card-header">Cupons</div>
              <div class="card-body">
                <h5 class="card-title text-center">
                  {props.event.coupons.reduce((accumulator, currentValue) => accumulator.coupon_uses + currentValue.coupon_uses)}
                </h5>
              </div>
            </div>
            <div class="card text-white bg-secondary mb-3 me-2" style={{ maxWidth: "18rem", minWidth: "10rem" }}>
              <div class="card-header">Inscrições</div>
              <div class="card-body">
                <h5 class="card-title text-center">{<div>{props.event.registrations.length}</div>}</h5>
              </div>
            </div>

            <div class="card bg-warning mb-3 me-2" style={{ maxWidth: "18rem", minWidth: "10rem" }}>
              <div class="card-header">Cupons Utilizados</div>
              <div class="card-body">
                <h5 class="card-title text-center">{props.event.registrations.filter((registration) => registration.coupon_link).length}</h5>
              </div>
            </div>
          </div>
        ) : (
          <p>Adicione um cupom para começar.</p>
        )}
      </div>
      <hr />
      {fields.map((field, index) => (
        <div key={`coupon-${index}`}>
          <div className="row">
            <div className="col-12 col-lg-5">
              <input
                type="hidden"
                name={`coupon[${index}].coupon_id`}
                id={`coupon[${index}].coupon_id`}
                defaultValue={field.coupon_id || null}
                {...props.register(`coupon.${index}.coupon_id`)}
              />
              <label htmlFor="couponName" className="form-label">
                Link do Cupom
              </label>

              <input
                type="text"
                name={`coupon[${index}].coupon_link`}
                id={`coupon[${index}].coupon_link`}
                defaultValue={field.coupon_link}
                className={`form-control ${props.errors.coupon && props.errors.coupon[index]?.coupon_link ? "is-invalid" : ""}`}
                {...props.register(`coupon.${index}.coupon_link`, { required: true })}
              />
              {field.coupon_id && (
                <small id="couponLink" className="form-text text-muted">
                  {`${window.location.origin.split("//")[1]}/inscricao/${props.event.event_link}/${field.coupon_link}`}
                </small>
              )}
            </div>
            <div className="col-12 col-lg-7">
              <div className="row">
                <div className="col-12 col-lg-4">
                  <label htmlFor="couponName" className="form-label">
                    Desconto (Em Breve)
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      name={`category[${index}].coupon_discount`}
                      id={`category[${index}].coupon_discount`}
                      defaultValue={field.coupon_discount}
                      className={`form-control ${props.errors.category && props.errors.category[index]?.coupon_discount ? "is-invalid" : ""}`}
                      disabled
                    />
                    <span className="input-group-text" id="basic-addon1">
                      %
                    </span>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <label htmlFor="couponName" className="form-label">
                    Máximo de Usos
                  </label>
                  <input
                    type="number"
                    name={`coupon[${index}].coupon_uses`}
                    id={`coupon[${index}].coupon_uses`}
                    defaultValue={field.coupon_uses}
                    className={`form-control ${props.errors.coupon && props.errors.coupon[index]?.name ? "is-invalid" : ""}`}
                    onChange={(e) => console.log(e)}
                    {...props.register(`coupon.${index}.coupon_uses`, { required: true })}
                  />
                </div>
                <div className="col-6 col-lg-4 mt-3 mt-lg-0 d-flex align-items-end">
                  <button
                    type="button"
                    className="btn btn-danger me-2 flex-fill"
                    onClick={(e) => {
                      e.preventDefault();
                      remove(index);
                    }}
                  >
                    <i className="bi bi-x-circle"></i>
                  </button>
                  <button type="button" className="btn btn-primary flex-fill" data-bs-toggle="modal" data-bs-target={`#couponModal-${index}`}>
                    <div className="d-flex justify-content-center">
                      <i className="bi bi-people-fill me-2"></i>
                      {props.event.registrations.filter((registration) => registration.coupon_link === field.coupon_link).length}
                    </div>
                  </button>
                  <button
                    className="btn btn-secondary ms-2 flex-fill"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin.split("//")[1]}/inscricao/${props.event.event_link}/${field.coupon_link}`
                      );
                      toast.success("Link Copiado com Sucesso!", { theme: "colored" });
                    }}
                  >
                    <i className="bi bi-clipboard"></i>
                  </button>
                </div>

                <div
                  className="modal fade"
                  id={`couponModal-${index}`}
                  tabIndex="-1"
                  aria-labelledby={`#couponModalLabel-${index}`}
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id={`#couponModalLabel-${index}`}>
                          Inscrições do Cupom - {field.coupon_link}
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>

                      <div className="modal-body">
                        {props.event.registrations
                          .filter((registration) => registration.coupon_link === field.coupon_link)
                          .map((registration) => (
                            <p>
                              {registration.user_first_name} {registration.user_last_name}
                            </p>
                          ))}
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-3" />
        </div>
      ))}
      <div className="d-flex justify-content-end">
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
    </div>
  );
};

export default EditCoupons;
