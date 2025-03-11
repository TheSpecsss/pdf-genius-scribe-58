
import { createClient } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

// Extend the Database type to include our templates table
export type ExtendedDatabase = Database & {
  public: {
    Tables: {
      templates: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          created_by: string;
          file_url: string;
          placeholders?: string[];
        };
        Insert: {
          name: string;
          created_by: string;
          file_url: string;
          placeholders?: string[];
        };
        Update: {
          name?: string;
          created_by?: string;
          file_url?: string;
          placeholders?: string[];
        };
      };
    };
  };
};

// Type assertion for the extended supabase client
export const extendedSupabase = supabase as unknown as ReturnType<typeof createClient<ExtendedDatabase>>;
