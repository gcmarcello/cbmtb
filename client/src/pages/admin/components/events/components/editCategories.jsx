import React from "react";
import Table from "../../table";

const EditCategories = (props) => {
  return (
    <div className="p-lg-3">
      <Table data={props.event.categories} />
    </div>
  );
};

export default EditCategories;
