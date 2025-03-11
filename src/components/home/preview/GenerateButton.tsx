
import React, { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generatePDF } from "@/lib/pdf";

const GenerateButton = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      // Use a template ID and sample data
      const templateId = "sample-template";
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
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>Generating...</>
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
