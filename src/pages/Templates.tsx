import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import TemplateList from "@/components/templates/TemplateList";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { fetchTemplates, ensureTemplatesTableExists, ensureTemplatesBucketExists } from "@/lib/supabase";
import UploadTemplate from "@/components/templates/UploadTemplate";
import { toast } from "sonner";

const Templates = () => {
  const queryClient = useQueryClient();
  
  // Check if the infrastructure is ready
  useEffect(() => {
    const setupInfrastructure = async () => {
      try {
        const [tableExists, bucketExists] = await Promise.all([
          ensureTemplatesTableExists(),
          ensureTemplatesBucketExists()
        ]);
        
        if (tableExists && bucketExists) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
        }
      } catch (error) {
        console.error("Failed to initialize Supabase infrastructure:", error);
        toast.error(`Failed to connect to the database: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
    
    setupInfrastructure();
  }, [queryClient]);
  
  // Fetch templates from Supabase
  const { data: templates, isLoading, error } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container py-8 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading templates...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container py-8">
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold mb-2">Failed to load templates</h2>
            <p className="text-muted-foreground mb-4">
              There was an error loading your templates. Please try again.
            </p>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['templates'] })}>
              Retry
            </Button>
          </div>
        </main>
      </div>
    );
  }

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
          <UploadTemplate />
        </div>
        <TemplateList templates={templates || []} />
      </main>
    </div>
  );
};

export default Templates;
