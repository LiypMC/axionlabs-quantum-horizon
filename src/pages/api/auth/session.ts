
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ikzgrktaaawjiaqnxwfx.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlremdya3RhYWF3amlhcW54d2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4OTA4NzksImV4cCI6MjA2MjQ2Njg3OX0.uQXjaE2ihXCJkSZWRcvm0hm3xltGxXCT4upzRMRQHr0";

export default async function handler(req: Request): Promise<Response> {
  // Set CORS headers to allow external apps
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: corsHeaders }
    );
  }

  try {
    // Create Supabase client for server-side auth
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    
    // Try to get session from Authorization header first (for API usage)
    const authHeader = req.headers.get('authorization');
    let user = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: { user: authUser }, error } = await supabase.auth.getUser(token);
      if (!error && authUser) {
        user = authUser;
      }
    }
    
    // If no user from Bearer token, try to get from cookie
    if (!user) {
      const cookieHeader = req.headers.get('cookie');
      if (cookieHeader) {
        // Parse cookies manually to get the access token
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);
        
        // Look for Supabase session tokens in cookies
        const accessToken = cookies['supabase-auth-token'] || cookies['sb-access-token'];
        if (accessToken) {
          const { data: { user: cookieUser }, error } = await supabase.auth.getUser(accessToken);
          if (!error && cookieUser) {
            user = cookieUser;
          }
        }
      }
    }

    if (!user) {
      return new Response(
        JSON.stringify({ isLoggedIn: false }),
        { status: 200, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({
        isLoggedIn: true,
        user: {
          id: user.id,
          email: user.email,
        }
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Session check error:', error);
    return new Response(
      JSON.stringify({ isLoggedIn: false }),
      { status: 200, headers: corsHeaders }
    );
  }
}
