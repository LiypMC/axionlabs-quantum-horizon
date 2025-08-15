import { SignJWT, jwtVerify } from 'jose';
import { AuthToken } from '../types';

export class JWTService {
  private secretKey: Uint8Array;

  constructor(secret: string) {
    this.secretKey = new TextEncoder().encode(secret);
  }

  /**
   * Generate JWT access token (15 minutes)
   */
  async generateAccessToken(payload: Omit<AuthToken, 'issued_at' | 'expires_at'>): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = 15 * 60; // 15 minutes
    
    const token = await new SignJWT({
      ...payload,
      issued_at: now,
      expires_at: now + expiresIn,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(now)
      .setExpirationTime(now + expiresIn)
      .setSubject(payload.user_id)
      .setIssuer('axionlabs-api')
      .setAudience(payload.domain)
      .sign(this.secretKey);

    return token;
  }

  /**
   * Generate JWT refresh token (30 days)
   */
  async generateRefreshToken(userId: string, sessionId: string): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = 30 * 24 * 60 * 60; // 30 days
    
    const token = await new SignJWT({
      user_id: userId,
      session_id: sessionId,
      type: 'refresh',
      issued_at: now,
      expires_at: now + expiresIn,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(now)
      .setExpirationTime(now + expiresIn)
      .setSubject(userId)
      .setIssuer('axionlabs-api')
      .sign(this.secretKey);

    return token;
  }

  /**
   * Generate temporary cross-domain token (5 minutes)
   */
  async generateTempToken(userId: string, targetDomain: string, permissions: string[] = []): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = 5 * 60; // 5 minutes
    
    const token = await new SignJWT({
      user_id: userId,
      target_domain: targetDomain,
      permissions,
      type: 'temporary',
      issued_at: now,
      expires_at: now + expiresIn,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(now)
      .setExpirationTime(now + expiresIn)
      .setSubject(userId)
      .setIssuer('axionlabs-api')
      .setAudience(targetDomain)
      .sign(this.secretKey);

    return token;
  }

  /**
   * Verify and decode JWT token
   */
  async verifyToken(token: string, expectedAudience?: string): Promise<any> {
    try {
      const { payload } = await jwtVerify(token, this.secretKey, {
        issuer: 'axionlabs-api',
        audience: expectedAudience,
      });

      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      if (payload.expires_at && payload.expires_at < now) {
        throw new Error('Token expired');
      }

      return payload;
    } catch (error) {
      throw new Error(`Invalid token: ${error.message}`);
    }
  }

  /**
   * Extract token from Authorization header
   */
  extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  /**
   * Create token hash for database storage
   */
  async createTokenHash(token: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate secure random string for session IDs
   */
  generateSecureId(): string {
    return crypto.randomUUID();
  }
}