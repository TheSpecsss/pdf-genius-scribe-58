
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
// We don't need to create it anymore since it's created by SQL migration
export async function ensureTemplatesBucketExists(): Promise<boolean> {
  try {
    // Check if the bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error("Error checking storage buckets:", bucketsError);
      return false;
    }
    
    const templatesBucketExists = buckets?.some(bucket => bucket.name === 'templates');
    
    if (!templatesBucketExists) {
      // Instead of creating the bucket (which fails due to RLS), just notify the user
      console.log("Templates bucket doesn't exist but should have been created by SQL migration");
      toast.error("Templates storage not found. Please contact an administrator.");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error checking templates bucket:", error);
    return false;
  }
}
