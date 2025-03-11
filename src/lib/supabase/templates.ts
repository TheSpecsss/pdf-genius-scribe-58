
import { extendedSupabase } from "./config";
import { ensureTemplatesTableExists, ensureTemplatesBucketExists } from "./infrastructure";
import { TemplateMetadata } from "../pdf";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "../auth";

// Template related operations
export async function fetchTemplates(): Promise<TemplateMetadata[]> {
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
    placeholders: template.placeholders || [],
  })) || [];
}

export async function uploadTemplate(
  file: File, 
  metadata: Omit<TemplateMetadata, 'id'>
): Promise<TemplateMetadata | null> {
  // Get current user
  const currentUser = getCurrentUser();
  if (!currentUser) {
    console.warn("No logged in user, using demo user ID");
    // Continue with upload as we now have open policies
  }

  // Make sure the table exists before uploading
  const tableExists = await ensureTemplatesTableExists();
  const bucketExists = await ensureTemplatesBucketExists();
  
  if (!tableExists || !bucketExists) {
    throw new Error("Failed to set up infrastructure for template upload");
  }
  
  // 1. Upload the PDF file to storage
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `${fileName}`;
  
  console.log("Uploading file to storage:", filePath);
  
  // Configure the request with the appropriate headers for auth
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('templates')
    .upload(filePath, file, {
      // Use upsert to overwrite if file exists
      upsert: true,
    });
    
  if (uploadError) {
    console.error("Error uploading template file:", uploadError);
    throw uploadError;
  }
  
  console.log("File uploaded successfully:", uploadData);
  
  // 2. Get the public URL
  const { data: urlData } = await supabase
    .storage
    .from('templates')
    .getPublicUrl(filePath);
    
  const fileUrl = urlData.publicUrl;
  console.log("Public URL generated:", fileUrl);
  
  // 3. Insert template metadata into the database
  // Use the user ID from getCurrentUser() or a demo value
  const createdBy = currentUser?.id || "demo-user";
  console.log("Creating template with created_by:", createdBy);
  
  const { data, error: dbError } = await extendedSupabase
    .from('templates')
    .insert({
      name: metadata.name,
      created_by: createdBy,
      file_url: fileUrl,
      placeholders: metadata.placeholders,
    })
    .select()
    .single();
    
  if (dbError) {
    console.error("Error saving template metadata:", dbError);
    throw dbError;
  }
  
  console.log("Template metadata saved successfully:", data);
  
  if (data) {
    return {
      id: data.id,
      name: data.name,
      createdAt: new Date(data.created_at),
      createdBy: data.created_by,
      placeholders: data.placeholders || [],
    };
  }
  
  return null;
}

export async function updateTemplate(
  id: string,
  updates: { name?: string; placeholders?: string[] }
): Promise<TemplateMetadata | null> {
  // Get current user
  const currentUser = getCurrentUser();
  if (!currentUser) {
    console.warn("No logged in user, using demo user ID");
    // Continue with update as we now have open policies
  }

  // Verify the table exists
  const tableExists = await ensureTemplatesTableExists();
  if (!tableExists) {
    throw new Error("Templates table does not exist");
  }
  
  console.log("Updating template:", id, updates);
  
  // Update the template record
  const { data, error } = await extendedSupabase
    .from('templates')
    .update({
      name: updates.name,
      placeholders: updates.placeholders,
    })
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating template:", error);
    throw error;
  }
  
  console.log("Template updated successfully:", data);
  
  if (data) {
    return {
      id: data.id,
      name: data.name,
      createdAt: new Date(data.created_at || ''),
      createdBy: data.created_by,
      placeholders: data.placeholders || [],
    };
  }
  
  return null;
}

export async function deleteTemplate(id: string): Promise<boolean> {
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
}
