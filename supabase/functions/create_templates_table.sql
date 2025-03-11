
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
        
        CREATE POLICY "Allow authenticated insert access" 
        ON public.templates FOR INSERT WITH CHECK (auth.role() = 'authenticated');
        
        CREATE POLICY "Allow users to update their own templates" 
        ON public.templates FOR UPDATE USING (auth.uid()::text = created_by);
        
        CREATE POLICY "Allow users to delete their own templates" 
        ON public.templates FOR DELETE USING (auth.uid()::text = created_by);
    END IF;

    -- Create the templates bucket if it doesn't exist
    BEGIN
        -- We need to use dynamic SQL here because storage.buckets is not always available in all environments
        EXECUTE 'SELECT count(*) FROM storage.buckets WHERE name = ''templates''' INTO STRICT v_count;
        IF v_count = 0 THEN
            -- Insert the bucket into storage.buckets
            EXECUTE 'INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES (''templates'', ''templates'', true, 10485760, ''{application/pdf}'')';
            
            -- Create bucket policies
            EXECUTE 'INSERT INTO storage.policies (name, definition, bucket_id) VALUES 
                (''Public Read Access'', ''{"roleName": "anon", "allowedOperations": ["SELECT"]}'', ''templates'')';
            EXECUTE 'INSERT INTO storage.policies (name, definition, bucket_id) VALUES 
                (''Authenticated Users Upload'', ''{"roleName": "authenticated", "allowedOperations": ["INSERT", "UPDATE", "DELETE"]}'', ''templates'')';
        END IF;
        EXCEPTION WHEN undefined_table THEN
            -- Storage schema not available, log a notice
            RAISE NOTICE 'Storage schema not available. Bucket creation skipped.';
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to the public
GRANT EXECUTE ON FUNCTION create_templates_table() TO public;
