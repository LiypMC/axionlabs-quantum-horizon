import { createCrossDomainRoutes } from '../src/routes/cross-domain';

describe('Cross-Domain Auth Routes', () => {
  const crossDomainRouter = createCrossDomainRoutes();
  const mockEnv = global.createMockEnv({
    JWT_SECRET: 'test-secret-key-for-jwt-signing',
  });
  const mockContext = global.createMockContext();

  describe('GET /auth/check-session', () => {
    it('should redirect to login when no session exists', async () => {
      const request = global.createMockRequest(
        'http://localhost/auth/check-session?domain=chat.axionslab.com&app=gideon'
      );

      const response = await crossDomainRouter.fetch(request, mockEnv, mockContext);
      expect(response.status).toBe(302);

      const location = response.headers.get('Location');
      expect(location).toContain('axionslab.com/auth');
      expect(location).toContain('redirect=chat.axionslab.com');
      expect(location).toContain('app=gideon');
    });

    it('should require domain parameter', async () => {
      const request = global.createMockRequest('http://localhost/auth/check-session');

      const response = await crossDomainRouter.fetch(request, mockEnv, mockContext);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('Target domain is required');
    });
  });

  describe('GET /auth/cross-domain/status', () => {
    it('should return not authenticated when no session', async () => {
      const request = global.createMockRequest(
        'http://localhost/auth/cross-domain/status?domain=chat.axionslab.com'
      );

      const response = await crossDomainRouter.fetch(request, mockEnv, mockContext);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.authenticated).toBe(false);
      expect(data.data.target_domain).toBe('chat.axionslab.com');
      expect(data.data.auth_url).toContain('axionslab.com/auth');
    });
  });

  describe('GET /auth/app-info', () => {
    it('should return chat app info', async () => {
      const request = global.createMockRequest(
        'http://localhost/auth/app-info?app=chat&domain=chat.axionslab.com'
      );

      const response = await crossDomainRouter.fetch(request, mockEnv, mockContext);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.title).toBe('Sign in to access Gideon AI');
      expect(data.data.app_name).toBe('Gideon Chat');
      expect(data.data.target_domain).toBe('chat.axionslab.com');
      expect(data.data.auth_endpoints).toBeDefined();
    });

    it('should return admin app info', async () => {
      const request = global.createMockRequest(
        'http://localhost/auth/app-info?app=admin&domain=admin.axionslab.com'
      );

      const response = await crossDomainRouter.fetch(request, mockEnv, mockContext);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.title).toBe('Sign in to Admin Dashboard');
      expect(data.data.app_name).toBe('Admin Dashboard');
    });

    it('should return default app info for unknown apps', async () => {
      const request = global.createMockRequest(
        'http://localhost/auth/app-info?app=unknown'
      );

      const response = await crossDomainRouter.fetch(request, mockEnv, mockContext);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.title).toBe('Sign in to AxionLabs');
      expect(data.data.app_name).toBe('AxionLabs');
    });
  });

  describe('GET /auth/domains/validate', () => {
    it('should validate allowed domains', async () => {
      const request = global.createMockRequest(
        'http://localhost/auth/domains/validate?domain=chat.axionslab.com'
      );

      const response = await crossDomainRouter.fetch(request, mockEnv, mockContext);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.domain).toBe('chat.axionslab.com');
      expect(data.data.is_valid).toBe(true);
      expect(data.data.allowed_apps).toContain('chat');
    });

    it('should reject invalid domains', async () => {
      const request = global.createMockRequest(
        'http://localhost/auth/domains/validate?domain=malicious.com'
      );

      const response = await crossDomainRouter.fetch(request, mockEnv, mockContext);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.domain).toBe('malicious.com');
      expect(data.data.is_valid).toBe(false);
      expect(data.data.allowed_apps).toEqual([]);
    });

    it('should require domain parameter', async () => {
      const request = global.createMockRequest('http://localhost/auth/domains/validate');

      const response = await crossDomainRouter.fetch(request, mockEnv, mockContext);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('Domain parameter is required');
    });
  });
});