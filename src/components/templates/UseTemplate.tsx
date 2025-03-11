
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { TemplateMetadata } from "@/lib/pdf";
import TemplateStepsModal from "./use/TemplateStepsModal";

interface UseTemplateProps {
  template: TemplateMetadata;
}

const UseTemplate: React.FC<UseTemplateProps> = ({ template }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setModalOpen(true)} className="flex-1">
        Use Template
      </Button>
      
      <TemplateStepsModal 
        template={template}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
};

export default UseTemplate;
