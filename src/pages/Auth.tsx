
import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Auth() {
  const { signIn, signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const { theme } = useTheme();
  
  // Logo source based on theme
  const logoSrc = theme === "dark" 
    ? "/lovable-uploads/1649c4bf-c03b-4d41-b660-4a2d8eded619.png"
    : "/lovable-uploads/b799f614-ce3b-419b-be33-2205f81930dc.png";
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error(error.message);
      } else {
        navigate('/');
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
  
  return (
    <div className="min-h-screen bg-background theme-transition animated-background-pulse">
      <header className="w-full p-4 md:p-6 flex justify-between items-center z-10">
        <Link to="/" className="flex items-center gap-2 text-foreground hover:text-axion-blue transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>
        <ThemeToggle />
      </header>
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6 animate-fade-in">
        <Card className="w-full max-w-md glass-panel border-axion-blue/30 neon-border">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <img src={logoSrc} alt="AxionLabs Logo" className="h-12 theme-transition" />
            </div>
            <CardTitle className="heading text-2xl">Welcome to AxionLabs</CardTitle>
            <CardDescription>
              {resetPasswordMode 
                ? "Reset your password" 
                : "Sign in or create an account"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {resetPasswordMode ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input 
                    id="reset-email" 
                    type="email" 
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background/50"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full glass-panel border-axion-blue text-axion-white hover:bg-axion-blue/20 neon-glow"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                <Button 
                  type="button"
                  variant="ghost" 
                  className="w-full text-sm mt-2"
                  onClick={() => setResetPasswordMode(false)}
                >
                  Back to login
                </Button>
              </form>
            ) : (
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input 
                        id="signin-email" 
                        type="email" 
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-background/50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input 
                        id="signin-password" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-background/50"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full glass-panel border-axion-blue text-axion-white hover:bg-axion-blue/20 neon-glow"
                      disabled={loading}
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                    <Button 
                      type="button"
                      variant="link" 
                      className="w-full text-sm mt-2"
                      onClick={() => setResetPasswordMode(true)}
                    >
                      Forgot your password?
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input 
                        id="signup-email" 
                        type="email" 
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-background/50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input 
                        id="signup-password" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                        className="bg-background/50"
                        required
                      />
                      <p className="text-xs text-axion-gray">Must be at least 6 characters</p>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full glass-panel border-axion-blue text-axion-white hover:bg-axion-blue/20 neon-glow"
                      disabled={loading}
                    >
                      {loading ? 'Signing Up...' : 'Sign Up'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
          
          <CardFooter className="justify-center text-sm text-axion-gray">
            <p>Protected by AxionLabs encryption</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
