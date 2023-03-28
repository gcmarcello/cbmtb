import React from "react";

const LoadingScreen = () => {
  return (
    <div className="w-100 h-100">
      <div className="d-flex bg-white justify-content-center align-items-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
