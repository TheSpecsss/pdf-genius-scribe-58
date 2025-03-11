
import React from "react";
import Navbar from "@/components/layout/Navbar";
import TemplateList from "@/components/templates/TemplateList";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

const Templates = () => {
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
        <TemplateList />
      </main>
    </div>
  );
};

export default Templates;
