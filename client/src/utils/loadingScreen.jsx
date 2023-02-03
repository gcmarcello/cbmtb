import React from "react";

const LoadingScreen = () => {
  return (
    <div className="d-flex justify-content-center align-items-center w-100 vh-100">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
