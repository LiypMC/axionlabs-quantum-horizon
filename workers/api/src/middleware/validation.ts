import { z } from 'zod';
import { ApiError } from '../types';

export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return async (request: Request, env: any, ctx: ExecutionContext, next: () => Promise<Response>) => {
    try {
      const contentType = request.headers.get('content-type');
      
      if (request.method === 'GET') {
        // Validate query parameters
        const url = new URL(request.url);
        const params = Object.fromEntries(url.searchParams);
        const validated = schema.parse(params);
        
        // Attach validated data to request
        (request as any).validated = validated;
      } else if (contentType?.includes('application/json')) {
        // Validate JSON body
        const body = await request.json();
        const validated = schema.parse(body);
        
        // Attach validated data to request
        (request as any).validated = validated;
      } else {
        throw new ApiError(400, 'Invalid content type');
      }
      
      return await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        ).join(', ');
        throw new ApiError(400, `Validation error: ${errorMessage}`);
      }
      
      throw error;
    }
  };
}