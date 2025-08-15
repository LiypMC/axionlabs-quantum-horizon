export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number;
  expires?: Date;
  domain?: string;
  path?: string;
}

export class CookieService {
  /**
   * Set secure authentication cookie
   */
  static setAuthCookie(
    response: Response,
    name: string,
    value: string,
    options: CookieOptions = {}
  ): Response {
    const defaultOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    };

    const cookieOptions = { ...defaultOptions, ...options };
    const cookieValue = this.serializeCookie(name, value, cookieOptions);

    const headers = new Headers(response.headers);
    headers.append('Set-Cookie', cookieValue);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  /**
   * Set cross-domain authentication cookie
   */
  static setCrossDomainAuthCookie(
    response: Response,
    tempToken: string,
    targetDomain: string
  ): Response {
    const cookieOptions: CookieOptions = {
      httpOnly: false, // Needs to be accessible by JavaScript for cross-domain
      secure: true,
      sameSite: 'none', // Required for cross-domain
      maxAge: 5 * 60, // 5 minutes
      domain: `.${this.getBaseDomain(targetDomain)}`,
      path: '/',
    };

    return this.setAuthCookie(response, 'axl_temp_token', tempToken, cookieOptions);
  }

  /**
   * Set session cookie for specific domain
   */
  static setSessionCookie(
    response: Response,
    accessToken: string,
    domain: string
  ): Response {
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes (matches access token expiry)
      domain: `.${this.getBaseDomain(domain)}`,
      path: '/',
    };

    return this.setAuthCookie(response, 'axl_session', accessToken, cookieOptions);
  }

  /**
   * Set refresh token cookie
   */
  static setRefreshTokenCookie(
    response: Response,
    refreshToken: string,
    domain: string
  ): Response {
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      domain: `.${this.getBaseDomain(domain)}`,
      path: '/auth', // Only accessible to auth endpoints
    };

    return this.setAuthCookie(response, 'axl_refresh', refreshToken, cookieOptions);
  }

  /**
   * Clear authentication cookies
   */
  static clearAuthCookies(response: Response, domain: string): Response {
    const baseDomain = this.getBaseDomain(domain);
    const expiredDate = new Date(0);

    const cookiesToClear = [
      'axl_session',
      'axl_refresh',
      'axl_temp_token'
    ];

    let headers = new Headers(response.headers);

    for (const cookieName of cookiesToClear) {
      const clearCookie = this.serializeCookie(cookieName, '', {
        expires: expiredDate,
        domain: `.${baseDomain}`,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      });

      headers.append('Set-Cookie', clearCookie);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  /**
   * Parse cookies from request
   */
  static parseCookies(request: Request): Record<string, string> {
    const cookieHeader = request.headers.get('Cookie');
    if (!cookieHeader) return {};

    const cookies: Record<string, string> = {};
    
    cookieHeader.split(';').forEach(cookie => {
      const [name, ...rest] = cookie.trim().split('=');
      if (name && rest.length > 0) {
        cookies[name] = decodeURIComponent(rest.join('='));
      }
    });

    return cookies;
  }

  /**
   * Get specific cookie value
   */
  static getCookie(request: Request, name: string): string | null {
    const cookies = this.parseCookies(request);
    return cookies[name] || null;
  }

  /**
   * Check if request has valid session cookie
   */
  static hasValidSessionCookie(request: Request): boolean {
    const sessionCookie = this.getCookie(request, 'axl_session');
    return !!sessionCookie && sessionCookie.length > 0;
  }

  /**
   * Create authentication response with cookies
   */
  static createAuthResponse(
    data: any,
    accessToken: string,
    refreshToken: string,
    domain: string
  ): Response {
    let response = new Response(JSON.stringify({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Set session and refresh token cookies
    response = this.setSessionCookie(response, accessToken, domain);
    response = this.setRefreshTokenCookie(response, refreshToken, domain);

    return response;
  }

  /**
   * Create cross-domain redirect response
   */
  static createCrossDomainRedirect(
    redirectUrl: string,
    tempToken: string,
    targetDomain: string
  ): Response {
    let response = new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl,
      },
    });

    // Set temporary token cookie for cross-domain transfer
    response = this.setCrossDomainAuthCookie(response, tempToken, targetDomain);

    return response;
  }

  // Private helper methods

  private static serializeCookie(
    name: string,
    value: string,
    options: CookieOptions
  ): string {
    let cookie = `${name}=${encodeURIComponent(value)}`;

    if (options.expires) {
      cookie += `; Expires=${options.expires.toUTCString()}`;
    }

    if (options.maxAge) {
      cookie += `; Max-Age=${options.maxAge}`;
    }

    if (options.domain) {
      cookie += `; Domain=${options.domain}`;
    }

    if (options.path) {
      cookie += `; Path=${options.path}`;
    }

    if (options.secure) {
      cookie += '; Secure';
    }

    if (options.httpOnly) {
      cookie += '; HttpOnly';
    }

    if (options.sameSite) {
      cookie += `; SameSite=${options.sameSite}`;
    }

    return cookie;
  }

  private static getBaseDomain(domain: string): string {
    // Extract base domain (e.g., chat.axionslab.com -> axionslab.com)
    const parts = domain.split('.');
    if (parts.length <= 2) {
      return domain;
    }
    return parts.slice(-2).join('.');
  }
}