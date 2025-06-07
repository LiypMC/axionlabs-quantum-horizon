import { supabase } from '@/integrations/supabase/client';
import { CORS_HEADERS } from '@/lib/api-routes';
import { User, Session } from '@supabase/supabase-js';

export interface AuthenticatedRequest extends Request {
  user?: User;
  session?: Session;
}

export interface ApiResponse {
  success?: boolean;
  error?: string;
  data?: Record<string, unknown>;
}

export const createSecureResponse = (data: ApiResponse, status: number = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...CORS_HEADERS,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    },
  });
};

export const handleCORS = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: CORS_HEADERS });
  }
  return null;
};

export const validateMethod = (req: Request, allowedMethods: string[]) => {
  if (!allowedMethods.includes(req.method)) {
    return createSecureResponse(
      { error: 'Method not allowed', success: false },
      405
    );
  }
  return null;
};

export const authenticateRequest = async (req: Request) => {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      error: createSecureResponse(
        { error: 'Authorization required', success: false },
        401
      ),
      user: null,
      session: null,
    };
  }

  const token = authHeader.substring(7);
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return {
        error: createSecureResponse(
          { error: 'Invalid or expired token', success: false },
          401
        ),
        user: null,
        session: null,
      };
    }

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    return {
      error: null,
      user,
      session,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      error: createSecureResponse(
        { error: 'Authentication failed', success: false },
        500
      ),
      user: null,
      session: null,
    };
  }
};

export const validateRequestBody = async (req: Request, requiredFields: string[]) => {
  try {
    const body = await req.json();
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return {
          error: createSecureResponse(
            { error: `${field} is required`, success: false },
            400
          ),
          body: null,
        };
      }
    }
    
    return {
      error: null,
      body,
    };
  } catch (error) {
    return {
      error: createSecureResponse(
        { error: 'Invalid JSON in request body', success: false },
        400
      ),
      body: null,
    };
  }
};

export const rateLimitCheck = (req: Request, windowMs: number = 60000, maxRequests: number = 100) => {
  // Basic rate limiting - in production, use Redis or similar
  const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  
  // For now, just log the request
  console.log(`Request from ${clientIP} at ${new Date().toISOString()}`);
  
  // Return false if rate limit exceeded (implement actual logic as needed)
  return false;
};

export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
};