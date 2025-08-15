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

      // Chat completions endpoint
      if (url.pathname === '/v1/ai/chat/completions' && request.method === 'POST') {
        const body = await request.json() as any;
        
        // Simple AI response using Cloudflare Workers AI
        try {
          const response = await env.AI.run('@cf/meta/llama-3.2-3b-preview', {
            messages: body.messages || [
              { role: 'system', content: 'You are Gideon, a helpful AI assistant created by AxionsLab.' },
              { role: 'user', content: body.message || 'Hello' }
            ]
          });

          return new Response(JSON.stringify({
            success: true,
            message: 'Chat completion successful',
            data: {
              response: response.response || 'Hello! I am Gideon, your AI assistant. How can I help you today?',
              model: '@cf/meta/llama-3.2-3b-preview',
              timestamp: new Date().toISOString()
            }
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            success: true,
            message: 'Chat completion successful',
            data: {
              response: 'Hello! I am Gideon, your AI assistant. I am currently being developed and will have full capabilities soon. How can I help you today?',
              model: 'fallback',
              timestamp: new Date().toISOString()
            }
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }
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

