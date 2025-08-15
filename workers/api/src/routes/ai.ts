// AI endpoints for chat completions and related features
import { Router } from 'itty-router';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import { AIService, ChatMessage, AIRequest } from '../services/ai';
import { DatabaseService } from '../services/database';
import { Env } from '../types';

export function createAIRoutes() {
  const router = Router({ base: '/v1/ai' });

  // Get available models
  router.get('/models', async (request: Request, env: Env) => {
    try {
      const aiService = new AIService(env);
      const models = aiService.getAvailableModels();

      return createSuccessResponse('Available AI models', {
        models,
        default_model: aiService.getDefaultModel()
      });
    } catch (error) {
      return createErrorResponse('Failed to get models', {
        error: (error as Error).message
      });
    }
  });

  // Chat completions endpoint
  router.post('/chat', async (request: Request, env: Env) => {
    try {
      const body = await request.json() as {
        model?: string;
        messages: ChatMessage[];
        temperature?: number;
        max_tokens?: number;
        stream?: boolean;
        system_prompt?: string;
        conversation_id?: string;
        user_id?: string;
      };

      // Validation
      if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
        return createErrorResponse('Messages array is required and cannot be empty');
      }

      const aiService = new AIService(env);
      const dbService = new DatabaseService(env);

      // Validate model
      const model = body.model || aiService.getDefaultModel();
      if (!aiService.isValidModel(model)) {
        return createErrorResponse('Invalid model specified');
      }

      // Content moderation for user messages
      const userMessages = body.messages.filter(m => m.role === 'user');
      for (const message of userMessages) {
        const moderation = await aiService.moderateContent(message.content);
        if (moderation.flagged) {
          return createErrorResponse('Content violates usage policies', {
            categories: moderation.categories
          });
        }
      }

      // Build conversation context
      const contextMessages = aiService.buildConversationContext(body.messages);

      const aiRequest: AIRequest = {
        model: model as any,
        messages: contextMessages,
        temperature: body.temperature,
        max_tokens: body.max_tokens,
        stream: body.stream,
        system_prompt: body.system_prompt
      };

      // Handle streaming response
      if (body.stream) {
        const stream = await aiService.generateStream(aiRequest);
        
        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
          }
        });
      }

      // Generate response
      const response = await aiService.generateResponse(aiRequest);

      // Store conversation if IDs provided
      if (body.conversation_id && body.user_id) {
        try {
          // Store user message
          await dbService.createMessage({
            conversation_id: body.conversation_id,
            user_id: body.user_id,
            role: 'user',
            content: body.messages[body.messages.length - 1].content
          });

          // Store assistant response
          await dbService.createMessage({
            conversation_id: body.conversation_id,
            role: 'assistant',
            content: response.response,
            model_used: model,
            tokens_used: response.usage.total_tokens
          });
        } catch (dbError) {
          console.error('Failed to store conversation:', dbError);
          // Continue with response even if storage fails
        }
      }

      return createSuccessResponse('Chat completion generated', {
        response: response.response,
        usage: response.usage,
        model: response.model,
        processing_time: response.processing_time,
        finish_reason: response.finish_reason
      });

    } catch (error) {
      return createErrorResponse('Failed to generate chat completion', {
        error: (error as Error).message
      });
    }
  });

  // Text completion endpoint (simpler interface)
  router.post('/complete', async (request: Request, env: Env) => {
    try {
      const body = await request.json() as {
        prompt: string;
        model?: string;
        temperature?: number;
        max_tokens?: number;
        system_prompt?: string;
      };

      if (!body.prompt) {
        return createErrorResponse('Prompt is required');
      }

      const aiService = new AIService(env);
      
      // Convert prompt to messages format
      const messages: ChatMessage[] = [
        { role: 'user', content: body.prompt }
      ];

      const model = body.model || aiService.getDefaultModel();
      if (!aiService.isValidModel(model)) {
        return createErrorResponse('Invalid model specified');
      }

      // Content moderation
      const moderation = await aiService.moderateContent(body.prompt);
      if (moderation.flagged) {
        return createErrorResponse('Content violates usage policies', {
          categories: moderation.categories
        });
      }

      const aiRequest: AIRequest = {
        model: model as any,
        messages,
        temperature: body.temperature,
        max_tokens: body.max_tokens,
        stream: false,
        system_prompt: body.system_prompt
      };

      const response = await aiService.generateResponse(aiRequest);

      return createSuccessResponse('Text completion generated', {
        completion: response.response,
        usage: response.usage,
        model: response.model,
        processing_time: response.processing_time
      });

    } catch (error) {
      return createErrorResponse('Failed to generate completion', {
        error: (error as Error).message
      });
    }
  });

  // Text embeddings endpoint
  router.post('/embeddings', async (request: Request, env: Env) => {
    try {
      const body = await request.json() as {
        text: string;
      };

      if (!body.text) {
        return createErrorResponse('Text is required');
      }

      const aiService = new AIService(env);
      const embeddings = await aiService.generateEmbeddings(body.text);

      return createSuccessResponse('Embeddings generated', {
        embeddings,
        dimensions: embeddings.length,
        text_length: body.text.length
      });

    } catch (error) {
      return createErrorResponse('Failed to generate embeddings', {
        error: (error as Error).message
      });
    }
  });

  // Content moderation endpoint
  router.post('/moderate', async (request: Request, env: Env) => {
    try {
      const body = await request.json() as {
        content: string;
      };

      if (!body.content) {
        return createErrorResponse('Content is required');
      }

      const aiService = new AIService(env);
      const moderation = await aiService.moderateContent(body.content);

      return createSuccessResponse('Content moderated', moderation);

    } catch (error) {
      return createErrorResponse('Failed to moderate content', {
        error: (error as Error).message
      });
    }
  });

  return router;
}