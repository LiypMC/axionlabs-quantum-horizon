
import { supabase } from '@/integrations/supabase/client';

export default async function handler(req: Request): Promise<Response> {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ isLoggedIn: false }),
        { status: 200, headers }
      );
    }

    const token = authHeader.substring(7);
    
    // Get user from token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return new Response(
        JSON.stringify({ isLoggedIn: false }),
        { status: 200, headers }
      );
    }

    return new Response(
      JSON.stringify({
        isLoggedIn: true,
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        }
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Session check error:', error);
    return new Response(
      JSON.stringify({ isLoggedIn: false }),
      { status: 200, headers }
    );
  }
}
