
import React, { useState, useEffect } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generatePDF } from "@/lib/pdf";
import { useQuery } from "@tanstack/react-query";
import { fetchTemplates } from "@/lib/supabase";

const GenerateButton = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Fetch available templates to use a real template ID if possible
  const { data: templates, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
    enabled: true, // Always fetch templates
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      // Use a real template ID if available, otherwise use a sample ID
      const templateId = templates && templates.length > 0 
        ? templates[0].id 
        : "sample-template";
      
      console.log("Using template ID:", templateId);
      
      const filledData = {
        full_name: "John Doe",
        date_of_contract: "2025-03-11",
        contract_amount: "$1,000.00",
        company_name: "Example Corp",
        signature: "John Doe"
      };
      
      const result = await generatePDF(templateId, filledData);
      
      // Create a download link
      const link = document.createElement("a");
      link.href = result.downloadUrl;
      link.download = result.fileName;
      link.target = "_blank";
      
      // Append to document, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      className="w-full gap-2" 
      onClick={handleGeneratePDF}
      disabled={isGenerating || isLoadingTemplates}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Generate PDF
        </>
      )}
    </Button>
  );
};

export default GenerateButton;
