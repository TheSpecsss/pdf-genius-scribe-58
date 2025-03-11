
import { supabase } from "@/integrations/supabase/client";
import { TemplateMetadata } from "./pdf";
import { toast } from "sonner";

// Template related operations
export async function fetchTemplates(): Promise<TemplateMetadata[]> {
  try {
    // Using 'any' as a temporary type assertion until the Supabase schema is properly defined
    const { data, error } = await supabase
      .from('templates' as any)
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
    // 1. Upload the PDF file to storage
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `templates/${fileName}`;
    
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
    const { data, error: dbError } = await supabase
      .from('templates' as any)
      .insert([
        {
          name: metadata.name,
          created_by: metadata.createdBy,
          file_url: fileUrl,
          preview_url: previewUrl,
          placeholders: metadata.placeholders,
        }
      ])
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
        previewUrl: data.preview_url,
        placeholders: data.placeholders,
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
    const { data: template, error: fetchError } = await supabase
      .from('templates' as any)
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
    const { error: dbError } = await supabase
      .from('templates' as any)
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
