import React, { useEffect, Fragment } from "react";
import { useState } from "react";
import { useFieldArray, Controller } from "react-hook-form";
import { toast } from "react-toastify";

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
    if (fields.length === 0) {
      append(coupons);
    }
  }, []);

  return (
    <div className="p-lg-3">
      <div className="d-flex align-items-center justify-content-end">
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
        <div className="row" key={`coupon-${index}`}>
          <div className="col-12 col-lg-7">
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
            <div className="input-group">
              <span className="input-group-text" id="basic-addon1">
                <span className="d-none d-lg-inline-block">{window.location.origin.split("//")[1]}</span>
                {`/inscricao/${props.event.event_link}/`}
              </span>
              <input
                type="text"
                name={`coupon[${index}].coupon_link`}
                id={`coupon[${index}].coupon_link`}
                defaultValue={field.coupon_link}
                className={`form-control ${props.errors.coupon && props.errors.coupon[index]?.coupon_link ? "is-invalid" : ""}`}
                {...props.register(`coupon.${index}.coupon_link`, { required: true })}
              />
            </div>
          </div>
          <div className="col-12 col-lg-2">
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
          <div className="col-12 col-lg-2">
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
          <div className="col-6 col-lg-1 mt-2 mt-lg-0 d-flex align-items-end">
            <button
              type="button"
              style={{ maxHeight: "42px", maxWidth: "60px" }}
              className="btn btn-danger form-control"
              onClick={(e) => {
                e.preventDefault();
                remove(index);
              }}
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

export default EditCoupons;
