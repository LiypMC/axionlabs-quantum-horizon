import { Router } from 'itty-router';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import { DatabaseService } from '../services/database';

export function createHealthRoutes() {
  const router = Router({ base: '/health' });

  // Basic health check
  router.get('/ping', () => {
    return createSuccessResponse('API is healthy', {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'axionlabs-api'
    });
  });

  // Readiness check with database
  router.get('/ready', async (request: Request, env: any) => {
    try {
      const db = new DatabaseService(env);
      const dbHealthy = await db.isHealthy();
      
      const checks = {
        database: dbHealthy ? 'ok' : 'error',
        external_services: 'ok',
      };
      
      const allHealthy = Object.values(checks).every(status => status === 'ok');
      
      return createSuccessResponse(
        allHealthy ? 'Service ready' : 'Service not ready',
        {
          status: allHealthy ? 'ready' : 'not_ready',
          checks,
          timestamp: new Date().toISOString(),
        }
      );
    } catch (error) {
      return createErrorResponse('Health check failed', {
        error: (error as Error).message || 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    }
  });

  // System metrics
  router.get('/metrics', () => {
    return createSuccessResponse('Metrics endpoint', {
      uptime: 'not_available_in_workers',
      memory: 'not_available_in_workers',
      timestamp: new Date().toISOString(),
    });
  });

  return router;
}