import { createHealthRoutes } from '../src/routes/health';

describe('Health Routes', () => {
  const healthRouter = createHealthRoutes();
  const mockEnv = global.createMockEnv();
  const mockContext = global.createMockContext();

  describe('GET /health/ping', () => {
    it('should return healthy status', async () => {
      const request = global.createMockRequest('http://localhost/health/ping');
      const response = await healthRouter.fetch(request, mockEnv, mockContext);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.status).toBe('ok');
      expect(data.data.service).toBe('axionlabs-api');
    });
  });

  describe('GET /health/ready', () => {
    it('should return readiness status', async () => {
      const request = global.createMockRequest('http://localhost/health/ready');
      const response = await healthRouter.fetch(request, mockEnv, mockContext);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.checks).toBeDefined();
    });
  });

  describe('GET /health/metrics', () => {
    it('should return metrics', async () => {
      const request = global.createMockRequest('http://localhost/health/metrics');
      const response = await healthRouter.fetch(request, mockEnv, mockContext);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.timestamp).toBeDefined();
    });
  });
});