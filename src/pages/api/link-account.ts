
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ikzgrktaaawjiaqnxwfx.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlremdya3RhYWF3amlhcW54d2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4OTA4NzksImV4cCI6MjA2MjQ2Njg3OX0.uQXjaE2ihXCJkSZWRcvm0hm3xltGxXCT4upzRMRQHr0";

export default async function handler(req: Request): Promise<Response> {
  // Set CORS headers to allow external apps
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: corsHeaders }
    );
  }

  try {
    // Create Supabase client for server-side auth
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    
    // Try to get user from Authorization header first (for API usage)
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
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Parse request body
    const body = await req.json();
    const { externalAppUserId } = body;

    if (!externalAppUserId) {
      return new Response(
        JSON.stringify({ error: 'externalAppUserId is required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate externalAppUserId format
    if (typeof externalAppUserId !== 'string' || externalAppUserId.length < 1 || externalAppUserId.length > 255) {
      return new Response(
        JSON.stringify({ error: 'Invalid externalAppUserId format' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Insert the linked account record
    const { data, error: insertError } = await supabase
      .from('linked_accounts')
      .insert({
        supabase_user_id: user.id,
        external_user_id: externalAppUserId
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      
      // Handle unique constraint violation
      if (insertError.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'Account already linked' }),
          { status: 409, headers: corsHeaders }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to link account' }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Link account error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
}
