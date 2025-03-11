
import React from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import StepIndicator, { Step } from "./StepIndicator";

interface ModalHeaderProps {
  title: string;
  currentStep: number;
  steps: Step[];
  isSubmitting: boolean;
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  currentStep,
  steps,
  isSubmitting,
  onClose,
}) => {
  return (
    <DialogHeader className="p-6 pb-2">
      <div className="absolute right-4 top-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          disabled={isSubmitting}
          className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <DialogTitle className="text-xl flex items-center gap-2">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {title}
      </DialogTitle>
      
      <StepIndicator steps={steps} currentStep={currentStep} />
    </DialogHeader>
  );
};

export default ModalHeader;
