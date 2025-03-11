
import { extendedSupabase } from "../config";
import { ensureTemplatesTableExists, ensureTemplatesBucketExists } from "../infrastructure";
import { TemplateMetadata } from "../../pdf";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "../../auth";

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
