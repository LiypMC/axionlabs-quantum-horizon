import { Env, OAuthProfile, ApiError } from '../types';

export interface OAuthState {
  redirect_uri: string;
  app: string;
  nonce: string;
  created_at: number;
}

export abstract class OAuthProvider {
  constructor(protected env: Env) {}

  abstract getAuthorizationUrl(state: string, redirectUri: string): string;
  abstract exchangeCodeForTokens(code: string, redirectUri: string): Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
  }>;
  abstract getUserProfile(accessToken: string): Promise<OAuthProfile>;
  abstract refreshAccessToken(refreshToken: string): Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
  }>;
}

export class GoogleOAuthProvider extends OAuthProvider {
  private readonly authUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  private readonly tokenUrl = 'https://oauth2.googleapis.com/token';
  private readonly userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';

  getAuthorizationUrl(state: string, redirectUri: string): string {
    const params = new URLSearchParams({
      client_id: this.env.GOOGLE_OAUTH_CLIENT_ID || '',
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      access_type: 'offline',
      prompt: 'consent',
    });

    return `${this.authUrl}?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string, redirectUri: string): Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
  }> {
    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.env.GOOGLE_OAUTH_CLIENT_ID || '',
        client_secret: this.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new ApiError(400, `Google OAuth token exchange failed: ${error}`);
    }

    return await response.json();
  }

  async getUserProfile(accessToken: string): Promise<OAuthProfile> {
    const response = await fetch(this.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new ApiError(400, `Google user info fetch failed: ${error}`);
    }

    const data = await response.json();
    
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      avatar_url: data.picture,
      provider: 'google',
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
  }> {
    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.env.GOOGLE_OAUTH_CLIENT_ID || '',
        client_secret: this.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new ApiError(400, `Google OAuth token refresh failed: ${error}`);
    }

    return await response.json();
  }
}

export class GitHubOAuthProvider extends OAuthProvider {
  private readonly authUrl = 'https://github.com/login/oauth/authorize';
  private readonly tokenUrl = 'https://github.com/login/oauth/access_token';
  private readonly userInfoUrl = 'https://api.github.com/user';

  getAuthorizationUrl(state: string, redirectUri: string): string {
    const params = new URLSearchParams({
      client_id: this.env.GITHUB_OAUTH_CLIENT_ID || '',
      redirect_uri: redirectUri,
      scope: 'user:email',
      state,
    });

    return `${this.authUrl}?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string, redirectUri: string): Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
  }> {
    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.env.GITHUB_OAUTH_CLIENT_ID || '',
        client_secret: this.env.GITHUB_OAUTH_CLIENT_SECRET || '',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new ApiError(400, `GitHub OAuth token exchange failed: ${error}`);
    }

    return await response.json();
  }

  async getUserProfile(accessToken: string): Promise<OAuthProfile> {
    // Get user basic info
    const userResponse = await fetch(this.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'AxionLabs-API',
      },
    });

    if (!userResponse.ok) {
      const error = await userResponse.text();
      throw new ApiError(400, `GitHub user info fetch failed: ${error}`);
    }

    const userData = await userResponse.json();

    // Get user email (if not public)
    let email = userData.email;
    if (!email) {
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'AxionLabs-API',
        },
      });

      if (emailResponse.ok) {
        const emails = await emailResponse.json();
        const primaryEmail = emails.find((e: any) => e.primary && e.verified);
        email = primaryEmail?.email || emails[0]?.email;
      }
    }

    return {
      id: userData.id.toString(),
      email: email,
      name: userData.name || userData.login,
      avatar_url: userData.avatar_url,
      provider: 'github',
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
  }> {
    // GitHub doesn't use refresh tokens, access tokens don't expire
    throw new ApiError(400, 'GitHub OAuth does not support token refresh');
  }
}

export class OAuthService {
  private googleProvider: GoogleOAuthProvider;
  private githubProvider: GitHubOAuthProvider;
  
  constructor(private env: Env) {
    this.googleProvider = new GoogleOAuthProvider(env);
    this.githubProvider = new GitHubOAuthProvider(env);
  }

  /**
   * Generate OAuth authorization URL
   */
  getAuthorizationUrl(
    provider: 'google' | 'github',
    redirectUri: string,
    app: string = 'main'
  ): string {
    const state = this.generateState(redirectUri, app);
    
    switch (provider) {
      case 'google':
        return this.googleProvider.getAuthorizationUrl(state, redirectUri);
      case 'github':
        return this.githubProvider.getAuthorizationUrl(state, redirectUri);
      default:
        throw new ApiError(400, 'Unsupported OAuth provider');
    }
  }

  /**
   * Handle OAuth callback
   */
  async handleCallback(
    provider: 'google' | 'github',
    code: string,
    state: string,
    redirectUri: string
  ): Promise<{
    profile: OAuthProfile;
    tokens: {
      access_token: string;
      refresh_token?: string;
      expires_in?: number;
    };
    originalRedirect: string;
    app: string;
  }> {
    // Validate and parse state
    const stateData = this.parseState(state);
    
    let oauthProvider: OAuthProvider;
    switch (provider) {
      case 'google':
        oauthProvider = this.googleProvider;
        break;
      case 'github':
        oauthProvider = this.githubProvider;
        break;
      default:
        throw new ApiError(400, 'Unsupported OAuth provider');
    }

    // Exchange code for tokens
    const tokens = await oauthProvider.exchangeCodeForTokens(code, redirectUri);

    // Get user profile
    const profile = await oauthProvider.getUserProfile(tokens.access_token);

    return {
      profile,
      tokens,
      originalRedirect: stateData.redirect_uri,
      app: stateData.app,
    };
  }

  /**
   * Refresh OAuth tokens
   */
  async refreshTokens(
    provider: 'google' | 'github',
    refreshToken: string
  ): Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
  }> {
    switch (provider) {
      case 'google':
        return await this.googleProvider.refreshAccessToken(refreshToken);
      case 'github':
        throw new ApiError(400, 'GitHub OAuth does not support token refresh');
      default:
        throw new ApiError(400, 'Unsupported OAuth provider');
    }
  }

  /**
   * Generate secure state parameter
   */
  private generateState(redirectUri: string, app: string): string {
    const stateData: OAuthState = {
      redirect_uri: redirectUri,
      app,
      nonce: crypto.randomUUID(),
      created_at: Date.now(),
    };

    // In production, this should be encrypted and stored securely
    return btoa(JSON.stringify(stateData));
  }

  /**
   * Parse and validate state parameter
   */
  private parseState(state: string): OAuthState {
    try {
      const decoded = atob(state);
      const stateData: OAuthState = JSON.parse(decoded);

      // Validate state (check age, nonce, etc.)
      const maxAge = 10 * 60 * 1000; // 10 minutes
      if (Date.now() - stateData.created_at > maxAge) {
        throw new Error('State expired');
      }

      if (!stateData.redirect_uri || !stateData.nonce) {
        throw new Error('Invalid state data');
      }

      return stateData;
    } catch (error) {
      throw new ApiError(400, `Invalid OAuth state: ${error.message}`);
    }
  }

  /**
   * Validate redirect URI security
   */
  validateRedirectUri(redirectUri: string): boolean {
    try {
      const url = new URL(redirectUri);
      
      // Only allow specific domains
      const allowedDomains = [
        'axionslab.com',
        'chat.axionslab.com',
        'admin.axionslab.com',
        'localhost', // For development
      ];

      const domain = url.hostname;
      return allowedDomains.some(allowed => 
        domain === allowed || domain.endsWith('.' + allowed)
      );
    } catch {
      return false;
    }
  }
}