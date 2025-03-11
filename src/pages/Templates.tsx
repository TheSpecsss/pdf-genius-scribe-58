
import React from "react";
import Navbar from "@/components/layout/Navbar";
import TemplateList from "@/components/templates/TemplateList";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { TemplateMetadata } from "@/lib/pdf";

const Templates = () => {
  // Mock template data
  const mockTemplates: TemplateMetadata[] = [
    {
      id: "1",
      name: "Invoice Template",
      createdAt: new Date(2023, 5, 15),
      createdBy: "user1",
      previewUrl: "/placeholder.svg",
      placeholders: ["company", "client", "amount", "date"],
    },
    {
      id: "2",
      name: "Contract Agreement",
      createdAt: new Date(2023, 7, 3),
      createdBy: "user1",
      previewUrl: "/placeholder.svg",
      placeholders: ["party1", "party2", "terms", "date", "signature"],
    },
    {
      id: "3",
      name: "Certificate Template",
      createdAt: new Date(2023, 9, 22),
      createdBy: "user1",
      previewUrl: "/placeholder.svg",
      placeholders: ["name", "course", "date", "instructor"],
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Templates</h1>
            <p className="text-muted-foreground mt-1">
              Browse and manage your PDF templates
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <UploadCloud className="h-4 w-4" />
            Upload New Template
          </Button>
        </div>
        <TemplateList templates={mockTemplates} />
      </main>
    </div>
  );
};

export default Templates;
