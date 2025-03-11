
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateMetadata } from "@/lib/pdf";
import { FontInfo } from "@/lib/fonts";

interface PreviewPanelProps {
  template: TemplateMetadata;
  formData: Record<string, string>;
  aiSuggestions: Record<string, string>;
  fontInfo: FontInfo | null;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  template,
  formData,
  aiSuggestions,
  fontInfo,
  activeTab,
  onTabChange,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
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
  );
};

export default PreviewPanel;
