
import React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import ProvideInfoStep from "./steps/ProvideInfoStep";
import ConfirmationStep from "./steps/ConfirmationStep";
import PreviewStep from "./steps/PreviewStep";
import { TemplateMetadata } from "@/lib/pdf";
import { useTemplateSteps, TEMPLATE_STEPS } from "./hooks/useTemplateSteps";
import ModalHeader from "./components/ModalHeader";

interface TemplateStepsModalProps {
  template: TemplateMetadata;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TemplateStepsModal: React.FC<TemplateStepsModalProps> = ({
  template,
  open,
  onOpenChange,
}) => {
  const {
    currentStep,
    isSubmitting,
    stepData,
    handleClose,
    processAICompletion,
    generatePreview,
    handleDownload,
    updateFormData,
    setCurrentStep
  } = useTemplateSteps(template, () => onOpenChange(false));

  // Render appropriate step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProvideInfoStep
            template={template}
            userInput={stepData.userInput}
            isSubmitting={isSubmitting}
            onUpdateInput={(input) => 
              stepData.userInput = input
            }
            onSubmit={processAICompletion}
          />
        );
      case 2:
        return (
          <ConfirmationStep
            template={template}
            formData={stepData.formData}
            updateFormData={updateFormData}
            isSubmitting={isSubmitting}
            onBack={() => setCurrentStep(1)}
            onNext={generatePreview}
          />
        );
      case 3:
        return (
          <PreviewStep
            template={template}
            generatedPdfUrl={stepData.generatedPdfUrl}
            formData={stepData.formData}
            onBack={() => setCurrentStep(2)}
            onDownload={handleDownload}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <ModalHeader 
          title={template.name}
          currentStep={currentStep}
          steps={TEMPLATE_STEPS}
          isSubmitting={isSubmitting}
          onClose={handleClose}
        />

        <div className="px-6 pb-6">{renderStepContent()}</div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateStepsModal;
