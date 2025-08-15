import axios, { type AxiosResponse } from 'axios'
import { getApiUrl } from './utils'

const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use((config) => {
  // Add any auth headers if needed
  return config
}, (error) => {
  return Promise.reject(error)
})

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error)
    }
    if (error.message) {
      throw new Error(error.message)
    }
    throw new Error('Network error occurred')
  }
)

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  full_name?: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    full_name?: string
    role: string
  }
  access_token: string
  refresh_token: string
  expires_at: string
}

export interface AppInfo {
  title: string
  description: string
  app_name: string
  redirect_hint: string
  target_domain: string
  auth_endpoints: {
    login: string
    register: string
    oauth_google: string
    oauth_github: string
  }
}

// Auth API functions
export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials)
    return response.data.data!
  },

  async register(userData: RegisterRequest): Promise<{ user: any; message: string }> {
    const response = await api.post<ApiResponse<{ user: any; message: string }>>('/auth/register', userData)
    return response.data.data!
  },

  async getAppInfo(app?: string, domain?: string): Promise<AppInfo> {
    const params = new URLSearchParams()
    if (app) params.append('app', app)
    if (domain) params.append('domain', domain)
    
    const response = await api.get<ApiResponse<AppInfo>>(`/auth/app-info?${params}`)
    return response.data.data!
  },

  async checkCrossDomainStatus(domain: string): Promise<{
    authenticated: boolean
    user?: any
    auth_url?: string
    target_domain: string
  }> {
    const response = await api.get<ApiResponse<any>>(`/auth/cross-domain/status?domain=${domain}`)
    return response.data.data!
  },

  async exchangeTempToken(tempToken: string, targetDomain: string): Promise<{
    access_token: string
    user: any
  }> {
    const response = await api.post<ApiResponse<any>>('/auth/cross-domain/callback', {
      temp_token: tempToken,
      target_domain: targetDomain,
      return_url: '/'
    })
    return response.data.data!
  },

  getOAuthUrl(provider: 'google' | 'github', redirectUri: string, app?: string): string {
    const params = new URLSearchParams()
    params.append('redirect_uri', redirectUri)
    if (app) params.append('app', app)
    
    return `${getApiUrl()}/auth/oauth/${provider}?${params}`
  }
}

export default api