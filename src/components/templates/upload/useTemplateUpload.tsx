
import { useState } from "react";
import { analyzePDF } from "@/lib/pdf";
import { uploadTemplate } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";

export const useTemplateUpload = (setOpen: (open: boolean) => void) => {
  const queryClient = useQueryClient();
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

  return {
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
  };
};
