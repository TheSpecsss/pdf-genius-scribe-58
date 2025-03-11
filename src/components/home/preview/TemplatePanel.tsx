
import React from "react";
import TemplateHeader from "./TemplateHeader";
import FieldsContainer from "./FieldsContainer";
import GenerateButton from "./GenerateButton";

const TemplatePanel = () => {
  return (
    <div className="glass-panel p-8 rounded-2xl shadow-elevated w-full max-w-[400px]">
      <TemplateHeader title="Contract Template" />
      <FieldsContainer />
      <GenerateButton />
    </div>
  );
};

export default TemplatePanel;
