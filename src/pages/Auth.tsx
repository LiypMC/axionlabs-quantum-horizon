
import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrowLeft, Github, Mail, Shield, Zap, Cpu } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { EnterpriseOnboarding } from '@/components/auth/EnterpriseOnboarding';

export default function Auth() {
  const { signIn, signUp, signInWithGoogle, signInWithGithub, isAuthenticated, user, profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { theme } = useTheme();
  
  // Get redirect URL from query params
  const redirectTo = searchParams.get('redirect_to');
  
  // Logo source - always use dark theme logo
  const logoSrc = "/lovable-uploads/1649c4bf-c03b-4d41-b660-4a2d8eded619.png";
  
  // Check if user needs onboarding or should be redirected
  useEffect(() => {
    if (isAuthenticated && user && profile) {
      if (!profile.profile_completed) {
        setShowOnboarding(true);
      } else {
        // If there's a redirect URL, use it; otherwise go to home
        if (redirectTo) {
          window.location.href = redirectTo;
        } else {
          navigate('/');
        }
      }
    }
  }, [isAuthenticated, user, profile, navigate, redirectTo]);
  
  // Redirect if already authenticated and profile is complete
  if (isAuthenticated && profile?.profile_completed) {
    if (redirectTo) {
      window.location.href = redirectTo;
      return null;
    }
    return <Navigate to="/" />;
  }
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error(error.message);
      }
    } catch (error: any) {
      toast.error('Failed to sign in');
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await signUp(email, password);
      
      if (error) {
        toast.error(error.message);
      }
    } catch (error: any) {
      toast.error('Failed to sign up');
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account/update-password`,
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password reset email sent', {
          description: 'Check your email for a password reset link'
        });
        setResetPasswordMode(false);
      }
    } catch (error: any) {
      toast.error('Failed to send reset email');
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      toast.error('Failed to sign in with Google');
      console.error('Google sign in error:', error);
    }
  };
  
  const handleGithubSignIn = async () => {
    try {
      await signInWithGithub();
    } catch (error: any) {
      toast.error('Failed to sign in with GitHub');
      console.error('GitHub sign in error:', error);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    if (redirectTo) {
      window.location.href = redirectTo;
    } else {
      navigate('/');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-neural-grid opacity-30" />
      <div className="absolute inset-0 bg-energy-field" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary/5 rounded-full blur-lg animate-pulse delay-500" />
      
      <header className="relative z-10 w-full p-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 text-foreground hover:text-primary transition-all duration-300 group">
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </Link>
        <ThemeToggle />
      </header>
      
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] p-6">
        <Card className="w-full max-w-lg glass-panel border-primary/20 shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img src={logoSrc} alt="AxionLabs Logo" className="h-16 drop-shadow-lg" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl -z-10" />
              </div>
            </div>
            <CardTitle className="heading text-3xl">
              {showOnboarding ? 'Welcome to AxionLabs' : 'Access Quantum Innovation'}
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              {showOnboarding 
                ? "Complete your quantum research profile" 
                : resetPasswordMode 
                  ? "Reset your quantum access credentials" 
                  : "Join the future of quantum computing and AI research"}
            </CardDescription>
            
            {!showOnboarding && !resetPasswordMode && (
              <div className="flex items-center justify-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-accent" />
                  <span>Quantum Ready</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Cpu className="h-4 w-4 text-primary" />
                  <span>AI Powered</span>
                </div>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            {showOnboarding && user ? (
              <EnterpriseOnboarding user={user} onComplete={handleOnboardingComplete} />
            ) : resetPasswordMode ? (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-foreground font-medium">Email Address</Label>
                  <Input 
                    id="reset-email" 
                    type="email" 
                    placeholder="researcher@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold shadow-lg"
                  disabled={loading}
                >
                  {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
                </Button>
                <Button 
                  type="button"
                  variant="ghost" 
                  className="w-full text-muted-foreground hover:text-primary"
                  onClick={() => setResetPasswordMode(false)}
                >
                  ← Back to Sign In
                </Button>
              </form>
            ) : (
              <>
                <div className="space-y-4">
                  <Button 
                    type="button"
                    className="w-full h-12 flex items-center justify-center gap-3 border border-border/50 bg-background/30 hover:bg-background/50 text-foreground backdrop-blur-sm font-medium"
                    onClick={handleGoogleSignIn}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </Button>
                  
                  <Button 
                    type="button"
                    className="w-full h-12 flex items-center justify-center gap-3 border border-border/50 bg-background/30 hover:bg-background/50 text-foreground backdrop-blur-sm font-medium"
                    onClick={handleGithubSignIn}
                  >
                    <Github className="h-5 w-5" />
                    Continue with GitHub
                  </Button>
                  
                  <div className="relative flex items-center py-4">
                    <div className="flex-grow border-t border-border/50" />
                    <span className="mx-4 text-muted-foreground text-sm font-medium">OR CONTINUE WITH EMAIL</span>
                    <div className="flex-grow border-t border-border/50" />
                  </div>
                </div>
                
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-background/20 border border-border/30">
                    <TabsTrigger value="signin" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-medium">Sign In</TabsTrigger>
                    <TabsTrigger value="signup" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-medium">Create Account</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin" className="space-y-6">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="text-foreground font-medium">Email Address</Label>
                        <Input 
                          id="signin-email" 
                          type="email" 
                          placeholder="researcher@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-foreground font-medium">Password</Label>
                        <Input 
                          id="signin-password" 
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold shadow-lg"
                        disabled={loading}
                      >
                        {loading ? 'Signing In...' : 'Access Quantum Platform'}
                      </Button>
                      <Button 
                        type="button"
                        variant="link" 
                        className="w-full text-primary hover:text-primary/80 font-medium"
                        onClick={() => setResetPasswordMode(true)}
                      >
                        Forgot your password?
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup" className="space-y-6">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-foreground font-medium">Work Email</Label>
                        <Input 
                          id="signup-email" 
                          type="email" 
                          placeholder="researcher@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-foreground font-medium">Password</Label>
                        <Input 
                          id="signup-password" 
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          minLength={6}
                          className="h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20"
                          required
                        />
                        <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold shadow-lg"
                        disabled={loading}
                      >
                        {loading ? 'Creating Account...' : 'Join Quantum Research'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </CardContent>
          
          <CardFooter className="justify-center pt-6 border-t border-border/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <p>Protected by AxionLabs quantum encryption</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
