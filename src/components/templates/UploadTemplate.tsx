
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, File, Check, Loader2 } from "lucide-react";
import { analyzePDF } from "@/lib/pdf";
import { uploadTemplate } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/auth";

const UploadTemplate: React.FC = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    
    if (!selectedFile) {
      return;
    }
    
    // Check if file is a PDF
    if (!selectedFile.type.includes("pdf")) {
      setError("Please upload a PDF file");
      return;
    }
    
    setFile(selectedFile);
    setTemplateName(selectedFile.name.replace(".pdf", ""));
    
    // Analyze the PDF to detect placeholders
    setIsAnalyzing(true);
    try {
      const analysis = await analyzePDF(selectedFile);
      setPlaceholders(analysis.placeholders);
      console.log("PDF analyzed successfully");
    } catch (error) {
      console.error("Error analyzing PDF:", error);
      setError(`Failed to analyze PDF: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleUpload = async () => {
    setError(null);
    
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    
    if (!templateName.trim()) {
      setError("Please provide a template name");
      return;
    }
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
      // Since our policies are open, we'll use a default user ID for demo purposes
      console.warn("No logged in user found, using demo user ID");
    }
    
    setIsUploading(true);
    
    try {
      // Upload template to Supabase with current user ID or "demo-user" if not logged in
      const result = await uploadTemplate(file, {
        name: templateName,
        createdAt: new Date(),
        createdBy: currentUser?.id || "demo-user",
        placeholders,
      });
      
      if (result) {
        console.log("Template uploaded successfully");
        // Refresh templates list
        queryClient.invalidateQueries({ queryKey: ['templates'] });
        setOpen(false);
        setFile(null);
        setTemplateName("");
        setPlaceholders([]);
      }
    } catch (error) {
      console.error("Error uploading template:", error);
      setError(`Failed to upload template: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload New Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload PDF Template</DialogTitle>
          <DialogDescription>
            Upload a PDF with placeholders marked by underscores (____).
            The system will detect these as fields to be filled.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {error && (
            <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">
              {error}
            </div>
          )}
          
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
          
          <div className="flex flex-col space-y-2">
            <Label htmlFor="file">PDF File</Label>
            {!file ? (
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
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
            ) : (
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
            )}
          </div>
          
          {isAnalyzing && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
              <span className="text-sm">Analyzing PDF...</span>
            </div>
          )}
          
          {placeholders.length > 0 && (
            <div className="space-y-2">
              <Label>Detected Placeholders</Label>
              <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
                <ul className="space-y-1">
                  {placeholders.map((placeholder, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      {placeholder}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
    </Dialog>
  );
};

export default UploadTemplate;
