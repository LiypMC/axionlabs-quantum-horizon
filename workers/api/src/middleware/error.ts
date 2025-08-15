import { ApiError } from '../types';
import { createErrorResponse } from '../utils/response';

export function errorHandler() {
  return async (request: Request, env: any, ctx: ExecutionContext, next: () => Promise<Response>) => {
    try {
      return await next();
    } catch (error) {
      console.error('API Error:', error);

      if (error instanceof ApiError) {
        return createErrorResponse(error);
      }

      // Handle different error types
      if (error instanceof Error) {
        return createErrorResponse(error.message, 500);
      }

      // Unknown error
      return createErrorResponse('Internal server error', 500);
    }
  };
}

export function notFoundHandler(): Response {
  return createErrorResponse('Endpoint not found', 404);
}