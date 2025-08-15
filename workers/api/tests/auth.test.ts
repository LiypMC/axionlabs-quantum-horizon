import { createAuthRoutes } from '../src/routes/auth';

describe('Auth Routes', () => {
  const authRouter = createAuthRoutes();
  const mockEnv = global.createMockEnv({
    JWT_SECRET: 'test-secret-key-for-jwt-signing',
    GOOGLE_OAUTH_CLIENT_ID: 'test-google-client-id',
    GOOGLE_OAUTH_CLIENT_SECRET: 'test-google-client-secret',
    GITHUB_OAUTH_CLIENT_ID: 'test-github-client-id',
    GITHUB_OAUTH_CLIENT_SECRET: 'test-github-client-secret',
  });
  const mockContext = global.createMockContext();

  describe('POST /auth/login', () => {
    it('should login with valid demo credentials', async () => {
      const request = global.createMockRequest('http://localhost/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'demo@axionslab.com',
          password: 'demo123',
        }),
      });

      const response = await authRouter.fetch(request, mockEnv, mockContext);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.user).toBeDefined();
      expect(data.data.access_token).toBeDefined();
      expect(data.data.refresh_token).toBeDefined();
      expect(data.data.user.email).toBe('demo@axionslab.com');
    });

    it('should reject invalid credentials', async () => {
      const request = global.createMockRequest('http://localhost/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'invalid@example.com',
          password: 'wrongpassword',
        }),
      });

      const response = await authRouter.fetch(request, mockEnv, mockContext);
      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid credentials');
    });

    it('should validate email format', async () => {
      const request = global.createMockRequest('http://localhost/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'password123',
        }),
      });

      const response = await authRouter.fetch(request, mockEnv, mockContext);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain('Invalid email format');
    });
  });

  describe('POST /auth/register', () => {
    it('should register new user with valid data', async () => {
      const request = global.createMockRequest('http://localhost/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'newuser@example.com',
          password: 'SecurePassword123!',
          full_name: 'New User',
        }),
      });

      const response = await authRouter.fetch(request, mockEnv, mockContext);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.user).toBeDefined();
      expect(data.data.user.email).toBe('newuser@example.com');
      expect(data.data.user.full_name).toBe('New User');
    });

    it('should reject weak passwords', async () => {
      const request = global.createMockRequest('http://localhost/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'newuser@example.com',
          password: '123',
          full_name: 'New User',
        }),
      });

      const response = await authRouter.fetch(request, mockEnv, mockContext);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain('security requirements');
    });
  });

  describe('GET /auth/oauth/google', () => {
    it('should redirect to Google OAuth', async () => {
      const request = global.createMockRequest(
        'http://localhost/auth/oauth/google?redirect_uri=https://axionslab.com/auth/callback'
      );

      const response = await authRouter.fetch(request, mockEnv, mockContext);
      expect(response.status).toBe(302);

      const location = response.headers.get('Location');
      expect(location).toContain('accounts.google.com');
      expect(location).toContain('client_id=test-google-client-id');
    });

    it('should reject invalid redirect URI', async () => {
      const request = global.createMockRequest(
        'http://localhost/auth/oauth/google?redirect_uri=https://malicious.com'
      );

      const response = await authRouter.fetch(request, mockEnv, mockContext);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid redirect URI');
    });
  });

  describe('GET /auth/oauth/github', () => {
    it('should redirect to GitHub OAuth', async () => {
      const request = global.createMockRequest(
        'http://localhost/auth/oauth/github?redirect_uri=https://axionslab.com/auth/callback'
      );

      const response = await authRouter.fetch(request, mockEnv, mockContext);
      expect(response.status).toBe(302);

      const location = response.headers.get('Location');
      expect(location).toContain('github.com/login/oauth/authorize');
      expect(location).toContain('client_id=test-github-client-id');
    });
  });
});