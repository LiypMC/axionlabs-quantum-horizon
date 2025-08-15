import { Env, ApiError } from '../types';
import { SessionService, SessionData } from './session';
import { JWTService } from '../utils/jwt';

export interface CrossDomainAuthData {
  temp_token: string;
  expires_at: Date;
  target_domain: string;
  source_domain: string;
  user_id: string;
  permissions: string[];
  app: string;
}

export interface AuthRedirectConfig {
  source_url: string;
  target_domain: string;
  app: string;
  preserve_state: boolean;
  auth_required: boolean;
  return_url: string;
}

export class CrossDomainAuthService {
  private jwt: JWTService;
  private sessionService: SessionService;
  
  constructor(private env: Env) {
    this.jwt = new JWTService(env.JWT_SECRET);
    this.sessionService = new SessionService(env);
  }

  /**
   * Generate secure cross-domain authentication URL
   */
  generateAuthRedirectUrl(config: AuthRedirectConfig): string {
    const authUrl = new URL('https://axionslab.com/auth');
    
    // Add redirect parameters
    authUrl.searchParams.set('redirect', config.target_domain + config.return_url);
    authUrl.searchParams.set('app', config.app);
    authUrl.searchParams.set('source', config.source_domain);
    
    if (config.preserve_state) {
      authUrl.searchParams.set('preserve_state', 'true');
    }
    
    // Add secure state parameter
    const state = this.generateSecureState({
      source_url: config.source_url,
      target_domain: config.target_domain,
      app: config.app,
      timestamp: Date.now(),
      nonce: crypto.randomUUID(),
    });
    
    authUrl.searchParams.set('state', state);
    
    return authUrl.toString();
  }

  /**
   * Generate temporary token for cross-domain transfer
   */
  async generateTempTokenForDomain(
    session: SessionData,
    targetDomain: string,
    app: string
  ): Promise<CrossDomainAuthData> {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    
    const tempToken = await this.jwt.generateTempToken(
      session.user_id,
      targetDomain,
      this.getUserPermissionsForApp(session.user, app)
    );
    
    return {
      temp_token: tempToken,
      expires_at: expiresAt,
      target_domain: targetDomain,
      source_domain: 'axionslab.com',
      user_id: session.user_id,
      permissions: this.getUserPermissionsForApp(session.user, app),
      app,
    };
  }

  /**
   * Validate and exchange temporary token
   */
  async validateAndExchangeTempToken(
    tempToken: string,
    targetDomain: string,
    request: Request
  ): Promise<{
    access_token: string;
    user: SessionData['user'];
    session_info: {
      expires_at: Date;
      permissions: string[];
    };
  } | null> {
    try {
      // Verify temporary token
      const payload = await this.jwt.verifyToken(tempToken, targetDomain);
      
      if (payload.type !== 'temporary' || payload.target_domain !== targetDomain) {
        throw new Error('Invalid temporary token type or domain');
      }
      
      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      if (payload.expires_at && payload.expires_at < now) {
        throw new Error('Temporary token expired');
      }
      
      // Create new session for target domain
      const result = await this.sessionService.exchangeTempToken(tempToken, targetDomain, request);
      
      if (!result) {
        return null;
      }
      
      return {
        access_token: result.accessToken,
        user: result.session.user,
        session_info: {
          expires_at: result.session.expires_at,
          permissions: payload.permissions || [],
        },
      };
    } catch (error) {
      console.error('Temp token validation error:', error);
      return null;
    }
  }

  /**
   * Generate callback URL for cross-domain authentication
   */
  generateCallbackUrl(targetDomain: string, tempToken: string, returnPath: string = '/'): string {
    const callbackUrl = new URL(`https://${targetDomain}/auth/callback`);
    callbackUrl.searchParams.set('token', tempToken);
    callbackUrl.searchParams.set('return_to', returnPath);
    
    return callbackUrl.toString();
  }

  /**
   * Handle authentication flow for different apps
   */
  async handleAppAuthentication(
    app: string,
    session: SessionData,
    targetDomain: string
  ): Promise<{
    redirect_url: string;
    temp_token: string;
    expires_in: number;
  }> {
    // Generate temporary token for specific app
    const authData = await this.generateTempTokenForDomain(session, targetDomain, app);
    
    // Determine redirect URL based on app
    let redirectUrl: string;
    
    switch (app) {
      case 'gideon':
      case 'chat':
        redirectUrl = this.generateCallbackUrl(targetDomain, authData.temp_token, '/');
        break;
      case 'admin':
        redirectUrl = this.generateCallbackUrl(targetDomain, authData.temp_token, '/dashboard');
        break;
      default:
        redirectUrl = this.generateCallbackUrl(targetDomain, authData.temp_token, '/');
    }
    
    return {
      redirect_url: redirectUrl,
      temp_token: authData.temp_token,
      expires_in: Math.floor((authData.expires_at.getTime() - Date.now()) / 1000),
    };
  }

  /**
   * Validate domain access permissions
   */
  validateDomainAccess(user: SessionData['user'], targetDomain: string, app: string): boolean {
    // Check if user has access to the specific app
    const userAppAccess = this.getUserAppAccess(user);
    
    if (!userAppAccess.includes(app) && app !== 'main') {
      return false;
    }
    
    // Validate domain whitelist
    const allowedDomains = [
      'axionslab.com',
      'chat.axionslab.com',
      'admin.axionslab.com',
      'docs.axionslab.com',
      'localhost', // Development only
    ];
    
    return allowedDomains.includes(targetDomain);
  }

  /**
   * Create secure login message for UI
   */
  createLoginMessage(app: string, targetDomain: string): {
    title: string;
    description: string;
    app_name: string;
    redirect_hint: string;
  } {
    const appConfigs = {
      chat: {
        title: 'Sign in to access Gideon AI',
        description: 'Continue to the AI chat interface',
        app_name: 'Gideon Chat',
        redirect_hint: 'You will be redirected to the chat application',
      },
      admin: {
        title: 'Sign in to Admin Dashboard',
        description: 'Access administrative tools and settings',
        app_name: 'Admin Dashboard',
        redirect_hint: 'You will be redirected to the admin panel',
      },
      main: {
        title: 'Sign in to AxionLabs',
        description: 'Access your account and services',
        app_name: 'AxionLabs',
        redirect_hint: 'You will be redirected to the main application',
      },
    };
    
    return appConfigs[app as keyof typeof appConfigs] || appConfigs.main;
  }

  // Private helper methods
  
  private generateSecureState(data: any): string {
    // In production, this should be encrypted
    return btoa(JSON.stringify(data));
  }
  
  private parseSecureState(state: string): any {
    try {
      return JSON.parse(atob(state));
    } catch {
      throw new ApiError(400, 'Invalid state parameter');
    }
  }
  
  private getUserPermissionsForApp(user: SessionData['user'], app: string): string[] {
    const basePermissions = ['read:profile'];
    
    switch (app) {
      case 'chat':
      case 'gideon':
        return [...basePermissions, 'write:conversations', 'read:conversations', 'use:ai'];
      case 'admin':
        if (user.role === 'admin' || user.role === 'super_admin') {
          return [...basePermissions, 'admin:users', 'admin:organizations', 'admin:system'];
        }
        return basePermissions;
      default:
        return basePermissions;
    }
  }
  
  private getUserAppAccess(user: SessionData['user']): string[] {
    const access = ['main', 'chat'];
    
    if (user.role === 'admin' || user.role === 'super_admin') {
      access.push('admin');
    }
    
    return access;
  }
}