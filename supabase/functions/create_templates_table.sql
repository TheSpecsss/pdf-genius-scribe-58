
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
        
        -- Completely open insert policy - no restrictions
        CREATE POLICY "Allow all inserts" 
        ON public.templates FOR INSERT WITH CHECK (true);
        
        -- Open update policy
        CREATE POLICY "Allow all updates" 
        ON public.templates FOR UPDATE USING (true);
        
        -- Open delete policy
        CREATE POLICY "Allow all deletes" 
        ON public.templates FOR DELETE USING (true);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to the public
GRANT EXECUTE ON FUNCTION create_templates_table() TO public;
