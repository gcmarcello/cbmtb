import React, { Fragment } from "react";

const ImagePreview = ({ isImageSelected, imagePreview, modalId }) => {
  return (
    <Fragment>
      {isImageSelected ? (
        <div className="modal fade" id="eventImageModal" tabIndex="-1" aria-labelledby="eventImageModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id={`${modalId}`}>
                  Preview da Imagem
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <img src={imagePreview} alt="Imagem do Evento" style={{ maxWidth: "100%" }} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </Fragment>
  );
};

export default ImagePreview;
