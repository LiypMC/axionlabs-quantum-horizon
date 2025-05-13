
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useTheme } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowLeft } from 'lucide-react';

export default function AccountUpdate() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  
  // Logo source based on theme
  const logoSrc = theme === "dark" 
    ? "/lovable-uploads/1649c4bf-c03b-4d41-b660-4a2d8eded619.png"
    : "/lovable-uploads/b799f614-ce3b-419b-be33-2205f81930dc.png";
  
  useEffect(() => {
    // Check if we have a hash fragment that indicates password recovery
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      // We're in password recovery mode
      toast.info('Please set your new password');
    } else if (!isAuthenticated) {
      // Not authenticated and not in recovery mode, redirect to auth
      navigate('/auth');
    } else if (user?.email) {
      // If we have the user email, set it
      setEmail(user.email);
    }
  }, [isAuthenticated, navigate, user]);
  
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your new email address');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ email });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Verification email sent to your new address', {
          description: 'Please check your email to confirm the change'
        });
        navigate('/');
      }
    } catch (error: any) {
      toast.error('Failed to update email');
      console.error('Update email error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      toast.error('Please enter your new password');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password updated successfully');
        navigate('/');
      }
    } catch (error: any) {
      toast.error('Failed to update password');
      console.error('Update password error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const isRecoveryMode = window.location.hash.includes('type=recovery');
  
  return (
    <div className="min-h-screen bg-background theme-transition animated-background-pulse">
      <header className="w-full p-4 md:p-6 flex justify-between items-center z-10">
        <Button 
          variant="ghost" 
          as={Link}
          to="/" 
          className="flex items-center gap-2 text-foreground hover:text-axion-blue transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </Button>
        <ThemeToggle />
      </header>
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6 animate-fade-in">
        <Card className="w-full max-w-md glass-panel border-axion-blue/30 neon-border">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <img src={logoSrc} alt="AxionLabs Logo" className="h-12 theme-transition" />
            </div>
            <CardTitle className="heading text-2xl">Account Settings</CardTitle>
            <CardDescription>Update your account information</CardDescription>
          </CardHeader>
          
          <CardContent>
            {isRecoveryMode ? (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/50"
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-axion-gray">Must be at least 6 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-background/50"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full glass-panel border-axion-blue text-axion-white hover:bg-axion-blue/20 neon-glow"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            ) : (
              <Tabs defaultValue="password" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="password">Password</TabsTrigger>
                  <TabsTrigger value="email">Email</TabsTrigger>
                </TabsList>
                
                <TabsContent value="password">
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input 
                        id="new-password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-background/50"
                        required
                        minLength={6}
                      />
                      <p className="text-xs text-axion-gray">Must be at least 6 characters</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-background/50"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full glass-panel border-axion-blue text-axion-white hover:bg-axion-blue/20 neon-glow"
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="email">
                  <form onSubmit={handleUpdateEmail} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-email">New Email</Label>
                      <Input 
                        id="new-email" 
                        type="email" 
                        placeholder="your.new.email@example.com"
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
                      {loading ? 'Updating...' : 'Update Email'}
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
