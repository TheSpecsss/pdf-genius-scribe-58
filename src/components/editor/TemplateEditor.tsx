
import React, { useState, useEffect } from "react";
import { TemplateMetadata, generatePDF, AIResponse } from "@/lib/pdf";
import { getFontStyle, FontInfo } from "@/lib/fonts";
import { fetchAICompletion } from "@/lib/api";
import { toast } from "sonner";
import EditorForm from "./EditorForm";
import PreviewPanel from "./PreviewPanel";

interface TemplateEditorProps {
  template: TemplateMetadata;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ template }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [aiSuggestions, setAISuggestions] = useState<Record<string, string>>({});
  const [fontInfo, setFontInfo] = useState<FontInfo | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [aiResponse, setAIResponse] = useState<AIResponse | null>(null);
  
  useEffect(() => {
    const initialData: Record<string, string> = {};
    template.placeholders.forEach((placeholder) => {
      initialData[placeholder] = "";
    });
    setFormData(initialData);
    
    setFontInfo({
      fontFamily: "Times New Roman",
      fontSize: 12,
      fontWeight: 400,
      fontStyle: "normal",
    });
  }, [template]);
  
  const handleFieldChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleAIFill = async () => {
    setIsLoadingAI(true);
    
    try {
      const response = await fetchAICompletion(
        template.placeholders,
        `This is a ${template.name} template with placeholders for ${template.placeholders.join(", ")}.`,
        formData
      );
      
      setAIResponse(response);
      setAISuggestions(response.auto_filled_data);
      
      toast.success("AI suggestions generated successfully!");
    } catch (error) {
      console.error("Error generating AI suggestions:", error);
      toast.error("Failed to generate AI suggestions");
    } finally {
      setIsLoadingAI(false);
    }
  };
  
  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const result = await generatePDF(template.id, formData, aiResponse || undefined);
      toast.success("PDF generated successfully!");
      
      setTimeout(() => {
        toast("Download would start in a real implementation");
      }, 1000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <EditorForm
          template={template}
          formData={formData}
          aiSuggestions={aiSuggestions}
          fontInfo={fontInfo}
          isLoadingAI={isLoadingAI}
          isGeneratingPDF={isGeneratingPDF}
          onFieldChange={handleFieldChange}
          onAIFill={handleAIFill}
          onGeneratePDF={handleGeneratePDF}
        />
      </div>
      
      <div className="md:col-span-1">
        <PreviewPanel
          template={template}
          formData={formData}
          aiSuggestions={aiSuggestions}
          fontInfo={fontInfo}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
};

export default TemplateEditor;
