
import { extendedSupabase } from "../config";
import { ensureTemplatesTableExists } from "../infrastructure";
import { TemplateMetadata } from "../../pdf";
import { getCurrentUser } from "../../auth";

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
