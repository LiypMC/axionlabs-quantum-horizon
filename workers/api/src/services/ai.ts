// Cloudflare Workers AI service
import { Env } from '../types';

// Available AI models
export const AI_MODELS = {
  LLAMA_32_1B: '@cf/meta/llama-3.2-1b-preview',
  LLAMA_32_3B: '@cf/meta/llama-3.2-3b-preview', 
  LLAMA_32_11B: '@cf/meta/llama-3.2-11b-vision-preview',
  CODELLAMA: '@cf/meta/codellama-7b-instruct-awq',
  MISTRAL: '@cf/mistral/mistral-7b-instruct-v0.1',
  EMBEDDINGS: '@cf/baai/bge-base-en-v1.5'
} as const;

export type AIModel = typeof AI_MODELS[keyof typeof AI_MODELS];

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIRequest {
  model: AIModel;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  system_prompt?: string;
}

export interface AIResponse {
  response: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
  processing_time: number;
  finish_reason: string;
}

export interface AIStreamChunk {
  response: string;
  done: boolean;
}

export class AIService {
  private ai: any;
  private env: Env;

  constructor(env: Env) {
    this.ai = env.AI;
    this.env = env;
  }

  // Generate chat completion
  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      // Prepare messages with system prompt if provided
      let messages = [...request.messages];
      if (request.system_prompt) {
        messages.unshift({
          role: 'system',
          content: request.system_prompt
        });
      }

      const response = await this.ai.run(request.model, {
        messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 2048,
        stream: false
      });

      const processingTime = Date.now() - startTime;

      return {
        response: response.response || '',
        usage: {
          prompt_tokens: this.estimateTokens(messages.map(m => m.content).join(' ')),
          completion_tokens: this.estimateTokens(response.response || ''),
          total_tokens: 0 // Will be calculated
        },
        model: request.model,
        processing_time: processingTime,
        finish_reason: 'stop'
      };
    } catch (error) {
      throw new Error(`AI generation failed: ${(error as Error).message}`);
    }
  }

  // Generate streaming response
  async generateStream(request: AIRequest): Promise<ReadableStream> {
    try {
      // Prepare messages with system prompt if provided
      let messages = [...request.messages];
      if (request.system_prompt) {
        messages.unshift({
          role: 'system',
          content: request.system_prompt
        });
      }

      const response = await this.ai.run(request.model, {
        messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 2048,
        stream: true
      });

      return new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of response) {
              const data: AIStreamChunk = {
                response: chunk.response || '',
                done: false
              };
              
              controller.enqueue(new TextEncoder().encode(
                `data: ${JSON.stringify(data)}\n\n`
              ));
            }
            
            // Send final chunk
            const finalData: AIStreamChunk = {
              response: '',
              done: true
            };
            controller.enqueue(new TextEncoder().encode(
              `data: ${JSON.stringify(finalData)}\n\n`
            ));
            
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        }
      });
    } catch (error) {
      throw new Error(`AI streaming failed: ${(error as Error).message}`);
    }
  }

  // Generate text embeddings
  async generateEmbeddings(text: string): Promise<number[]> {
    try {
      const response = await this.ai.run(AI_MODELS.EMBEDDINGS, {
        text: [text]
      });

      return response.data[0] || [];
    } catch (error) {
      throw new Error(`Embeddings generation failed: ${(error as Error).message}`);
    }
  }

  // Content moderation
  async moderateContent(content: string): Promise<{
    flagged: boolean;
    categories: string[];
    confidence: number;
  }> {
    try {
      // Basic content moderation using embeddings and keyword matching
      const toxicKeywords = [
        'hate', 'violence', 'harassment', 'discrimination',
        'threat', 'abuse', 'spam', 'malicious'
      ];

      const lowerContent = content.toLowerCase();
      const flaggedKeywords = toxicKeywords.filter(keyword => 
        lowerContent.includes(keyword)
      );

      const flagged = flaggedKeywords.length > 0;
      const confidence = flagged ? 0.8 : 0.1;

      return {
        flagged,
        categories: flaggedKeywords,
        confidence
      };
    } catch (error) {
      throw new Error(`Content moderation failed: ${(error as Error).message}`);
    }
  }

  // Get available models
  getAvailableModels(): Array<{id: string, name: string, description: string}> {
    return [
      {
        id: AI_MODELS.LLAMA_32_1B,
        name: 'Llama 3.2 1B',
        description: 'Fast, efficient model for general chat'
      },
      {
        id: AI_MODELS.LLAMA_32_3B,
        name: 'Llama 3.2 3B', 
        description: 'Balanced model for enhanced reasoning'
      },
      {
        id: AI_MODELS.LLAMA_32_11B,
        name: 'Llama 3.2 11B Vision',
        description: 'Advanced model with vision capabilities'
      },
      {
        id: AI_MODELS.CODELLAMA,
        name: 'CodeLlama 7B',
        description: 'Specialized for code generation and analysis'
      },
      {
        id: AI_MODELS.MISTRAL,
        name: 'Mistral 7B',
        description: 'Multilingual support and reasoning'
      }
    ];
  }

  // Simple token estimation (rough approximation)
  private estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  // Validate model
  isValidModel(model: string): boolean {
    return Object.values(AI_MODELS).includes(model as AIModel);
  }

  // Get default model
  getDefaultModel(): AIModel {
    return AI_MODELS.LLAMA_32_1B;
  }

  // Create conversation context
  buildConversationContext(messages: ChatMessage[], maxTokens: number = 4000): ChatMessage[] {
    // Simple context management - keep recent messages within token limit
    let totalTokens = 0;
    const contextMessages: ChatMessage[] = [];

    // Start from the most recent messages
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      const messageTokens = this.estimateTokens(message.content);
      
      if (totalTokens + messageTokens > maxTokens) {
        break;
      }
      
      contextMessages.unshift(message);
      totalTokens += messageTokens;
    }

    return contextMessages;
  }
}