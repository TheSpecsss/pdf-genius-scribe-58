
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Check if templates table exists and create it if it doesn't
export async function ensureTemplatesTableExists(): Promise<boolean> {
  try {
    // Try to query the templates table to see if it exists
    const { error } = await supabase.from('templates').select('count').limit(1).single();
    
    if (error && error.code === '42P01') { // Table doesn't exist error code
      // Create the templates table
      // We need to cast supabase to any here because the type definition doesn't include our custom RPC
      const { error: createError } = await (supabase as any).rpc('create_templates_table');
      
      if (createError) {
        console.error("Failed to create templates table:", createError);
        toast.error("Failed to set up database. Please check console for details.");
        return false;
      }
      
      toast.success("Templates table created successfully");
      return true;
    } else if (error) {
      console.error("Error checking templates table:", error);
      return false;
    }
    
    // Table exists
    return true;
  } catch (error) {
    console.error("Error setting up templates table:", error);
    return false;
  }
}

// Check if templates storage bucket exists
export async function ensureTemplatesBucketExists(): Promise<boolean> {
  try {
    // Check if the bucket exists by trying to list files
    const { data, error } = await supabase.storage
      .from('templates')
      .list('', { limit: 1 });
    
    if (error) {
      console.error("Error checking templates bucket:", error);
      toast.error("Templates bucket not found. Please check your Supabase project configuration.");
      return false;
    }
    
    // If we can list files, the bucket exists and we have access
    return true;
  } catch (error) {
    console.error("Error checking templates bucket:", error);
    toast.error("Error accessing templates storage. Please check permissions.");
    return false;
  }
}
