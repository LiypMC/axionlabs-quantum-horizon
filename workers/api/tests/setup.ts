// Test setup file
import { jest } from '@jest/globals';

// Mock Cloudflare Workers environment
global.fetch = jest.fn();

// Mock environment variables
const mockEnv = {
  ENVIRONMENT: 'test',
  CORS_ORIGIN: '*',
  JWT_SECRET: 'test-secret',
};

// Global test utilities
global.createMockRequest = (url: string, options: RequestInit = {}) => {
  return new Request(url, {
    method: 'GET',
    ...options,
  });
};

global.createMockEnv = (overrides = {}) => ({
  ...mockEnv,
  ...overrides,
});

global.createMockContext = () => ({
  waitUntil: jest.fn(),
  passThroughOnException: jest.fn(),
});