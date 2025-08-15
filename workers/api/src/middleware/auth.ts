import { Env, ApiError } from '../types';
import { SessionService, SessionData } from '../services/session';
import { createErrorResponse } from '../utils/response';

export interface AuthenticatedRequest extends Request {
  session?: SessionData;
  user?: SessionData['user'];
}

export function requireAuth() {
  return async (request: AuthenticatedRequest, env: Env, ctx: ExecutionContext, next: () => Promise<Response>) => {
    try {
      const sessionService = new SessionService(env);
      
      // Extract token from Authorization header
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(401, 'Authorization header required');
      }

      const token = authHeader.substring(7);
      if (!token) {
        throw new ApiError(401, 'Access token required');
      }

      // Validate session
      const session = await sessionService.validateSession(token);
      if (!session) {
        throw new ApiError(401, 'Invalid or expired token');
      }

      // Attach session and user to request
      request.session = session;
      request.user = session.user;

      return await next();
    } catch (error) {
      if (error instanceof ApiError) {
        return createErrorResponse(error);
      }
      return createErrorResponse('Authentication failed', 401);
    }
  };
}

export function requireRole(requiredRoles: string | string[]) {
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  
  return async (request: AuthenticatedRequest, env: Env, ctx: ExecutionContext, next: () => Promise<Response>) => {
    if (!request.user) {
      return createErrorResponse('Authentication required', 401);
    }

    if (!roles.includes(request.user.role)) {
      return createErrorResponse('Insufficient permissions', 403);
    }

    return await next();
  };
}

export function requirePermission(requiredPermissions: string | string[]) {
  const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
  
  return async (request: AuthenticatedRequest, env: Env, ctx: ExecutionContext, next: () => Promise<Response>) => {
    if (!request.session) {
      return createErrorResponse('Authentication required', 401);
    }

    // Get user permissions from JWT payload
    const sessionService = new SessionService(env);
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return createErrorResponse('Authorization header required', 401);
    }

    try {
      const token = authHeader.substring(7);
      const payload = await sessionService['jwt'].verifyToken(token);
      const userPermissions = payload.permissions || [];

      // Check if user has required permissions
      const hasPermissions = permissions.every(permission =>
        userPermissions.includes(permission) || 
        userPermissions.includes('admin:*') || // Super admin wildcard
        request.user?.role === 'super_admin' // Super admin bypass
      );

      if (!hasPermissions) {
        return createErrorResponse(
          `Missing required permissions: ${permissions.join(', ')}`,
          403
        );
      }

      return await next();
    } catch (error) {
      return createErrorResponse('Permission check failed', 403);
    }
  };
}

export function optionalAuth() {
  return async (request: AuthenticatedRequest, env: Env, ctx: ExecutionContext, next: () => Promise<Response>) => {
    try {
      const sessionService = new SessionService(env);
      const authHeader = request.headers.get('Authorization');
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const session = await sessionService.validateSession(token);
        
        if (session) {
          request.session = session;
          request.user = session.user;
        }
      }
    } catch (error) {
      // Silently fail for optional auth
      console.log('Optional auth failed:', error);
    }

    return await next();
  };
}

export function rateLimitByUser(requestsPerHour: number = 1000) {
  const userRequests = new Map<string, { count: number; resetTime: number }>();
  
  return async (request: AuthenticatedRequest, env: Env, ctx: ExecutionContext, next: () => Promise<Response>) => {
    const userId = request.user?.id || 'anonymous';
    const now = Date.now();
    const hourMs = 60 * 60 * 1000;
    
    let userLimit = userRequests.get(userId);
    
    // Reset if hour has passed
    if (!userLimit || now > userLimit.resetTime) {
      userLimit = {
        count: 0,
        resetTime: now + hourMs,
      };
      userRequests.set(userId, userLimit);
    }
    
    // Check rate limit
    if (userLimit.count >= requestsPerHour) {
      return createErrorResponse(
        'Rate limit exceeded. Try again later.',
        429
      );
    }
    
    // Increment counter
    userLimit.count++;
    userRequests.set(userId, userLimit);
    
    // Add rate limit headers
    const response = await next();
    const newHeaders = new Headers(response.headers);
    newHeaders.set('X-RateLimit-Limit', requestsPerHour.toString());
    newHeaders.set('X-RateLimit-Remaining', (requestsPerHour - userLimit.count).toString());
    newHeaders.set('X-RateLimit-Reset', new Date(userLimit.resetTime).toISOString());
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  };
}

export function requireApiKey() {
  return async (request: Request, env: Env, ctx: ExecutionContext, next: () => Promise<Response>) => {
    const apiKey = request.headers.get('X-API-Key');
    
    if (!apiKey) {
      return createErrorResponse('API key required', 401);
    }

    // TODO: Validate API key against database when D1 is configured
    if (!apiKey.startsWith('axl_')) {
      return createErrorResponse('Invalid API key format', 401);
    }

    // TODO: Check API key permissions and rate limits
    
    return await next();
  };
}

export function auditLog(action: string, resourceType: string) {
  return async (request: AuthenticatedRequest, env: Env, ctx: ExecutionContext, next: () => Promise<Response>) => {
    const startTime = Date.now();
    let success = true;
    let errorMessage = '';

    try {
      const response = await next();
      success = response.status < 400;
      return response;
    } catch (error) {
      success = false;
      errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    } finally {
      // Log the action (when database is configured)
      try {
        const auditData = {
          user_id: request.user?.id,
          organization_id: request.user?.organization_id,
          action,
          resource_type: resourceType,
          details: JSON.stringify({
            method: request.method,
            url: new URL(request.url).pathname,
            duration: Date.now() - startTime,
          }),
          ip_address: request.headers.get('cf-connecting-ip') || 'unknown',
          user_agent: request.headers.get('user-agent') || 'unknown',
          success,
          error_message: errorMessage || undefined,
        };

        // TODO: Insert into audit_logs table when D1 is configured
        console.log('Audit log:', auditData);
      } catch (auditError) {
        console.error('Failed to create audit log:', auditError);
      }
    }
  };
}

export function securityHeaders() {
  return async (request: Request, env: Env, ctx: ExecutionContext, next: () => Promise<Response>) => {
    const response = await next();
    
    const headers = new Headers(response.headers);
    
    // Security headers
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-XSS-Protection', '1; mode=block');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    // Content Security Policy
    headers.set('Content-Security-Policy', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "connect-src 'self' https://api.axionshosting.com; " +
      "frame-ancestors 'none';"
    );
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
}