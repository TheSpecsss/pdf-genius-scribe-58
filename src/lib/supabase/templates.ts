
import { extendedSupabase } from "./config";
import { ensureTemplatesTableExists, ensureTemplatesBucketExists } from "./infrastructure";
import { TemplateMetadata } from "../pdf";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Template related operations
export async function fetchTemplates(): Promise<TemplateMetadata[]> {
  try {
    // Make sure the table exists before querying
    const tableExists = await ensureTemplatesTableExists();
    if (!tableExists) {
      return [];
    }
    
    // Now we can safely query the table
    const { data, error } = await extendedSupabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching templates:", error);
      throw error;
    }

    return data?.map(template => ({
      id: template.id,
      name: template.name,
      createdAt: new Date(template.created_at),
      createdBy: template.created_by,
      previewUrl: template.preview_url || "/placeholder.svg",
      placeholders: template.placeholders || [],
    })) || [];
  } catch (error) {
    console.error("Failed to fetch templates:", error);
    toast.error("Failed to fetch templates");
    return [];
  }
}

export async function uploadTemplate(
  file: File, 
  metadata: Omit<TemplateMetadata, 'id' | 'previewUrl'>
): Promise<TemplateMetadata | null> {
  try {
    // Make sure the table and bucket exist before uploading
    const [tableExists, bucketExists] = await Promise.all([
      ensureTemplatesTableExists(),
      ensureTemplatesBucketExists()
    ]);
    
    if (!tableExists || !bucketExists) {
      toast.error("Failed to set up infrastructure for template upload");
      return null;
    }
    
    // 1. Upload the PDF file to storage
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${fileName}`;
    
    const { error: uploadError } = await supabase
      .storage
      .from('templates')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error("Error uploading template file:", uploadError);
      throw uploadError;
    }
    
    // 2. Get the public URL
    const { data: urlData } = await supabase
      .storage
      .from('templates')
      .getPublicUrl(filePath);
      
    const fileUrl = urlData.publicUrl;
    
    // 3. Create a preview image (in a real implementation)
    // For this demo, we'll use a placeholder
    const previewUrl = "/placeholder.svg";
    
    // 4. Insert template metadata into the database
    const { data, error: dbError } = await extendedSupabase
      .from('templates')
      .insert({
        name: metadata.name,
        created_by: metadata.createdBy,
        file_url: fileUrl,
        preview_url: previewUrl,
        placeholders: metadata.placeholders,
      })
      .select()
      .single();
      
    if (dbError) {
      console.error("Error saving template metadata:", dbError);
      throw dbError;
    }
    
    if (data) {
      return {
        id: data.id,
        name: data.name,
        createdAt: new Date(data.created_at),
        createdBy: data.created_by,
        previewUrl: data.preview_url || previewUrl,
        placeholders: data.placeholders || [],
      };
    }
    
    return null;
  } catch (error) {
    console.error("Failed to upload template:", error);
    toast.error("Failed to upload template");
    return null;
  }
}

export async function deleteTemplate(id: string): Promise<boolean> {
  try {
    // First get the template to find the file path
    const { data: template, error: fetchError } = await extendedSupabase
      .from('templates')
      .select('file_url')
      .eq('id', id)
      .single();
      
    if (fetchError) {
      console.error("Error fetching template for deletion:", fetchError);
      throw fetchError;
    }
    
    // Extract the file path from the URL
    if (template && template.file_url) {
      const filePathMatch = template.file_url.match(/templates\/(.+)$/);
      if (filePathMatch && filePathMatch[1]) {
        const filePath = filePathMatch[1];
        
        // Delete the file from storage
        const { error: storageError } = await supabase
          .storage
          .from('templates')
          .remove([filePath]);
          
        if (storageError) {
          console.error("Error deleting template file:", storageError);
          // Continue anyway to delete the database entry
        }
      }
    }
    
    // Delete the template record
    const { error: dbError } = await extendedSupabase
      .from('templates')
      .delete()
      .eq('id', id);
      
    if (dbError) {
      console.error("Error deleting template record:", dbError);
      throw dbError;
    }
    
    return true;
  } catch (error) {
    console.error("Failed to delete template:", error);
    toast.error("Failed to delete template");
    return false;
  }
}
