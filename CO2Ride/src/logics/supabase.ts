import { createClient,SupabaseClient } from '@supabase/supabase-js';

// Substitua com suas credenciais do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
