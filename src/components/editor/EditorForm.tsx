
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TemplateMetadata } from "@/lib/pdf";
import { FontInfo } from "@/lib/fonts";
import { Download } from "lucide-react";

interface EditorFormProps {
  template: TemplateMetadata;
  formData: Record<string, string>;
  aiSuggestions: Record<string, string>;
  fontInfo: FontInfo | null;
  isLoadingAI: boolean;
  isGeneratingPDF: boolean;
  onFieldChange: (name: string, value: string) => void;
  onAIFill: () => void;
  onGeneratePDF: () => void;
}

const EditorForm: React.FC<EditorFormProps> = ({
  template,
  formData,
  aiSuggestions,
  fontInfo,
  isLoadingAI,
  isGeneratingPDF,
  onFieldChange,
  onAIFill,
  onGeneratePDF,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{template.name}</h2>
        <Button
          onClick={onGeneratePDF}
          disabled={isGeneratingPDF}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {isGeneratingPDF ? "Generating..." : "Generate PDF"}
        </Button>
      </div>

      <div className="grid gap-4">
        {template.placeholders.map((placeholder) => (
          <div key={placeholder} className="space-y-2">
            <Label htmlFor={placeholder}>
              {placeholder.split("_").join(" ")}
            </Label>
            <Input
              id={placeholder}
              value={formData[placeholder] || ""}
              onChange={(e) => onFieldChange(placeholder, e.target.value)}
              placeholder={
                aiSuggestions[placeholder]
                  ? `AI Suggestion: ${aiSuggestions[placeholder]}`
                  : `Enter ${placeholder.split("_").join(" ")}`
              }
            />
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={onAIFill}
        disabled={isLoadingAI}
        className="w-full"
      >
        {isLoadingAI ? "Generating AI Suggestions..." : "Generate AI Suggestions"}
      </Button>
    </div>
  );
};

export default EditorForm;
