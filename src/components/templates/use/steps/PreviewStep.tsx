
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TemplateMetadata } from "@/lib/pdf";
import { ArrowLeft, Download, FileWarning, RefreshCw } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { toast } from "sonner";

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
  const [loading, setLoading] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Reset error state when URL changes
  useEffect(() => {
    if (generatedPdfUrl) {
      setPdfError(false);
      setPdfUrl(generatedPdfUrl);
    }
  }, [generatedPdfUrl]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
  };

  const handlePdfError = (error: Error) => {
    console.error("Error loading PDF", error);
    setPdfError(true);
    setLoading(false);
    toast.error("Error loading PDF preview. You can still download the document.");
  };

  const handleDownload = () => {
    if (generatedPdfUrl) {
      onDownload();
    } else {
      toast.error("No PDF available to download");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium">Preview document</h3>
        <p className="text-sm text-muted-foreground">
          Review your completed document before downloading.
        </p>
      </div>

      <div className="bg-muted rounded-md overflow-hidden border h-[60vh] relative">
        {pdfUrl && !pdfError ? (
          <div className="w-full h-full flex flex-col items-center overflow-auto">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={handlePdfError}
              loading={
                <div className="flex items-center justify-center h-full">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              }
              className="w-full h-full flex flex-col items-center"
            >
              {numPages && (
                <Page 
                  pageNumber={pageNumber} 
                  className="my-4"
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  scale={1.2}
                />
              )}
            </Document>
            
            {numPages && numPages > 1 && (
              <div className="bg-background/80 py-2 px-4 rounded-md flex items-center gap-2 mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                  disabled={pageNumber <= 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pageNumber} of {numPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                  disabled={pageNumber >= numPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        ) : (
          // Display error or loading state
          <div className="flex flex-col items-center justify-center h-full">
            <FileWarning className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center px-4 mb-4">
              {pdfError 
                ? "Failed to load PDF preview. You can still download the document."
                : "PDF preview not available. Please wait while we generate your document."}
            </p>
            {pdfError && (
              <Button 
                variant="outline"
                size="sm"
                onClick={() => {
                  setPdfError(false);
                  setLoading(true);
                  // Force a reload after a short delay
                  setTimeout(() => {
                    if (generatedPdfUrl) {
                      setPdfUrl(null);
                      setTimeout(() => setPdfUrl(generatedPdfUrl), 50);
                    }
                    setLoading(false);
                  }, 1000);
                }}
                disabled={loading}
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh Preview
              </Button>
            )}
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
          onClick={handleDownload}
          disabled={!generatedPdfUrl && !loading}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default PreviewStep;
