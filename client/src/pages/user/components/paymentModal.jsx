import React, { Fragment } from "react";

import Payments from "../../payment/payments";

const PaymentModal = ({ registration }) => {
  return (
    <Fragment>
      <button type="button" className="btn btn-success form-control me-2 mt-2 h-50" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Pagar
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {registration.event_name}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <Payments id={registration.payment_id} registration={registration} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PaymentModal;
