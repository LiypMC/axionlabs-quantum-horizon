import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { LoginForm } from '../components/auth/LoginForm'
import { SocialAuthButtons } from '../components/auth/SocialAuthButtons'
import { authApi } from '../lib/api'
import { validateRedirectUrl } from '../lib/utils'

export function Login() {
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [appInfo, setAppInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const redirectUrl = searchParams.get('redirect')
  const app = searchParams.get('app') || 'main'

  useEffect(() => {
    const loadAppInfo = async () => {
      try {
        const info = await authApi.getAppInfo(app, redirectUrl || undefined)
        setAppInfo(info)
      } catch (error) {
        console.error('Failed to load app info:', error)
        setAppInfo({
          title: 'Sign in to AxionLabs',
          description: 'Access your account and services',
          app_name: 'AxionLabs',
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadAppInfo()
  }, [app, redirectUrl])

  const handleLoginSuccess = async (data: any) => {
    setError(null)
    setSuccess('Successfully signed in! Redirecting...')

    // Handle redirect with temp token for cross-domain auth
    if (data.redirectUrl && validateRedirectUrl(data.redirectUrl)) {
      // Generate temporary token and redirect back to main site
      const tempToken = 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      const callbackUrl = new URL('/auth/callback', data.redirectUrl)
      callbackUrl.searchParams.set('token', tempToken)
      callbackUrl.searchParams.set('return_to', data.redirectUrl)
      
      setTimeout(() => {
        window.location.href = callbackUrl.toString()
      }, 1000)
    } else {
      // Default redirect to main site
      setTimeout(() => {
        window.location.href = 'https://axionslab.com'
      }, 1000)
    }
  }

  const handleLoginError = (error: string) => {
    setError(error)
    setSuccess(null)
  }

  if (isLoading) {
    return (
      <div className="auth-container flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mb-4"></div>
          <div className="h-4 w-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {appInfo?.title || 'Sign in to AxionLabs'}
          </h1>
          <p className="text-muted-foreground">
            {appInfo?.description || 'Access your account and services'}
          </p>
          {appInfo?.app_name && appInfo.app_name !== 'AxionLabs' && (
            <p className="text-sm text-primary">
              Continue to {appInfo.app_name}
            </p>
          )}
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-center space-x-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3 animate-fade-in">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md p-3 animate-fade-in">
            <CheckCircle2 className="h-4 w-4" />
            <span>{success}</span>
          </div>
        )}

        {/* Login Form */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <LoginForm
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              redirectUrl={redirectUrl || undefined}
              app={app}
            />

            <SocialAuthButtons
              redirectUrl={redirectUrl || undefined}
              app={app}
            />

            <div className="text-center space-y-2">
              <Button variant="link" size="sm" asChild>
                <Link to="/auth/register">
                  Don't have an account? Sign up
                </Link>
              </Button>
              <br />
              <Button variant="link" size="sm" asChild>
                <Link to="/auth/reset">
                  Forgot your password?
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>
            Protected by enterprise-grade security.{' '}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}