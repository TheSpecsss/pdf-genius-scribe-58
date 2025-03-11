
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TemplateMetadata } from "@/lib/pdf";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface ConfirmationStepProps {
  template: TemplateMetadata;
  formData: Record<string, string>;
  updateFormData: (key: string, value: string) => void;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  template,
  formData,
  updateFormData,
  isSubmitting,
  onBack,
  onNext,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium">Confirm details</h3>
        <p className="text-sm text-muted-foreground">
          We've analyzed your information. Please review and edit if needed.
        </p>
      </div>

      <div className="max-h-[350px] overflow-y-auto pr-2 space-y-4">
        {template.placeholders.map((placeholder) => (
          <div key={placeholder} className="space-y-2">
            <Label htmlFor={placeholder} className="text-sm">
              {placeholder.split("_").map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(" ")}
            </Label>
            <Input
              id={placeholder}
              value={formData[placeholder] || ""}
              onChange={(e) => updateFormData(placeholder, e.target.value)}
              placeholder={`Enter ${placeholder.split("_").join(" ")}`}
              disabled={isSubmitting}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          onClick={onBack}
          disabled={isSubmitting}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={isSubmitting || Object.values(formData).some(value => !value)}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
