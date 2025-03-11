import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PlaceholderField from "./PlaceholderField";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Zap, FileText, Loader2 } from "lucide-react";
import { TemplateMetadata, generatePDF } from "@/lib/pdf";
import { fetchAICompletion, AIResponse } from "@/lib/api";
import { getFontStyle, FontInfo } from "@/lib/fonts";
import { toast } from "sonner";

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
      <div className="md:col-span-2 space-y-6">
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Edit Template: {template.name}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Fill in the placeholders below or use AI to auto-fill them.
              </p>
              
              <Button
                onClick={handleAIFill}
                variant="outline"
                className="gap-2"
                disabled={isLoadingAI}
              >
                {isLoadingAI ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4 text-primary" />
                )}
                {isLoadingAI ? "Processing..." : "AI Fill"}
              </Button>
            </div>
            
            <div className="space-y-4">
              {template.placeholders.map((placeholder) => (
                <PlaceholderField
                  key={placeholder}
                  name={placeholder}
                  value={formData[placeholder] || ""}
                  onChange={handleFieldChange}
                  aiSuggestion={aiSuggestions[placeholder]}
                  fontInfo={fontInfo ? getFontStyle(fontInfo) : undefined}
                  isLoading={isLoadingAI}
                />
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2 pt-4">
            <Button
              onClick={handleGeneratePDF}
              className="gap-2"
              disabled={isGeneratingPDF || Object.values(formData).every((v) => !v)}
            >
              {isGeneratingPDF ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isGeneratingPDF ? "Generating..." : "Generate PDF"}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="md:col-span-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Preview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="aspect-[2/3] relative overflow-hidden rounded-md bg-muted flex items-center justify-center">
                  {Object.entries(formData).map(([key, value]) => {
                    if (!value && !aiSuggestions[key]) return null;
                    
                    return (
                      <div
                        key={key}
                        className="absolute bg-primary/10 backdrop-blur-xs px-2 py-1 rounded border border-primary/20"
                        style={{
                          top: `${Math.random() * 80 + 10}%`,
                          left: `${Math.random() * 60 + 20}%`,
                          transform: "translate(-50%, -50%)",
                          maxWidth: "80%",
                        }}
                      >
                        <p className="text-xs font-medium truncate">
                          {value || aiSuggestions[key]}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details" className="mt-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Template Details</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Created on {template.createdAt.toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Placeholders</h3>
                  <ul className="mt-2 space-y-1">
                    {template.placeholders.map((placeholder) => (
                      <li key={placeholder} className="text-sm">
                        • {placeholder.split("_").join(" ")}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {fontInfo && (
                  <div>
                    <h3 className="text-sm font-medium">Font Information</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {fontInfo.fontFamily}, {fontInfo.fontSize}px
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TemplateEditor;
