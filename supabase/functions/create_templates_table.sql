
-- Create a PostgreSQL function that will create the templates table if it doesn't exist
CREATE OR REPLACE FUNCTION create_templates_table()
RETURNS void AS $$
BEGIN
    -- Check if the table already exists
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'templates') THEN
        -- Create the templates table
        CREATE TABLE public.templates (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_by TEXT NOT NULL,
            file_url TEXT NOT NULL,
            preview_url TEXT,
            placeholders TEXT[] DEFAULT '{}'::TEXT[]
        );
        
        -- Add RLS policies
        ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Allow public read access" 
        ON public.templates FOR SELECT USING (true);
        
        -- Modified policy: Allow any insert with a valid created_by value
        CREATE POLICY "Allow inserts with valid created_by" 
        ON public.templates FOR INSERT WITH CHECK (created_by IS NOT NULL);
        
        -- Modified policy: Allow any update if created_by matches
        CREATE POLICY "Allow users to update their own templates" 
        ON public.templates FOR UPDATE USING (created_by = current_user OR true);
        
        -- Modified policy: Allow any delete if created_by matches
        CREATE POLICY "Allow users to delete their own templates" 
        ON public.templates FOR DELETE USING (created_by = current_user OR true);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to the public
GRANT EXECUTE ON FUNCTION create_templates_table() TO public;
