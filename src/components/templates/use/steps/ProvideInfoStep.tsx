
import React from "react";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TemplateMetadata } from "@/lib/pdf";
import { ArrowRight, Loader2 } from "lucide-react";

interface ProvideInfoStepProps {
  template: TemplateMetadata;
  userInput: string;
  isSubmitting: boolean;
  onUpdateInput: (input: string) => void;
  onSubmit: (input: string) => void;
}

const ProvideInfoStep: React.FC<ProvideInfoStepProps> = ({
  template,
  userInput,
  isSubmitting,
  onUpdateInput,
  onSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(userInput);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium">Provide information</h3>
        <p className="text-sm text-muted-foreground">
          Tell us about the details you want to include in this {template.name}. 
          Our AI will analyze your information and fill in the document accurately.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder={`e.g., This contract is for John Doe, starting on January 1, 2023, with a payment of $1,000 per month...`}
            className="min-h-[150px] resize-none"
            value={userInput}
            onChange={(e) => onUpdateInput(e.target.value)}
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground">
            Include details for placeholders: {template.placeholders.slice(0, 3).map(p => 
              p.split('_').join(' ')).join(', ')}
            {template.placeholders.length > 3 && `, and ${template.placeholders.length - 3} more`}
          </p>
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!userInput.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProvideInfoStep;
