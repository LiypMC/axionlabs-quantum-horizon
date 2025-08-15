import { ApiResponse, ApiError } from '../types';

export function createResponse<T>(
  data: T,
  status: number = 200,
  message?: string
): Response {
  const response: ApiResponse<T> = {
    success: status < 400,
    data,
    message,
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function createErrorResponse(
  error: string | ApiError,
  status?: number
): Response {
  const statusCode = error instanceof ApiError ? error.statusCode : (status || 500);
  const message = error instanceof ApiError ? error.message : error;
  
  const response: ApiResponse = {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(response), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function createSuccessResponse(message: string, data?: any): Response {
  return createResponse(data, 200, message);
}