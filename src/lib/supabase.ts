
import { createClient } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { TemplateMetadata } from "./pdf";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

// Extend the Database type to include our templates table
type ExtendedDatabase = Database & {
  public: {
    Tables: {
      templates: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          created_by: string;
          file_url: string;
          preview_url?: string;
          placeholders?: string[];
        };
        Insert: {
          name: string;
          created_by: string;
          file_url: string;
          preview_url?: string;
          placeholders?: string[];
        };
        Update: {
          name?: string;
          created_by?: string;
          file_url?: string;
          preview_url?: string;
          placeholders?: string[];
        };
      };
    };
  };
};

// Type assertion for the extended supabase client
const extendedSupabase = supabase as unknown as ReturnType<typeof createClient<ExtendedDatabase>>;

// Check if templates table exists and create it if it doesn't
export async function ensureTemplatesTableExists(): Promise<boolean> {
  try {
    // Try to query the templates table to see if it exists
    const { error } = await extendedSupabase.from('templates').select('count').limit(1).single();
    
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

// Check if templates storage bucket exists and create it if it doesn't
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
      // Create the templates bucket with public access
      const { error: createError } = await supabase.storage.createBucket('templates', {
        public: true,
        allowedMimeTypes: ['application/pdf'],
        fileSizeLimit: 10485760, // 10MB
      });
      
      if (createError) {
        console.error("Failed to create templates bucket:", createError);
        toast.error("Failed to set up storage. Please check console for details.");
        return false;
      }
      
      toast.success("Templates storage created successfully");
    }
    
    return true;
  } catch (error) {
    console.error("Error setting up templates bucket:", error);
    return false;
  }
}

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
