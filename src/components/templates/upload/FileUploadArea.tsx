
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { File } from "lucide-react";

interface FileUploadAreaProps {
  file: File | null;
  isUploading: boolean;
  isAnalyzing: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setPlaceholders: React.Dispatch<React.SetStateAction<string[]>>;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ 
  file, 
  isUploading, 
  isAnalyzing,
  onFileChange,
  setFile,
  setPlaceholders
}) => {
  if (!file) {
    return (
      <div className="flex flex-col space-y-2">
        <Label htmlFor="file">PDF File</Label>
        <div className="flex items-center justify-center border-2 border-dashed rounded-md p-6 border-muted-foreground/25">
          <label className="flex flex-col items-center justify-center cursor-pointer space-y-2">
            <div className="rounded-full bg-primary/10 p-2">
              <File className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-medium">
              Click to upload PDF
            </span>
            <span className="text-xs text-muted-foreground">
              PDF files only
            </span>
            <Input
              id="file"
              type="file"
              accept=".pdf"
              onChange={onFileChange}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor="file">PDF File</Label>
      <div className="flex items-center justify-between border rounded-md p-3">
        <div className="flex items-center space-x-3">
          <div className="rounded-full bg-primary/10 p-2">
            <File className="h-5 w-5 text-primary" />
          </div>
          <div className="text-sm">
            <p className="font-medium">{file.name}</p>
            <p className="text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setFile(null);
            setPlaceholders([]);
          }}
          disabled={isUploading || isAnalyzing}
        >
          Change
        </Button>
      </div>
    </div>
  );
};

export default FileUploadArea;
