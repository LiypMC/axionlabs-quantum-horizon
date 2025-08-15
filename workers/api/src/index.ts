// Simple working API
export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
      // Health endpoint
      if (url.pathname === '/health' || url.pathname === '/health/ping') {
        return new Response(JSON.stringify({
          success: true,
          message: 'API is healthy',
          data: {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'axionlabs-api'
          }
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Auth login endpoint
      if (url.pathname === '/auth/login' && request.method === 'POST') {
        const body = await request.json() as any;
        
        // Demo login
        if (body.email === 'demo@axionslab.com' && body.password === 'demo123') {
          return new Response(JSON.stringify({
            success: true,
            message: 'Login successful',
            data: {
              user: {
                id: 'demo-user',
                email: 'demo@axionslab.com',
                full_name: 'Demo User'
              },
              access_token: 'demo-token-' + Date.now(),
              refresh_token: 'demo-refresh-' + Date.now()
            }
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }
        
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid credentials'
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Root endpoint
      if (url.pathname === '/') {
        return new Response(JSON.stringify({
          success: true,
          message: 'AxionLabs API is running',
          data: {
            version: '1.0.0',
            service: 'axionlabs-api',
            health: '/health',
            auth: '/auth',
            timestamp: new Date().toISOString()
          }
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // 404
      return new Response(JSON.stringify({
        success: false,
        error: 'Endpoint not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });

    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  },
};

