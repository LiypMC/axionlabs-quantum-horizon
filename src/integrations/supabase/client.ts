import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ikzgrktaaawjiaqnxwfx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlremdya3RhYWF3amlhcW54d2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4OTA4NzksImV4cCI6MjA2MjQ2Njg3OX0.uQXjaE2ihXCJkSZWRcvm0hm3xltGxXCT4upzRMRQHr0";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});