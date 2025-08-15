import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { RegisterForm } from '../components/auth/RegisterForm'
import { SocialAuthButtons } from '../components/auth/SocialAuthButtons'

export function Register() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleRegisterSuccess = () => {
    setError(null)
    setSuccess('Account created successfully! Please check your email to verify your account.')
  }

  const handleRegisterError = (error: string) => {
    setError(error)
    setSuccess(null)
  }

  if (success) {
    return (
      <div className="auth-container flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Account Created!</CardTitle>
              <CardDescription>
                We've sent a verification link to your email address.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Please check your email and click the verification link to activate your account.
              </p>
              <Button asChild>
                <Link to="/auth/login">
                  Continue to Sign In
                </Link>
              </Button>
            </CardContent>
          </Card>
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
            Create your account
          </h1>
          <p className="text-muted-foreground">
            Join AxionLabs and start building with AI
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center space-x-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3 animate-fade-in">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Get started for free</CardTitle>
            <CardDescription>
              Create your account to access all features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RegisterForm
              onSuccess={handleRegisterSuccess}
              onError={handleRegisterError}
            />

            <SocialAuthButtons />

            <div className="text-center">
              <Button variant="link" size="sm" asChild>
                <Link to="/auth/login">
                  Already have an account? Sign in
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>
            By creating an account, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}