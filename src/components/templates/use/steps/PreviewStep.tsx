
import React from "react";
import { Button } from "@/components/ui/button";
import { TemplateMetadata } from "@/lib/pdf";
import { ArrowLeft, Download } from "lucide-react";

interface PreviewStepProps {
  template: TemplateMetadata;
  generatedPdfUrl: string | null;
  formData: Record<string, string>;
  onBack: () => void;
  onDownload: () => void;
}

const PreviewStep: React.FC<PreviewStepProps> = ({
  template,
  generatedPdfUrl,
  formData,
  onBack,
  onDownload,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium">Preview document</h3>
        <p className="text-sm text-muted-foreground">
          Review your completed document before downloading.
        </p>
      </div>

      <div className="bg-muted rounded-md overflow-hidden border aspect-[2/3] relative">
        {/* In a real implementation, this would be a PDF preview */}
        {/* For now, we'll use the template preview with overlays */}
        <img
          src={template.previewUrl}
          alt={template.name}
          className="object-cover w-full h-full"
        />

        {/* Display filled placeholders as overlays */}
        {Object.entries(formData).map(([key, value], index) => (
          <div
            key={key}
            className="absolute bg-primary/10 backdrop-blur-xs px-2 py-1 rounded border border-primary/20 max-w-[80%] overflow-hidden"
            style={{
              top: `${15 + (index * 15) % 70}%`,
              left: `${20 + (index * 10) % 60}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <p className="text-xs font-medium truncate">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={onDownload}
          disabled={!generatedPdfUrl}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default PreviewStep;
