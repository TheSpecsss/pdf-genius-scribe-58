// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hjwoucsonjirhptpbwsk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqd291Y3NvbmppcmhwdHBid3NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MDQwMDMsImV4cCI6MjA1NzE4MDAwM30.u-KZ4CFGw3Q8VHuNaGq3t4yX6Ida7Zul8Zzrbg7alpk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);