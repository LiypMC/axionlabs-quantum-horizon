// AxionsLab Enterprise API - Cloudflare Workers
import { Router } from 'itty-router';

interface Env {
  DB: D1Database;
  AI: Ai;
  ENVIRONMENT: string;
  CORS_ORIGIN: string;
  JWT_SECRET: string;
}

// Database service
class DatabaseService {
  constructor(private db: D1Database) {}

  async getUser(userId: string) {
    const { results } = await this.db.prepare(
      'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL'
    ).bind(userId).all();
    return results[0] || null;
  }

  async getUserByEmail(email: string) {
    const { results } = await this.db.prepare(
      'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL'
    ).bind(email).all();
    return results[0] || null;
  }

  async createConversation(userId: string, title: string, modelId?: string) {
    const id = crypto.randomUUID();
    await this.db.prepare(
      'INSERT INTO conversations (id, user_id, title, model_id) VALUES (?, ?, ?, ?)'
    ).bind(id, userId, title, modelId || null).run();
    
    return { id, user_id: userId, title, model_id: modelId };
  }

  async getConversations(userId: string) {
    const { results } = await this.db.prepare(
      'SELECT * FROM conversations WHERE user_id = ? AND deleted_at IS NULL ORDER BY updated_at DESC'
    ).bind(userId).all();
    return results;
  }

  async getConversation(conversationId: string, userId: string) {
    const { results } = await this.db.prepare(
      'SELECT * FROM conversations WHERE id = ? AND user_id = ? AND deleted_at IS NULL'
    ).bind(conversationId, userId).all();
    return results[0] || null;
  }

  async createMessage(conversationId: string, userId: string, role: string, content: string, modelId?: string) {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    await this.db.prepare(
      'INSERT INTO messages (id, conversation_id, user_id, role, content, model_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, conversationId, userId, role, content, modelId || null, now).run();
    
    // Update conversation message count and updated_at
    await this.db.prepare(
      'UPDATE conversations SET message_count = message_count + 1, updated_at = ? WHERE id = ?'
    ).bind(now, conversationId).run();
    
    return { id, conversation_id: conversationId, user_id: userId, role, content, model_id: modelId, created_at: now };
  }

  async getMessages(conversationId: string, userId: string) {
    // Verify user owns the conversation
    const conversation = await this.getConversation(conversationId, userId);
    if (!conversation) return [];
    
    const { results } = await this.db.prepare(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC'
    ).bind(conversationId).all();
    return results;
  }

  async logUsage(userId: string, resourceType: string, resourceId: string, modelId?: string) {
    const id = crypto.randomUUID();
    await this.db.prepare(
      'INSERT INTO usage_records (id, user_id, resource_type, resource_id, model_id) VALUES (?, ?, ?, ?, ?)'
    ).bind(id, userId, resourceType, resourceId, modelId || null).run();
  }
}

// AI service
class AIService {
  constructor(private ai: Ai, private db: DatabaseService) {}

  private readonly SYSTEM_PROMPT = `You are Gideon, a highly advanced AI assistant created by AxionsLab. You are knowledgeable, helpful, and engaging. You can assist with a wide variety of tasks including:

- Answering questions and providing explanations
- Writing and editing content
- Code development and debugging
- Data analysis and research
- Creative tasks and brainstorming
- Problem-solving and strategic thinking

Always strive to be accurate, helpful, and professional in your responses. If you're unsure about something, acknowledge it rather than guessing.`;

  async generateResponse(messages: any[], modelId: string, userId: string, conversationId?: string): Promise<any> {
    try {
      // Ensure system prompt is present
      if (messages.length === 0 || messages[0].role !== 'system') {
        messages.unshift({ role: 'system', content: this.SYSTEM_PROMPT });
      }

      const startTime = Date.now();
      const response = await this.ai.run(modelId, { messages });
      const processingTime = Date.now() - startTime;

      // Log usage
      await this.db.logUsage(userId, 'chat', conversationId || 'direct', modelId);

      return {
        response: response.response || 'I apologize, but I encountered an issue generating a response. Please try again.',
        model: modelId,
        processing_time_ms: processingTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('AI generation error:', error);
      
      // Try fallback model
      try {
        const fallbackModel = '@cf/meta/llama-3.2-3b-preview';
        const fallbackResponse = await this.ai.run(fallbackModel, { messages });
        
        await this.db.logUsage(userId, 'chat', conversationId || 'direct', fallbackModel);
        
        return {
          response: fallbackResponse.response || 'Hello! I am Gideon, your AI assistant. How can I help you today?',
          model: `${fallbackModel} (fallback)`,
          processing_time_ms: 0,
          timestamp: new Date().toISOString()
        };
      } catch (fallbackError) {
        return {
          response: 'I am Gideon, your AI assistant. I can help with questions, writing, coding, analysis, and more. What would you like to work on today?',
          model: 'static-fallback',
          processing_time_ms: 0,
          timestamp: new Date().toISOString()
        };
      }
    }
  }
}

// Main router
const router = Router();

// CORS middleware
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

// Helper function to create JSON responses with CORS headers
function jsonResponse(data: any, options: { status?: number } = {}) {
  return jsonResponse(data, {
    status: options.status || 200,
    headers: corsHeaders
  });
}

// Handle preflight requests
router.options('*', () => new Response(null, { status: 204, headers: corsHeaders }));

// Health endpoint
router.get('/health', () => {
  return jsonResponse({
    success: true,
    message: 'AxionsLab API is healthy',
    data: {
      status: 'operational',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      environment: 'production'
    }
  });
});

// Root endpoint
router.get('/', () => {
  return jsonResponse({
    success: true,
    message: 'AxionsLab Enterprise API',
    data: {
      version: '2.0.0',
      service: 'axionslab-enterprise-api',
      documentation: '/docs',
      endpoints: {
        health: '/health',
        auth: '/auth/*',
        conversations: '/v1/conversations',
        ai: '/v1/ai/*'
      },
      timestamp: new Date().toISOString()
    }
  });
});

// Auth login
router.post('/auth/login', async (request, env: Env) => {
  const body = await request.json() as any;
  const db = new DatabaseService(env.DB);
  
  // Demo authentication
  if (body.email === 'demo@axionslab.com' && body.password === 'demo123') {
    const user = await db.getUserByEmail('demo@axionslab.com');
    
    return jsonResponse({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user?.id || 'demo-user',
          email: user?.email || 'demo@axionslab.com',
          full_name: user?.full_name || 'Demo User',
          role: user?.role || 'user'
        },
        access_token: 'axl_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        refresh_token: 'axlr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        expires_in: 3600
      }
    });
  }
  
  return jsonResponse({
    success: false,
    error: 'Invalid credentials',
    message: 'The email or password you entered is incorrect.'
  }, { status: 401 });
});

// Cross-domain auth callback
router.post('/auth/cross-domain/callback', async (request, env: Env) => {
  const body = await request.json() as any;
  const db = new DatabaseService(env.DB);
  
  if (body.temp_token) {
    const user = await db.getUserByEmail('demo@axionslab.com');
    
    return jsonResponse({
      success: true,
      message: 'Cross-domain authentication successful',
      data: {
        user: {
          id: user?.id || 'demo-user',
          email: user?.email || 'demo@axionslab.com',
          full_name: user?.full_name || 'Demo User',
          role: user?.role || 'user'
        },
        access_token: 'axl_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        refresh_token: 'axlr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        expires_in: 3600
      }
    });
  }
  
  return jsonResponse({
    success: false,
    error: 'Invalid temporary token'
  }, { status: 401 });
});

// Get conversations
router.get('/v1/conversations', async (request, env: Env) => {
  const authHeader = request.headers.get('Authorization');
  const userId = 'demo-user'; // In production, extract from JWT
  
  const db = new DatabaseService(env.DB);
  const conversations = await db.getConversations(userId);
  
  return jsonResponse({
    success: true,
    data: conversations
  });
});

// Create conversation
router.post('/v1/conversations', async (request, env: Env) => {
  const body = await request.json() as any;
  const userId = 'demo-user'; // In production, extract from JWT
  
  const db = new DatabaseService(env.DB);
  const conversation = await db.createConversation(
    userId,
    body.title || 'New Conversation',
    body.model
  );
  
  return jsonResponse({
    success: true,
    data: conversation
  });
});

// Get conversation messages
router.get('/v1/conversations/:id/messages', async (request, env: Env) => {
  const { id } = request.params;
  const userId = 'demo-user'; // In production, extract from JWT
  
  const db = new DatabaseService(env.DB);
  const messages = await db.getMessages(id, userId);
  
  return jsonResponse({
    success: true,
    data: messages
  });
});

// Chat completions with database storage
router.post('/v1/ai/chat/completions', async (request, env: Env) => {
  const body = await request.json() as any;
  const userId = 'demo-user'; // In production, extract from JWT
  const modelId = body.model || '@cf/meta/llama-3.2-3b-preview';
  
  const db = new DatabaseService(env.DB);
  const ai = new AIService(env.AI, db);
  
  let conversationId = body.conversation_id;
  
  // Create conversation if needed
  if (!conversationId && body.save_conversation !== false) {
    const firstUserMessage = body.messages?.find((m: any) => m.role === 'user')?.content || 'New Conversation';
    const title = firstUserMessage.substring(0, 50) + (firstUserMessage.length > 50 ? '...' : '');
    const conversation = await db.createConversation(userId, title, modelId);
    conversationId = conversation.id;
  }
  
  // Store user message if conversation exists
  if (conversationId && body.messages && body.messages.length > 0) {
    const userMessages = body.messages.filter((m: any) => m.role === 'user');
    if (userMessages.length > 0) {
      const lastUserMessage = userMessages[userMessages.length - 1];
      await db.createMessage(conversationId, userId, 'user', lastUserMessage.content, modelId);
    }
  }
  
  // Generate AI response
  const aiResponse = await ai.generateResponse(body.messages || [], modelId, userId, conversationId);
  
  // Store AI message if conversation exists
  if (conversationId) {
    await db.createMessage(conversationId, userId, 'assistant', aiResponse.response, modelId);
  }
  
  return jsonResponse({
    success: true,
    message: 'Chat completion successful',
    data: {
      ...aiResponse,
      conversation_id: conversationId
    }
  });
});

// 404 handler
router.all('*', () => {
  return jsonResponse({
    success: false,
    error: 'Endpoint not found',
    message: 'The requested endpoint does not exist.'
  }, { status: 404 });
});

// Main worker
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      return await router.fetch(request, env, ctx);
    } catch (error) {
      console.error('Worker error:', error);
      return jsonResponse({
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again.'
      }, { 
        status: 500,
        headers: corsHeaders
      });
    }
  },
};

