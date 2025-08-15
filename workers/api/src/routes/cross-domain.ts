import { Router } from 'itty-router';
import { z } from 'zod';
import { Env, ApiError } from '../types';
import { CrossDomainAuthService } from '../services/cross-domain-auth';
import { SessionService } from '../services/session';
import { CookieService } from '../utils/cookies';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import { validateRequest } from '../middleware/validation';
import { requireAuth } from '../middleware/auth';

// Validation schemas
const CrossDomainRedirectSchema = z.object({
  target_domain: z.string().min(1, 'Target domain is required'),
  app: z.string().default('main'),
  return_url: z.string().default('/'),
  preserve_state: z.boolean().default(false),
});

const AuthCallbackSchema = z.object({
  temp_token: z.string().min(1, 'Temporary token is required'),
  target_domain: z.string().min(1, 'Target domain is required'),
  return_url: z.string().default('/'),
});

export function createCrossDomainRoutes() {
  const router = Router({ base: '/auth' });

  /**
   * GET /auth/check-session
   * Check if user has active session and redirect accordingly
   */
  router.get('/check-session', async (request: Request, env: Env) => {
    const url = new URL(request.url);
    const targetDomain = url.searchParams.get('domain');
    const app = url.searchParams.get('app') || 'main';
    const returnUrl = url.searchParams.get('return_url') || '/';

    if (!targetDomain) {
      throw new ApiError(400, 'Target domain is required');
    }

    const sessionService = new SessionService(env);
    const crossDomainService = new CrossDomainAuthService(env);

    // Check for existing session cookie
    const sessionCookie = CookieService.getCookie(request, 'axl_session');
    
    if (sessionCookie) {
      // Validate existing session
      const session = await sessionService.validateSession(sessionCookie);
      
      if (session && crossDomainService.validateDomainAccess(session.user, targetDomain, app)) {
        // Generate temporary token and redirect
        const authData = await crossDomainService.handleAppAuthentication(app, session, targetDomain);
        
        const redirectUrl = `https://${targetDomain}/auth/callback?token=${authData.temp_token}&return_to=${encodeURIComponent(returnUrl)}`;
        
        return CookieService.createCrossDomainRedirect(redirectUrl, authData.temp_token, targetDomain);
      }
    }

    // No valid session, redirect to login
    const loginRedirectConfig = {
      source_url: request.url,
      target_domain: targetDomain,
      app,
      preserve_state: true,
      auth_required: true,
      return_url: returnUrl,
    };

    const authUrl = crossDomainService.generateAuthRedirectUrl(loginRedirectConfig);
    
    return new Response(null, {
      status: 302,
      headers: {
        Location: authUrl,
      },
    });
  });

  /**
   * POST /auth/cross-domain/initiate
   * Initiate cross-domain authentication for authenticated user
   */
  router.post('/cross-domain/initiate',
    requireAuth(),
    validateRequest(CrossDomainRedirectSchema),
    async (request: any, env: Env) => {
      const { target_domain, app, return_url } = request.validated;
      
      const crossDomainService = new CrossDomainAuthService(env);
      
      // Validate domain access
      if (!crossDomainService.validateDomainAccess(request.user, target_domain, app)) {
        throw new ApiError(403, 'Access denied to target domain or application');
      }

      // Generate authentication data
      const authData = await crossDomainService.handleAppAuthentication(
        app,
        request.session,
        target_domain
      );

      return createSuccessResponse('Cross-domain authentication initiated', {
        redirect_url: authData.redirect_url,
        temp_token: authData.temp_token,
        expires_in: authData.expires_in,
        target_domain,
        app,
        return_url,
      });
    }
  );

  /**
   * POST /auth/cross-domain/callback
   * Handle cross-domain authentication callback
   */
  router.post('/cross-domain/callback',
    validateRequest(AuthCallbackSchema),
    async (request: Request, env: Env) => {
      const { temp_token, target_domain, return_url } = (request as any).validated;
      
      const crossDomainService = new CrossDomainAuthService(env);
      
      // Validate and exchange temporary token
      const result = await crossDomainService.validateAndExchangeTempToken(
        temp_token,
        target_domain,
        request
      );

      if (!result) {
        throw new ApiError(401, 'Invalid or expired temporary token');
      }

      // Create response with authentication cookies
      const responseData = {
        user: result.user,
        expires_at: result.session_info.expires_at.toISOString(),
        permissions: result.session_info.permissions,
        return_url,
      };

      return CookieService.createAuthResponse(
        responseData,
        result.access_token,
        '', // No refresh token for cross-domain sessions
        target_domain
      );
    }
  );

  /**
   * GET /auth/cross-domain/status
   * Get cross-domain authentication status
   */
  router.get('/cross-domain/status', async (request: Request, env: Env) => {
    const url = new URL(request.url);
    const targetDomain = url.searchParams.get('domain');
    
    if (!targetDomain) {
      throw new ApiError(400, 'Target domain is required');
    }

    const sessionService = new SessionService(env);
    const crossDomainService = new CrossDomainAuthService(env);

    // Check for session cookie
    const sessionCookie = CookieService.getCookie(request, 'axl_session');
    
    if (!sessionCookie) {
      return createSuccessResponse('No active session', {
        authenticated: false,
        target_domain: targetDomain,
        auth_url: `https://axionslab.com/auth?redirect=${encodeURIComponent(`https://${targetDomain}`)}`,
      });
    }

    // Validate session
    const session = await sessionService.validateSession(sessionCookie);
    
    if (!session) {
      return createSuccessResponse('Session expired', {
        authenticated: false,
        target_domain: targetDomain,
        auth_url: `https://axionslab.com/auth?redirect=${encodeURIComponent(`https://${targetDomain}`)}`,
      });
    }

    return createSuccessResponse('Active session found', {
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        full_name: session.user.full_name,
        role: session.user.role,
      },
      target_domain: targetDomain,
      expires_at: session.expires_at.toISOString(),
    });
  });

  /**
   * GET /auth/app-info
   * Get application-specific login information
   */
  router.get('/app-info', async (request: Request, env: Env) => {
    const url = new URL(request.url);
    const app = url.searchParams.get('app') || 'main';
    const targetDomain = url.searchParams.get('domain') || 'axionslab.com';

    const crossDomainService = new CrossDomainAuthService(env);
    const appInfo = crossDomainService.createLoginMessage(app, targetDomain);

    return createSuccessResponse('Application information', {
      ...appInfo,
      target_domain: targetDomain,
      auth_endpoints: {
        login: '/auth/login',
        register: '/auth/register',
        oauth_google: '/auth/oauth/google',
        oauth_github: '/auth/oauth/github',
      },
    });
  });

  /**
   * POST /auth/logout-all
   * Logout from all domains and applications
   */
  router.post('/logout-all',
    requireAuth(),
    async (request: any, env: Env) => {
      const sessionService = new SessionService(env);
      
      // Invalidate all user sessions
      await sessionService.invalidateAllUserSessions(request.user.id);
      
      // Clear cookies for main domain
      let response = createSuccessResponse('Logged out from all domains and applications');
      response = CookieService.clearAuthCookies(response, 'axionslab.com');
      
      return response;
    }
  );

  /**
   * GET /auth/domains/validate
   * Validate if domain is allowed for cross-domain auth
   */
  router.get('/domains/validate', async (request: Request, env: Env) => {
    const url = new URL(request.url);
    const domain = url.searchParams.get('domain');
    
    if (!domain) {
      throw new ApiError(400, 'Domain parameter is required');
    }

    const crossDomainService = new CrossDomainAuthService(env);
    const isValid = crossDomainService.validateDomainAccess(
      { role: 'user' } as any, // Mock user for domain validation
      domain,
      'main'
    );

    return createSuccessResponse('Domain validation result', {
      domain,
      is_valid: isValid,
      allowed_apps: isValid ? ['main', 'chat'] : [],
    });
  });

  return router;
}