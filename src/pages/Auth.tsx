
import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrowLeft, Github, Mail } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { EnterpriseOnboarding } from '@/components/auth/EnterpriseOnboarding';

export default function Auth() {
  const { signIn, signUp, signInWithGoogle, signInWithGithub, isAuthenticated, user, profile } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { theme } = useTheme();
  
  // Logo source based on theme
  const logoSrc = theme === "dark" 
    ? "/lovable-uploads/1649c4bf-c03b-4d41-b660-4a2d8eded619.png"
    : "/lovable-uploads/b799f614-ce3b-419b-be33-2205f81930dc.png";
  
  // Check if user needs onboarding
  useEffect(() => {
    if (isAuthenticated && user && profile) {
      if (!profile.profile_completed) {
        setShowOnboarding(true);
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, profile, navigate]);
  
  // Redirect if already authenticated and profile is complete
  if (isAuthenticated && profile?.profile_completed) {
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
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-background theme-transition">
      <header className="w-full p-4 md:p-6 flex justify-between items-center z-10">
        <Link to="/" className="flex items-center gap-2 text-foreground hover:text-quantum-cyan transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>
        <ThemeToggle />
      </header>
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
        <Card className="w-full max-w-md quantum-glass neural-border">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <img src={logoSrc} alt="AxionLabs Logo" className="h-12 theme-transition" />
            </div>
            <CardTitle className="heading text-2xl">
              {showOnboarding ? 'Welcome to AxionLabs' : 'Welcome to AxionLabs'}
            </CardTitle>
            <CardDescription className="text-foreground/80">
              {showOnboarding 
                ? "Let's set up your enterprise profile" 
                : resetPasswordMode 
                  ? "Reset your password" 
                  : "Enterprise-grade AI solutions"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {showOnboarding && user ? (
              <EnterpriseOnboarding user={user} onComplete={handleOnboardingComplete} />
            ) : resetPasswordMode ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-foreground">Email</Label>
                  <Input 
                    id="reset-email" 
                    type="email" 
                    placeholder="your.email@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background/50 border-white/20 focus:border-quantum-purple focus-quantum"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full energy-button rounded-lg py-3 neon-glow"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                <Button 
                  type="button"
                  variant="ghost" 
                  className="w-full text-sm mt-2 text-foreground/70 hover:text-quantum-cyan"
                  onClick={() => setResetPasswordMode(false)}
                >
                  Back to login
                </Button>
              </form>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  <Button 
                    type="button"
                    className="w-full flex items-center justify-center gap-2 border border-white/20 bg-background/50 hover:bg-quantum-purple/20 text-foreground backdrop-blur-xl"
                    onClick={handleGoogleSignIn}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="h-5 w-5">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </Button>
                  
                  <Button 
                    type="button"
                    className="w-full flex items-center justify-center gap-2 border border-white/20 bg-background/50 hover:bg-quantum-purple/20 text-foreground backdrop-blur-xl"
                    onClick={handleGithubSignIn}
                  >
                    <Github className="h-5 w-5" />
                    Continue with GitHub
                  </Button>
                  
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-white/20"></div>
                    <span className="mx-4 flex-shrink text-foreground/60 text-xs">OR</span>
                    <div className="flex-grow border-t border-white/20"></div>
                  </div>
                </div>
                
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-background/30 border border-white/10">
                    <TabsTrigger value="signin" className="data-[state=active]:bg-quantum-purple/20 data-[state=active]:text-quantum-cyan">Sign In</TabsTrigger>
                    <TabsTrigger value="signup" className="data-[state=active]:bg-quantum-purple/20 data-[state=active]:text-quantum-cyan">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="text-foreground">Email</Label>
                        <Input 
                          id="signin-email" 
                          type="email" 
                          placeholder="your.email@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-background/50 border-white/20 focus:border-quantum-purple focus-quantum"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-foreground">Password</Label>
                        <Input 
                          id="signin-password" 
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-background/50 border-white/20 focus:border-quantum-purple focus-quantum"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full energy-button rounded-lg py-3 neon-glow"
                        disabled={loading}
                      >
                        {loading ? 'Signing In...' : 'Sign In'}
                      </Button>
                      <Button 
                        type="button"
                        variant="link" 
                        className="w-full text-sm mt-2 text-quantum-cyan hover:text-quantum-magenta"
                        onClick={() => setResetPasswordMode(true)}
                      >
                        Forgot your password?
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-foreground">Work Email</Label>
                        <Input 
                          id="signup-email" 
                          type="email" 
                          placeholder="your.email@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-background/50 border-white/20 focus:border-quantum-purple focus-quantum"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-foreground">Password</Label>
                        <Input 
                          id="signup-password" 
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          minLength={6}
                          className="bg-background/50 border-white/20 focus:border-quantum-purple focus-quantum"
                          required
                        />
                        <p className="text-xs text-foreground/60">Must be at least 6 characters</p>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full energy-button rounded-lg py-3 neon-glow"
                        disabled={loading}
                      >
                        {loading ? 'Creating Account...' : 'Create Enterprise Account'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </CardContent>
          
          <CardFooter className="justify-center text-sm text-foreground/60">
            <p>Protected by AxionLabs encryption</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
