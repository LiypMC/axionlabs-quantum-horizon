
// API route configuration for the authentication flow

export const API_ROUTES = {
  SESSION: '/api/auth/session',
  LINK_ACCOUNT: '/api/link-account',
} as const;

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
} as const;

// Helper function to create standardized API responses
export const createApiResponse = (data: any, status: number = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: CORS_HEADERS,
  });
};

// Helper function to handle authentication from request headers
export const getAuthTokenFromRequest = (req: Request): string | null => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};
