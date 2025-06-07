
import { supabase } from '@/integrations/supabase/client';

export default async function handler(req: Request): Promise<Response> {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (req.method !== 'POST') {
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
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers }
      );
    }

    const token = authHeader.substring(7);
    
    // Get user from token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers }
      );
    }

    // Parse request body
    const body = await req.json();
    const { externalAppUserId } = body;

    if (!externalAppUserId) {
      return new Response(
        JSON.stringify({ error: 'externalAppUserId is required' }),
        { status: 400, headers }
      );
    }

    // Create authenticated supabase client with the user's token
    const supabaseWithAuth = supabase;
    
    // Insert the linked account record
    const { data, error: insertError } = await supabaseWithAuth
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
          { status: 409, headers }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to link account' }),
        { status: 500, headers }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        linkedAccount: {
          id: data.id,
          supabase_user_id: data.supabase_user_id,
          external_user_id: data.external_user_id,
          created_at: data.created_at
        }
      }),
      { status: 201, headers }
    );
  } catch (error) {
    console.error('Link account error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers }
    );
  }
}
