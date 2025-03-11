
import { extendedSupabase } from "../config";
import { ensureTemplatesTableExists } from "../infrastructure";
import { TemplateMetadata } from "../../pdf";

// Template fetching operations
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
