import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getApiUrl(): string {
  return import.meta.env.VITE_API_URL || 'https://axionlabs-api.a-contactnaol.workers.dev'
}

export function getRedirectUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    return urlObj.searchParams.get('redirect')
  } catch {
    return null
  }
}

export function getAppFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.searchParams.get('app') || 'main'
  } catch {
    return 'main'
  }
}

export function validateRedirectUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const allowedDomains = [
      'axionslab.com',
      'chat.axionslab.com', 
      'admin.axionslab.com',
      'docs.axionslab.com',
      'localhost'
    ]
    
    return allowedDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
    )
  } catch {
    return false
  }
}

export function formatError(error: any): string {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.error) return error.error
  return 'An unexpected error occurred'
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}