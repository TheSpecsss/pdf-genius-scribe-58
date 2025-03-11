
import React from "react";
import FormField from "../FormField";

const FieldsContainer = () => {
  return (
    <div className="space-y-4 mb-6">
      <FormField label="Full Name" />
      <FormField label="Date of Contract" />
      <FormField label="Contract Amount" />
    </div>
  );
};

export default FieldsContainer;
