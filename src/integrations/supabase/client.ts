import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://ikzgrktaaawjiaqnxwfx.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlremdya3RhYWF3amlhcW54d2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4OTA4NzksImV4cCI6MjA2MjQ2Njg3OX0.uQXjaE2ihXCJkSZWRcvm0hm3xltGxXCT4upzRMRQHr0";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    }
  }
);

// Export the keys for manual fetch requests
export { SUPABASE_URL, SUPABASE_ANON_KEY };