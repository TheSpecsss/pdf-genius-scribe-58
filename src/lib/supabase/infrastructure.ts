
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

// Check if templates storage bucket exists and attempt to create it if it doesn't
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
      // Try to create the bucket directly first
      try {
        const { error: createError } = await supabase.storage.createBucket('templates', {
          public: true,
          allowedMimeTypes: ['application/pdf'],
          fileSizeLimit: 10485760, // 10MB
        });
        
        if (!createError) {
          toast.success("Templates storage created successfully");
          return true;
        }
      } catch (directCreateError) {
        console.log("Failed to create bucket directly, will try via RPC");
      }
      
      // If direct creation failed, try to create via the RPC function
      try {
        const { error: rpcError } = await (supabase as any).rpc('create_templates_table');
        
        if (rpcError) {
          console.error("Failed to create templates bucket via RPC:", rpcError);
          toast.error("Templates storage could not be created. Please log in with admin credentials.");
          return false;
        }
        
        // Check if the bucket exists after RPC call
        const { data: updatedBuckets } = await supabase.storage.listBuckets();
        const bucketCreated = updatedBuckets?.some(bucket => bucket.name === 'templates');
        
        if (bucketCreated) {
          toast.success("Templates storage created successfully");
          return true;
        } else {
          toast.error("Templates storage not found. Please contact an administrator.");
          return false;
        }
      } catch (rpcError) {
        console.error("Error calling create_templates_table RPC:", rpcError);
        toast.error("Failed to set up storage. Please check console for details.");
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error checking templates bucket:", error);
    return false;
  }
}
