
import { useState } from "react";
import { toast } from "sonner";
import { TemplateMetadata, generatePDF, AIResponse } from "@/lib/pdf";
import { fetchAICompletion } from "@/lib/api";
import { Step } from "../components/StepIndicator";

export type TemplateStepData = {
  userInput: string;
  formData: Record<string, string>;
  aiResponse: AIResponse | null;
  generatedPdfUrl: string | null;
};

export const useTemplateSteps = (template: TemplateMetadata, onClose: () => void) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [stepData, setStepData] = useState<TemplateStepData>({
    userInput: "",
    formData: {},
    aiResponse: null,
    generatedPdfUrl: null,
  });

  const resetState = () => {
    setCurrentStep(1);
    setStepData({
      userInput: "",
      formData: {},
      aiResponse: null,
      generatedPdfUrl: null,
    });
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      // Reset state after modal is closed
      setTimeout(resetState, 300);
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
      console.log("Starting PDF generation with template ID:", template.id);
      
      if (!template.id) {
        throw new Error("Template ID is missing");
      }
      
      // Generate PDF with filled data
      const result = await generatePDF(
        template.id,
        stepData.formData,
        stepData.aiResponse || undefined
      );

      if (!result || !result.downloadUrl) {
        throw new Error("Failed to generate PDF");
      }

      // Update state with generated PDF URL
      setStepData((prev) => ({
        ...prev,
        generatedPdfUrl: result.downloadUrl,
      }));

      // Move to final step
      setCurrentStep(3);
      
      // Log success for debugging
      console.log("PDF generated successfully:", result.downloadUrl);
    } catch (error) {
      console.error("Error generating PDF preview:", error);
      toast.error("Failed to generate PDF preview. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
    if (stepData.generatedPdfUrl) {
      if (stepData.generatedPdfUrl.startsWith('blob:')) {
        // For blob URLs created with URL.createObjectURL
        const link = document.createElement("a");
        link.href = stepData.generatedPdfUrl;
        link.download = `${template.name.replace(/\s+/g, '-')}-${new Date().getTime()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL after download
        setTimeout(() => URL.revokeObjectURL(stepData.generatedPdfUrl), 100);
      } else {
        // For regular URLs (like fallback PDF)
        window.open(stepData.generatedPdfUrl, '_blank');
      }
      
      toast.success("PDF downloaded successfully!");
      handleClose();
    } else {
      toast.error("No PDF available to download");
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

  return {
    currentStep,
    isSubmitting,
    stepData,
    handleClose,
    processAICompletion,
    generatePreview,
    handleDownload,
    updateFormData,
    setCurrentStep,
    setStepData,
  };
};

export const TEMPLATE_STEPS: Step[] = [
  { id: 1, name: "Provide information" },
  { id: 2, name: "Confirm details" },
  { id: 3, name: "Preview and download" },
];
