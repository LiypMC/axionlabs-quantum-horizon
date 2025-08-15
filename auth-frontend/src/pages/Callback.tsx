import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { authApi } from '../lib/api'

export function Callback() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if this is a temp token callback
        const tempToken = searchParams.get('token')
        const returnTo = searchParams.get('return_to')
        
        if (tempToken) {
          // Handle cross-domain temp token exchange
          const targetDomain = window.location.hostname
          const result = await authApi.exchangeTempToken(tempToken, targetDomain)
          
          setStatus('success')
          setMessage('Authentication successful! Redirecting...')
          
          // Redirect to the return URL or default
          const finalRedirectUrl = returnTo || '/'
          setRedirectUrl(finalRedirectUrl)
          
          // Store auth token if needed
          if (result.access_token) {
            // You might want to store this in a cookie or localStorage
            // depending on your auth strategy
          }
          
          // Redirect after a short delay
          setTimeout(() => {
            window.location.href = finalRedirectUrl
          }, 2000)
          
        } else {
          // Handle OAuth callback
          const code = searchParams.get('code')
          const state = searchParams.get('state')
          const error = searchParams.get('error')
          
          if (error) {
            throw new Error(`OAuth error: ${error}`)
          }
          
          if (!code || !state) {
            throw new Error('Missing OAuth parameters')
          }
          
          // Get redirect info from session storage
          const savedRedirect = sessionStorage.getItem('auth_redirect')
          
          // Clean up session storage
          sessionStorage.removeItem('auth_redirect')
          sessionStorage.removeItem('auth_app')
          
          setStatus('success')
          setMessage('OAuth authentication successful! Redirecting...')
          
          // Redirect to saved URL or default
          const finalRedirectUrl = savedRedirect || 'https://axionslab.com'
          setRedirectUrl(finalRedirectUrl)
          
          setTimeout(() => {
            window.location.href = finalRedirectUrl
          }, 2000)
        }
        
      } catch (error: any) {
        console.error('Callback error:', error)
        setStatus('error')
        setMessage(error.message || 'Authentication failed')
      }
    }

    handleCallback()
  }, [searchParams])

  return (
    <div className="auth-container flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full flex items-center justify-center">
              {status === 'loading' && (
                <Loader2 className="h-6 w-6 text-primary loading-spinner" />
              )}
              {status === 'success' && (
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              )}
              {status === 'error' && (
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              )}
            </div>
            <CardTitle>
              {status === 'loading' && 'Processing Authentication...'}
              {status === 'success' && 'Authentication Successful!'}
              {status === 'error' && 'Authentication Failed'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              {message}
            </p>
            
            {status === 'success' && redirectUrl && (
              <p className="text-xs text-muted-foreground">
                Redirecting to {new URL(redirectUrl).hostname}...
              </p>
            )}
            
            {status === 'error' && (
              <div className="space-y-3">
                <Button asChild>
                  <a href="/auth/login">
                    Try Again
                  </a>
                </Button>
                <p className="text-xs text-muted-foreground">
                  If this problem persists, please contact support.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}