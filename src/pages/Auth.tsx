
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { AuthShowcase } from "@/components/auth/AuthShowcase";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { useTheme } from "@/contexts/ThemeContext";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("signin");
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);
  const { signIn, signUp, isAuthenticated, loading } = useAuth();
  const { theme } = useTheme();

  // Redirect if already authenticated
  if (!loading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message || "Failed to sign in");
      }
    } catch (error: any) {
      setError(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Basic password strength validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message || "Failed to sign up");
      } else {
        setMessage("Check your email for the confirmation link!");
      }
    } catch (error: any) {
      setError(error.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setMessage("");
    setShowPasswordStrength(false);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    resetForm();
  };

  return (
    <div 
      className="min-h-screen flex overflow-hidden"
      style={{ 
        backgroundColor: theme === 'dark' ? 'hsl(var(--color-background))' : '#000000',
        color: theme === 'dark' ? 'hsl(var(--color-foreground))' : '#ffffff'
      }}
    >
      {/* Left Panel - AI Showcase (60%) */}
      <div className="hidden lg:flex lg:w-3/5 relative bg-gradient-to-br from-black via-gray-900/80 to-black">
        {/* Enhanced Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Spline 3D Scene */}
          <div className="absolute inset-0 transform origin-center">
            <iframe 
              src='https://my.spline.design/particles-M8cFBTt81yqFzQOHv7R06Ql3/' 
              frameBorder='0' 
              width='100%' 
              height='100%'
              className="w-full h-full opacity-40"
              loading="lazy"
              title="3D Particle Background"
            />
          </div>
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
          
          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/25 rounded-full animate-pulse animate-particle-drift" />
            <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse animate-particle-drift-delayed" />
            <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse animate-particle-drift-slow" />
            <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-white/15 rounded-full animate-pulse animate-particle-drift" />
          </div>
        </div>
        
        {/* Showcase Content */}
        <div className="relative z-10 w-full">
          <AuthShowcase />
        </div>
      </div>

      {/* Right Panel - Authentication (40%) */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-6 lg:p-12 relative">
        {/* Mobile Background */}
        <div className="lg:hidden absolute inset-0 z-0 bg-gradient-to-br from-black via-gray-900/80 to-black">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
        </div>
        
        {/* Back to Home Link */}
        <Link 
          to="/" 
          className="absolute top-6 left-6 z-10 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '9999px',
            padding: '0.5rem 1rem',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>

        {/* Authentication Form */}
        <div className="w-full max-w-md z-10">
          <Card 
            className="border-white/10 backdrop-blur-xl shadow-2xl"
            style={{ 
              backgroundColor: theme === 'dark' ? 'hsl(var(--color-surface))' : 'rgba(0, 0, 0, 0.8)',
              borderColor: theme === 'dark' ? 'hsl(var(--color-border))' : 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold" style={{ color: theme === 'dark' ? 'hsl(var(--color-foreground))' : '#ffffff' }}>
                Welcome to AxionsLab
              </CardTitle>
              <CardDescription style={{ color: theme === 'dark' ? 'hsl(var(--color-foreground-muted))' : 'rgba(255, 255, 255, 0.7)' }}>
                {activeTab === "signin" 
                  ? "Sign in to access your account" 
                  : "Create your account to get started"
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Social Auth Buttons */}
              <SocialAuthButtons mode={activeTab as "signin" | "signup"} />
              
              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span 
                    className="w-full border-t" 
                    style={{ borderColor: theme === 'dark' ? 'hsl(var(--color-border))' : 'rgba(255, 255, 255, 0.2)' }}
                  />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span 
                    className="px-2"
                    style={{ 
                      backgroundColor: theme === 'dark' ? 'hsl(var(--color-surface))' : 'rgba(0, 0, 0, 0.8)',
                      color: theme === 'dark' ? 'hsl(var(--color-foreground-muted))' : 'rgba(255, 255, 255, 0.6)'
                    }}
                  >
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Auth Tabs */}
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList 
                  className="grid w-full grid-cols-2 h-12"
                  style={{ 
                    backgroundColor: theme === 'dark' ? 'hsl(var(--color-secondary))' : 'rgba(255, 255, 255, 0.1)',
                    border: `1px solid ${theme === 'dark' ? 'hsl(var(--color-border))' : 'rgba(255, 255, 255, 0.2)'}`
                  }}
                >
                  <TabsTrigger 
                    value="signin" 
                    className="data-[state=active]:bg-white data-[state=active]:text-black text-white"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="data-[state=active]:bg-white data-[state=active]:text-black text-white"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                
                {/* Sign In Form */}
                <TabsContent value="signin" className="space-y-4 mt-6">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <AuthFormField
                      id="signin-email"
                      label="Email Address"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={setEmail}
                      required
                    />
                    
                    <AuthFormField
                      id="signin-password"
                      label="Password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={setPassword}
                      showPasswordToggle
                      required
                    />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="remember-me" 
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        />
                        <label 
                          htmlFor="remember-me" 
                          className="text-sm cursor-pointer"
                          style={{ color: theme === 'dark' ? 'hsl(var(--color-foreground-muted))' : 'rgba(255, 255, 255, 0.7)' }}
                        >
                          Remember me
                        </label>
                      </div>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-sm"
                        style={{ color: theme === 'dark' ? 'hsl(var(--color-primary))' : '#ffffff' }}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full h-12 bg-white text-black hover:bg-white/90 font-semibold text-base transition-all duration-200"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                {/* Sign Up Form */}
                <TabsContent value="signup" className="space-y-4 mt-6">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <AuthFormField
                      id="signup-email"
                      label="Email Address"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={setEmail}
                      required
                    />
                    
                    <AuthFormField
                      id="signup-password"
                      label="Password"
                      type="password"
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(value) => {
                        setPassword(value);
                        setShowPasswordStrength(value.length > 0);
                      }}
                      showPasswordToggle
                      required
                    />
                    
                    <PasswordStrengthIndicator 
                      password={password} 
                      show={showPasswordStrength} 
                    />
                    
                    <AuthFormField
                      id="confirm-password"
                      label="Confirm Password"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      error={confirmPassword && password !== confirmPassword ? "Passwords do not match" : undefined}
                      success={confirmPassword && password === confirmPassword ? "Passwords match" : undefined}
                      showPasswordToggle
                      required
                    />
                    
                    <Button
                      type="submit"
                      className="w-full h-12 bg-white text-black hover:bg-white/90 font-semibold text-base transition-all duration-200"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              
              {/* Error/Success Messages */}
              {error && (
                <Alert 
                  className="border-red-500/50 bg-red-500/10"
                  style={{ borderColor: 'rgba(239, 68, 68, 0.5)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                >
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}
              
              {message && (
                <Alert 
                  className="border-green-500/50 bg-green-500/10"
                  style={{ borderColor: 'rgba(34, 197, 94, 0.5)', backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
                >
                  <AlertDescription className="text-green-400">{message}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
