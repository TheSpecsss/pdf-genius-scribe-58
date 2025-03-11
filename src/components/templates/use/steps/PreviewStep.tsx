import React from "react";
import { Button } from "@/components/ui/button";
import { TemplateMetadata } from "@/lib/pdf";
import { ArrowLeft, Download, FileWarning } from "lucide-react";

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

      <div className="bg-muted rounded-md overflow-hidden border max-h-[60vh] relative">
        {generatedPdfUrl ? (
          // If we have a PDF URL, embed it
          <iframe
            src={generatedPdfUrl}
            className="w-full h-[60vh]"
            title="PDF Preview"
          />
        ) : (
          // Otherwise show the template preview with overlays
          <div className="aspect-[2/3] relative">
            <img
              src={template.previewUrl}
              alt={template.name}
              className="object-cover w-full h-full"
            />

            {/* Display warning if no PDF generated */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
              <FileWarning className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center px-4">
                PDF preview not available. Click "Download" to generate the document.
              </p>
            </div>

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
        )}
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
