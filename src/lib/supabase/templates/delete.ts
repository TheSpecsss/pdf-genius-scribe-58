
import { extendedSupabase } from "../config";
import { supabase } from "@/integrations/supabase/client";

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
