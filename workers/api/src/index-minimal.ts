// Minimal working API to test basic functionality
export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);
      
      // Basic health check
      if (url.pathname === '/health/ping') {
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
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        });
      }
      
      // Registration endpoint
      if (url.pathname === '/auth/register' && request.method === 'POST') {
        try {
          const body = await request.json();
          
          // Basic validation
          if (!body.email || !body.password) {
            return new Response(JSON.stringify({
              success: false,
              error: 'Email and password are required'
            }), {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              }
            });
          }
          
          // Check if user already exists
          const existingUser = await env.DB.prepare(
            'SELECT id FROM users WHERE email = ?'
          ).bind(body.email).first();
          
          if (existingUser) {
            return new Response(JSON.stringify({
              success: false,
              error: 'User with this email already exists'
            }), {
              status: 409,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              }
            });
          }
          
          // Create user (simplified - in production use proper password hashing)
          const userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
          
          await env.DB.prepare(`
            INSERT INTO users (id, email, password_hash, full_name, organization_id, email_verified, account_status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `).bind(
            userId,
            body.email,
            body.password, // In production: use bcrypt hash
            body.full_name || null,
            'default-org',
            false,
            'active'
          ).run();
          
          return new Response(JSON.stringify({
            success: true,
            message: 'User registered successfully',
            data: {
              user: {
                id: userId,
                email: body.email,
                full_name: body.full_name || null
              }
            }
          }), {
            status: 201,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
          });
          
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Registration failed',
            details: (error as Error).message
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            }
          });
        }
      }
      
      // Login endpoint
      if (url.pathname === '/auth/login' && request.method === 'POST') {
        try {
          const body = await request.json();
          
          if (!body.email || !body.password) {
            return new Response(JSON.stringify({
              success: false,
              error: 'Email and password are required'
            }), {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              }
            });
          }
          
          // Find user (simplified password check)
          const user = await env.DB.prepare(
            'SELECT id, email, password_hash, full_name, role FROM users WHERE email = ? AND deleted_at IS NULL'
          ).bind(body.email).first();
          
          if (!user || user.password_hash !== body.password) {
            return new Response(JSON.stringify({
              success: false,
              error: 'Invalid email or password'
            }), {
              status: 401,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              }
            });
          }
          
          return new Response(JSON.stringify({
            success: true,
            message: 'Login successful',
            data: {
              user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role
              },
              access_token: 'temp_token_' + Date.now(),
              redirectUrl: 'https://axionslab.com'
            }
          }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
          });
          
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Login failed',
            details: (error as Error).message
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            }
          });
        }
      }
      
      // AI chat endpoint
      if (url.pathname === '/v1/ai/chat' && request.method === 'POST') {
        try {
          const body = await request.json();
          
          if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
            return new Response(JSON.stringify({
              success: false,
              error: 'Messages array is required and cannot be empty'
            }), {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              }
            });
          }

          // Use Cloudflare Workers AI
          const model = body.model || '@cf/meta/llama-3.2-1b-preview';
          const messages = body.messages;
          
          // Add system prompt if provided
          if (body.system_prompt) {
            messages.unshift({
              role: 'system',
              content: body.system_prompt
            });
          }

          const aiResponse = await env.AI.run(model, {
            messages: messages,
            temperature: body.temperature || 0.7,
            max_tokens: body.max_tokens || 2048,
            stream: false
          });

          return new Response(JSON.stringify({
            success: true,
            message: 'Chat completion generated',
            data: {
              response: aiResponse.response || '',
              model: model,
              usage: {
                prompt_tokens: Math.ceil(JSON.stringify(messages).length / 4),
                completion_tokens: Math.ceil((aiResponse.response || '').length / 4),
                total_tokens: 0
              },
              processing_time: 0
            }
          }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
          });

        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: 'AI generation failed',
            details: (error as Error).message
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            }
          });
        }
      }

      // AI models endpoint
      if (url.pathname === '/v1/ai/models' && request.method === 'GET') {
        return new Response(JSON.stringify({
          success: true,
          message: 'Available AI models',
          data: {
            models: [
              {
                id: '@cf/meta/llama-3.2-1b-preview',
                name: 'Llama 3.2 1B',
                description: 'Fast, efficient model for general chat'
              },
              {
                id: '@cf/meta/llama-3.2-3b-preview',
                name: 'Llama 3.2 3B',
                description: 'Balanced model for enhanced reasoning'
              },
              {
                id: '@cf/meta/codellama-7b-instruct-awq',
                name: 'CodeLlama 7B',
                description: 'Specialized for code generation and analysis'
              }
            ],
            default_model: '@cf/meta/llama-3.2-1b-preview'
          }
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        });
      }

      // Handle CORS preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
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
            health: '/health/ping',
            auth: '/auth',
            timestamp: new Date().toISOString(),
          }
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        });
      }
      
      // 404 for other endpoints
      return new Response(JSON.stringify({
        success: false,
        error: 'Endpoint not found',
        path: url.pathname
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: (error as Error).message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
  },
};