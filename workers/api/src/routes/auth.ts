import { Router } from 'itty-router';
import { z } from 'zod';
import { Env, LoginRequest, RegisterRequest, ApiError } from '../types';
import { SessionService } from '../services/session';
import { OAuthService } from '../services/oauth';
import { CryptoService } from '../utils/crypto';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import { validateRequest } from '../middleware/validation';
import { requireAuth, rateLimitByUser, auditLog } from '../middleware/auth';

// Validation schemas
const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const RegisterSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(1, 'Full name is required').optional(),
});

const RefreshTokenSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token is required'),
});

const TempTokenSchema = z.object({
  temp_token: z.string().min(1, 'Temporary token is required'),
  target_domain: z.string().min(1, 'Target domain is required'),
});

export function createAuthRoutes() {
  const router = Router({ base: '/auth' });

  // Apply rate limiting to all auth routes
  router.all('*', rateLimitByUser(100)); // 100 requests per hour for auth endpoints

  /**
   * POST /auth/login
   * Authenticate user with email and password
   */
  router.post('/login', 
    validateRequest(LoginSchema),
    auditLog('user_login', 'session'),
    async (request: Request, env: Env) => {
      const { email, password } = (request as any).validated as LoginRequest;
      
      // TODO: Get user from database when D1 is configured
      // For now, use mock authentication
      if (email === 'demo@axionslab.com' && password === 'demo123') {
        const mockUser = {
          id: 'demo-user',
          email: 'demo@axionslab.com',
          full_name: 'Demo User',
          role: 'user' as const,
          organization_id: 'default-org',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const sessionService = new SessionService(env);
        const { accessToken, refreshToken, session } = await sessionService.createSession(mockUser, request);

        return createSuccessResponse('Login successful', {
          user: session.user,
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: session.expires_at.toISOString(),
        });
      }

      // TODO: Implement actual user authentication
      // const user = await databaseService.getUserByEmail(email);
      // if (!user || !await CryptoService.verifyPassword(password, user.password_hash)) {
      //   throw new ApiError(401, 'Invalid credentials');
      // }

      throw new ApiError(401, 'Invalid credentials');
    }
  );

  /**
   * POST /auth/register
   * Register new user account
   */
  router.post('/register',
    validateRequest(RegisterSchema),
    auditLog('user_register', 'user'),
    async (request: Request, env: Env) => {
      const { email, password, full_name } = (request as any).validated as RegisterRequest;

      // Validate password strength
      const passwordValidation = CryptoService.validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        throw new ApiError(400, 'Password does not meet security requirements');
      }

      // TODO: Check if user already exists when D1 is configured
      // const existingUser = await databaseService.getUserByEmail(email);
      // if (existingUser) {
      //   throw new ApiError(409, 'User with this email already exists');
      // }

      // Hash password
      const passwordHash = await CryptoService.hashPassword(password);

      // TODO: Create user in database when D1 is configured
      // const user = await databaseService.createUser({
      //   email,
      //   password_hash: passwordHash,
      //   full_name,
      // });

      // Mock user creation for development
      const mockUser = {
        id: crypto.randomUUID(),
        email,
        full_name,
        role: 'user' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return createSuccessResponse('Registration successful', {
        user: mockUser,
        message: 'Please check your email to verify your account',
      });
    }
  );

  /**
   * POST /auth/refresh
   * Refresh access token using refresh token
   */
  router.post('/refresh',
    validateRequest(RefreshTokenSchema),
    async (request: Request, env: Env) => {
      const { refresh_token } = (request as any).validated;

      const sessionService = new SessionService(env);
      const tokens = await sessionService.refreshSession(refresh_token);

      if (!tokens) {
        throw new ApiError(401, 'Invalid refresh token');
      }

      return createSuccessResponse('Token refreshed', {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
      });
    }
  );

  /**
   * POST /auth/logout
   * Logout and invalidate session
   */
  router.post('/logout',
    requireAuth(),
    auditLog('user_logout', 'session'),
    async (request: any, env: Env) => {
      const authHeader = request.headers.get('Authorization');
      if (authHeader) {
        const sessionService = new SessionService(env);
        const jwt = sessionService['jwt'];
        const token = authHeader.substring(7);
        const tokenHash = await jwt.createTokenHash(token);
        
        await sessionService.invalidateSession(tokenHash);
      }

      return createSuccessResponse('Logout successful');
    }
  );

  /**
   * GET /auth/oauth/google
   * Initiate Google OAuth flow
   */
  router.get('/oauth/google', async (request: Request, env: Env) => {
    const url = new URL(request.url);
    const redirectUri = url.searchParams.get('redirect_uri') || 'https://axionslab.com/auth/callback';
    const app = url.searchParams.get('app') || 'main';

    const oauthService = new OAuthService(env);
    
    if (!oauthService.validateRedirectUri(redirectUri)) {
      throw new ApiError(400, 'Invalid redirect URI');
    }

    const authUrl = oauthService.getAuthorizationUrl('google', redirectUri, app);
    
    return new Response(null, {
      status: 302,
      headers: {
        Location: authUrl,
      },
    });
  });

  /**
   * GET /auth/oauth/github
   * Initiate GitHub OAuth flow
   */
  router.get('/oauth/github', async (request: Request, env: Env) => {
    const url = new URL(request.url);
    const redirectUri = url.searchParams.get('redirect_uri') || 'https://axionslab.com/auth/callback';
    const app = url.searchParams.get('app') || 'main';

    const oauthService = new OAuthService(env);
    
    if (!oauthService.validateRedirectUri(redirectUri)) {
      throw new ApiError(400, 'Invalid redirect URI');
    }

    const authUrl = oauthService.getAuthorizationUrl('github', redirectUri, app);
    
    return new Response(null, {
      status: 302,
      headers: {
        Location: authUrl,
      },
    });
  });

  /**
   * POST /auth/oauth/callback
   * Handle OAuth provider callback
   */
  router.post('/oauth/callback',
    auditLog('oauth_callback', 'session'),
    async (request: Request, env: Env) => {
      const url = new URL(request.url);
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const provider = url.searchParams.get('provider') as 'google' | 'github';

      if (!code || !state || !provider) {
        throw new ApiError(400, 'Missing required OAuth parameters');
      }

      const oauthService = new OAuthService(env);
      const callbackUrl = `${url.origin}/auth/oauth/callback`;
      
      const result = await oauthService.handleCallback(provider, code, state, callbackUrl);
      
      // TODO: Find or create user based on OAuth profile when D1 is configured
      // const user = await findOrCreateOAuthUser(result.profile);
      
      // Mock user for development
      const mockUser = {
        id: crypto.randomUUID(),
        email: result.profile.email,
        full_name: result.profile.name,
        avatar_url: result.profile.avatar_url,
        role: 'user' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const sessionService = new SessionService(env);
      const { accessToken, refreshToken, session } = await sessionService.createSession(mockUser, request);

      return createSuccessResponse('OAuth authentication successful', {
        user: session.user,
        access_token: accessToken,
        refresh_token: refreshToken,
        redirect_uri: result.originalRedirect,
        app: result.app,
      });
    }
  );

  /**
   * POST /auth/sessions/exchange
   * Exchange temporary cross-domain token for session
   */
  router.post('/sessions/exchange',
    validateRequest(TempTokenSchema),
    async (request: Request, env: Env) => {
      const { temp_token, target_domain } = (request as any).validated;

      const sessionService = new SessionService(env);
      const result = await sessionService.exchangeTempToken(temp_token, target_domain, request);

      if (!result) {
        throw new ApiError(401, 'Invalid temporary token');
      }

      return createSuccessResponse('Token exchange successful', {
        access_token: result.accessToken,
        user: result.session.user,
      });
    }
  );

  /**
   * GET /auth/me
   * Get current user information
   */
  router.get('/me',
    requireAuth(),
    async (request: any, env: Env) => {
      return createSuccessResponse('User information', {
        user: request.user,
        session: {
          expires_at: request.session.expires_at,
          last_activity_at: request.session.last_activity_at,
          device_info: request.session.device_info,
        },
      });
    }
  );

  /**
   * POST /auth/sessions/temp
   * Generate temporary cross-domain token
   */
  router.post('/sessions/temp',
    requireAuth(),
    async (request: any, env: Env) => {
      const url = new URL(request.url);
      const targetDomain = url.searchParams.get('domain');

      if (!targetDomain) {
        throw new ApiError(400, 'Target domain is required');
      }

      const oauthService = new OAuthService(env);
      if (!oauthService.validateRedirectUri(`https://${targetDomain}`)) {
        throw new ApiError(400, 'Invalid target domain');
      }

      const sessionService = new SessionService(env);
      const tempToken = await sessionService.generateCrossDomainToken(request.session, targetDomain);

      return createSuccessResponse('Temporary token generated', {
        temp_token: tempToken,
        expires_in: 300, // 5 minutes
        target_domain: targetDomain,
      });
    }
  );

  return router;
}