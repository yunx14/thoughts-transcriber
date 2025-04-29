import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definition for the thoughts table
export type Thought = {
  id: string;
  title: string;
  content: string;
  audio_url?: string;
  created_at: string;
  user_id?: string;
}; 