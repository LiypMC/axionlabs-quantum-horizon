import { Router } from 'itty-router';
import { Env } from './types';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/error';
import { loggingMiddleware } from './middleware/logging';
import { securityHeaders } from './middleware/auth';
import { createHealthRoutes } from './routes/health';
import { createAuthRoutes } from './routes/auth';
import { createCrossDomainRoutes } from './routes/cross-domain';
import { createAIRoutes } from './routes/ai';
import { createSuccessResponse, createErrorResponse } from './utils/response';

// Create main router
const router = Router();

// Apply global middleware
router.all('*', loggingMiddleware());
router.all('*', corsMiddleware());
router.all('*', securityHeaders());
router.all('*', errorHandler());

// Mount route modules
const healthRouter = createHealthRoutes();
const authRouter = createAuthRoutes();
const crossDomainRouter = createCrossDomainRoutes();
const aiRouter = createAIRoutes();

router.all('/health/*', healthRouter.fetch);
router.all('/auth/*', authRouter.fetch);
router.all('/auth/*', crossDomainRouter.fetch);
router.all('/v1/ai/*', aiRouter.fetch);

// Root endpoint
router.get('/', () => {
  return createSuccessResponse('AxionLabs API is running', {
    version: '1.0.0',
    service: 'axionlabs-api',
    documentation: '/docs',
    health: '/health/ping',
    auth: '/auth',
    timestamp: new Date().toISOString(),
  });
});

// API version endpoint
router.get('/v1', () => {
  return createSuccessResponse('API v1 is available', {
    version: '1.0.0',
    endpoints: {
      users: '/v1/users',
      conversations: '/v1/conversations',
      ai: '/v1/ai',
    },
    auth: '/auth',
  });
});

// 404 handler
router.all('*', () => {
  return createErrorResponse('Endpoint not found', 404);
});

// Export the worker
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      return await router.fetch(request, env, ctx);
    } catch (error) {
      console.error('Worker error:', error);
      return createErrorResponse('Internal server error', 500);
    }
  },
};

export { Env };