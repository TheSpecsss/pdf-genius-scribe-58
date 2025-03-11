import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TemplateMetadata, generatePDF, AIResponse } from "@/lib/pdf";
import { fetchAICompletion } from "@/lib/api";
import { toast } from "sonner";
import ProvideInfoStep from "./steps/ProvideInfoStep";
import ConfirmationStep from "./steps/ConfirmationStep";
import PreviewStep from "./steps/PreviewStep";
import { X, Loader2, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateStepsModalProps {
  template: TemplateMetadata;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export type TemplateStepData = {
  userInput: string;
  formData: Record<string, string>;
  aiResponse: AIResponse | null;
  generatedPdfUrl: string | null;
};

const TemplateStepsModal: React.FC<TemplateStepsModalProps> = ({
  template,
  open,
  onOpenChange,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [stepData, setStepData] = useState<TemplateStepData>({
    userInput: "",
    formData: {},
    aiResponse: null,
    generatedPdfUrl: null,
  });

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      // Reset state after modal is closed
      setTimeout(() => {
        setCurrentStep(1);
        setStepData({
          userInput: "",
          formData: {},
          aiResponse: null,
          generatedPdfUrl: null,
        });
      }, 300);
    }
  };

  const processAICompletion = async (userInput: string) => {
    setIsSubmitting(true);
    try {
      // Get AI suggestions based on user input
      const aiResponse = await fetchAICompletion(
        template.placeholders,
        `This is a ${template.name} template with placeholders for ${template.placeholders.join(", ")}.`,
        { userContext: userInput }
      );

      // Update state with AI response
      setStepData((prev) => ({
        ...prev,
        userInput,
        aiResponse,
        formData: {
          ...prev.formData,
          ...aiResponse.auto_filled_data,
        },
      }));

      // Move to next step
      setCurrentStep(2);
    } catch (error) {
      console.error("Error processing AI completion:", error);
      toast.error("Failed to process your information. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePreview = async () => {
    setIsSubmitting(true);
    try {
      // Generate PDF with filled data
      const result = await generatePDF(
        template.id,
        stepData.formData,
        stepData.aiResponse || undefined
      );

      // Update state with generated PDF URL
      setStepData((prev) => ({
        ...prev,
        generatedPdfUrl: result.downloadUrl,
      }));

      // Move to final step
      setCurrentStep(3);
    } catch (error) {
      console.error("Error generating PDF preview:", error);
      toast.error("Failed to generate PDF preview. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
    if (stepData.generatedPdfUrl) {
      // In a real implementation, this would trigger the download
      // For now, we'll show a success message
      toast.success("PDF downloaded successfully!");
      handleClose();
    }
  };

  const updateFormData = (key: string, value: string) => {
    setStepData((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [key]: value,
      },
    }));
  };

  // Render appropriate step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProvideInfoStep
            template={template}
            userInput={stepData.userInput}
            isSubmitting={isSubmitting}
            onUpdateInput={(input) => setStepData((prev) => ({ ...prev, userInput: input }))}
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

  const steps = [
    { id: 1, name: "Provide information" },
    { id: 2, name: "Confirm details" },
    { id: 3, name: "Preview and download" },
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <div className="absolute right-4 top-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <DialogTitle className="text-xl flex items-center gap-2">
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {template.name}
          </DialogTitle>
          
          {/* Step indicator */}
          <div className="flex items-center w-full mt-4 mb-2">
            {steps.map((step, i) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div 
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                      currentStep > step.id 
                        ? "bg-primary border-primary text-primary-foreground" 
                        : currentStep === step.id 
                          ? "border-primary text-primary" 
                          : "border-muted-foreground text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? (
                      <CircleCheck className="h-4 w-4" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  <span 
                    className={cn(
                      "text-xs mt-1", 
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.name}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div 
                    className={cn(
                      "h-[2px] flex-1 mx-1",
                      currentStep > i + 1 ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">{renderStepContent()}</div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateStepsModal;
