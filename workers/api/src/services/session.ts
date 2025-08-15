import { Env, User } from '../types';
import { JWTService } from '../utils/jwt';
import { CryptoService } from '../utils/crypto';

export interface SessionData {
  id: string;
  user_id: string;
  user: User;
  token_hash: string;
  refresh_token_hash?: string;
  device_info?: {
    userAgent: string;
    platform: string;
    browser: string;
  };
  ip_address: string;
  location?: {
    country?: string;
    city?: string;
    timezone?: string;
  };
  is_active: boolean;
  expires_at: Date;
  last_activity_at: Date;
  created_at: Date;
}

export class SessionService {
  private jwt: JWTService;
  // private kv: KVNamespace; // Will be enabled when KV is configured
  
  constructor(private env: Env) {
    this.jwt = new JWTService(env.JWT_SECRET);
    // this.kv = env.SESSIONS;
  }

  /**
   * Create new user session
   */
  async createSession(user: User, request: Request): Promise<{
    accessToken: string;
    refreshToken: string;
    session: SessionData;
  }> {
    const sessionId = this.jwt.generateSecureId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Extract request information
    const userAgent = request.headers.get('user-agent') || '';
    const ip = this.getClientIP(request);
    const deviceInfo = this.parseUserAgent(userAgent);

    // Generate tokens
    const accessToken = await this.jwt.generateAccessToken({
      user_id: user.id,
      email: user.email,
      role: user.role,
      organization_id: user.organization_id,
      permissions: this.getUserPermissions(user),
      domain: new URL(request.url).hostname,
      app_access: this.getUserAppAccess(user),
    });

    const refreshToken = await this.jwt.generateRefreshToken(user.id, sessionId);

    // Create token hashes for database storage
    const tokenHash = await this.jwt.createTokenHash(accessToken);
    const refreshTokenHash = await this.jwt.createTokenHash(refreshToken);

    const session: SessionData = {
      id: sessionId,
      user_id: user.id,
      user,
      token_hash: tokenHash,
      refresh_token_hash: refreshTokenHash,
      device_info: deviceInfo,
      ip_address: ip,
      is_active: true,
      expires_at: expiresAt,
      last_activity_at: now,
      created_at: now,
    };

    // Store session in database (when D1 is configured)
    // await this.storeSessionInDatabase(session);

    // Store session in KV for quick access (when KV is configured)
    // await this.kv.put(tokenHash, JSON.stringify(session), {
    //   expirationTtl: 30 * 24 * 60 * 60, // 30 days
    // });

    // For now, store in memory cache (development only)
    await this.storeSessionInMemory(tokenHash, session);

    return {
      accessToken,
      refreshToken,
      session,
    };
  }

  /**
   * Validate session token
   */
  async validateSession(token: string): Promise<SessionData | null> {
    try {
      // Verify JWT token
      const payload = await this.jwt.verifyToken(token);
      const tokenHash = await this.jwt.createTokenHash(token);

      // Get session from KV (when configured) or memory
      const session = await this.getSessionFromMemory(tokenHash);
      
      if (!session || !session.is_active) {
        return null;
      }

      // Check expiration
      if (session.expires_at < new Date()) {
        await this.invalidateSession(tokenHash);
        return null;
      }

      // Update last activity
      session.last_activity_at = new Date();
      await this.storeSessionInMemory(tokenHash, session);

      return session;
    } catch (error) {
      console.error('Session validation error:', error);
      return null;
    }
  }

  /**
   * Refresh access token
   */
  async refreshSession(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  } | null> {
    try {
      const payload = await this.jwt.verifyToken(refreshToken);
      
      if (payload.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      const refreshTokenHash = await this.jwt.createTokenHash(refreshToken);
      const session = await this.getSessionByRefreshToken(refreshTokenHash);
      
      if (!session || !session.is_active) {
        return null;
      }

      // Generate new tokens
      const newAccessToken = await this.jwt.generateAccessToken({
        user_id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        organization_id: session.user.organization_id,
        permissions: this.getUserPermissions(session.user),
        domain: 'api.axionshosting.com',
        app_access: this.getUserAppAccess(session.user),
      });

      const newRefreshToken = await this.jwt.generateRefreshToken(session.user.id, session.id);

      // Update session with new token hashes
      const newTokenHash = await this.jwt.createTokenHash(newAccessToken);
      const newRefreshTokenHash = await this.jwt.createTokenHash(newRefreshToken);

      session.token_hash = newTokenHash;
      session.refresh_token_hash = newRefreshTokenHash;
      session.last_activity_at = new Date();

      await this.storeSessionInMemory(newTokenHash, session);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  }

  /**
   * Invalidate session (logout)
   */
  async invalidateSession(tokenHash: string): Promise<void> {
    // Remove from KV (when configured)
    // await this.kv.delete(tokenHash);

    // Remove from memory cache
    await this.removeSessionFromMemory(tokenHash);

    // Mark as inactive in database (when D1 is configured)
    // await this.markSessionInactive(tokenHash);
  }

  /**
   * Invalidate all user sessions (global logout)
   */
  async invalidateAllUserSessions(userId: string): Promise<void> {
    // TODO: Implement when database is configured
    // Get all active sessions for user and invalidate them
    console.log(`Invalidating all sessions for user: ${userId}`);
  }

  /**
   * Generate temporary cross-domain token
   */
  async generateCrossDomainToken(session: SessionData, targetDomain: string): Promise<string> {
    return await this.jwt.generateTempToken(
      session.user_id,
      targetDomain,
      this.getUserPermissions(session.user)
    );
  }

  /**
   * Exchange temporary token for permanent session
   */
  async exchangeTempToken(tempToken: string, targetDomain: string, request: Request): Promise<{
    accessToken: string;
    session: SessionData;
  } | null> {
    try {
      const payload = await this.jwt.verifyToken(tempToken, targetDomain);
      
      if (payload.type !== 'temporary' || payload.target_domain !== targetDomain) {
        throw new Error('Invalid temporary token');
      }

      // Get user data (when database is configured)
      // const user = await this.getUserById(payload.user_id);
      
      // For now, create mock user
      const user: User = {
        id: payload.user_id,
        email: 'user@example.com',
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Create new session for target domain
      const { accessToken, session } = await this.createSession(user, request);

      return {
        accessToken,
        session,
      };
    } catch (error) {
      console.error('Temp token exchange error:', error);
      return null;
    }
  }

  // Private helper methods

  private getUserPermissions(user: User): string[] {
    const permissions = ['read:profile', 'write:conversations'];
    
    if (user.role === 'admin' || user.role === 'super_admin') {
      permissions.push('admin:users', 'admin:organizations');
    }
    
    if (user.role === 'super_admin') {
      permissions.push('admin:system', 'admin:feature_flags');
    }

    return permissions;
  }

  private getUserAppAccess(user: User): string[] {
    const access = ['chat'];
    
    if (user.role === 'admin' || user.role === 'super_admin') {
      access.push('admin');
    }

    return access;
  }

  private getClientIP(request: Request): string {
    // Check Cloudflare headers first
    return request.headers.get('cf-connecting-ip') ||
           request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
           request.headers.get('x-real-ip') ||
           '127.0.0.1';
  }

  private parseUserAgent(userAgent: string): {
    userAgent: string;
    platform: string;
    browser: string;
  } {
    // Simple user agent parsing (could use a library for more accuracy)
    let platform = 'Unknown';
    let browser = 'Unknown';

    if (/Windows/i.test(userAgent)) platform = 'Windows';
    else if (/Mac OS/i.test(userAgent)) platform = 'macOS';
    else if (/Linux/i.test(userAgent)) platform = 'Linux';
    else if (/Android/i.test(userAgent)) platform = 'Android';
    else if (/iOS/i.test(userAgent)) platform = 'iOS';

    if (/Chrome/i.test(userAgent)) browser = 'Chrome';
    else if (/Firefox/i.test(userAgent)) browser = 'Firefox';
    else if (/Safari/i.test(userAgent)) browser = 'Safari';
    else if (/Edge/i.test(userAgent)) browser = 'Edge';

    return {
      userAgent: userAgent.substring(0, 500), // Limit length
      platform,
      browser,
    };
  }

  // Memory cache methods (temporary until KV/D1 is configured)
  private memoryCache = new Map<string, SessionData>();

  private async storeSessionInMemory(tokenHash: string, session: SessionData): Promise<void> {
    this.memoryCache.set(tokenHash, session);
  }

  private async getSessionFromMemory(tokenHash: string): Promise<SessionData | null> {
    return this.memoryCache.get(tokenHash) || null;
  }

  private async getSessionByRefreshToken(refreshTokenHash: string): Promise<SessionData | null> {
    for (const session of this.memoryCache.values()) {
      if (session.refresh_token_hash === refreshTokenHash) {
        return session;
      }
    }
    return null;
  }

  private async removeSessionFromMemory(tokenHash: string): Promise<void> {
    this.memoryCache.delete(tokenHash);
  }
}