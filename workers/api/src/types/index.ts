// Environment bindings
export interface Env {
  // Environment variables
  ENVIRONMENT: string;
  CORS_ORIGIN: string;
  JWT_SECRET: string;
  GOOGLE_OAUTH_CLIENT_ID?: string;
  GOOGLE_OAUTH_CLIENT_SECRET?: string;
  GITHUB_OAUTH_CLIENT_ID?: string;
  GITHUB_OAUTH_CLIENT_SECRET?: string;
  
  // Cloudflare bindings (commented out until configured)
  // DB: D1Database;
  // SESSIONS: KVNamespace;
  // FILES: R2Bucket;
  // AI: Ai;
}

// Request context
export interface RequestContext {
  request: Request;
  env: Env;
  ctx: ExecutionContext;
}

// User types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'user' | 'admin' | 'enterprise' | 'super_admin';
  organization_id?: string;
  created_at: string;
  updated_at: string;
}

// Auth types
export interface AuthToken {
  user_id: string;
  email: string;
  role: string;
  organization_id?: string;
  permissions: string[];
  issued_at: number;
  expires_at: number;
  domain: string;
  app_access: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

export interface OAuthProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  provider: 'google' | 'github';
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Error types
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}