
import React from "react";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useTemplateUpload } from "./useTemplateUpload";
import FileUploadArea from "./FileUploadArea";
import PlaceholdersList from "./PlaceholdersList";
import ErrorDisplay from "./ErrorDisplay";
import LoadingIndicator from "./LoadingIndicator";

interface UploadDialogContentProps {
  setOpen: (open: boolean) => void;
}

const UploadDialogContent: React.FC<UploadDialogContentProps> = ({ setOpen }) => {
  const {
    file,
    setFile,
    templateName,
    setTemplateName,
    isUploading,
    isAnalyzing,
    placeholders,
    setPlaceholders,
    error,
    handleFileChange,
    handleUpload
  } = useTemplateUpload(setOpen);

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Upload PDF Template</DialogTitle>
        <DialogDescription>
          Upload a PDF with placeholders marked by underscores (____).
          The system will detect these as fields to be filled.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <ErrorDisplay error={error} />
        
        <div className="flex flex-col space-y-2">
          <Label htmlFor="templateName">Template Name</Label>
          <Input
            id="templateName"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Enter template name"
            disabled={isUploading}
          />
        </div>
        
        <FileUploadArea 
          file={file} 
          isUploading={isUploading} 
          isAnalyzing={isAnalyzing}
          onFileChange={handleFileChange}
          setFile={setFile}
          setPlaceholders={setPlaceholders}
        />
        
        <LoadingIndicator isAnalyzing={isAnalyzing} />
        
        {placeholders.length > 0 && (
          <PlaceholdersList placeholders={placeholders} />
        )}
      </div>
      
      <DialogFooter className="sm:justify-between">
        <Button
          variant="outline"
          onClick={() => setOpen(false)}
          disabled={isUploading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={!file || isUploading || isAnalyzing}
          className="gap-2"
        >
          {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isUploading ? "Uploading..." : "Upload Template"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default UploadDialogContent;
