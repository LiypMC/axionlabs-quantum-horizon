
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link, Navigate } from "react-router-dom";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { signIn, signUp, isAuthenticated, loading } = useAuth();

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

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Spline Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Gradient Overlay Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/80 to-black z-10" />
        
        {/* Spline 3D Scene */}
        <div className="absolute inset-0 transform origin-center spline-background">
          <iframe 
            src='https://my.spline.design/particles-M8cFBTt81yqFzQOHv7R06Ql3/' 
            frameBorder='0' 
            width='100%' 
            height='100%'
            className="w-full h-full opacity-60"
            loading="lazy"
            title="3D Particle Background"
          />
        </div>
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 z-20" />
        
        {/* Floating Particles Effect */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/25 rounded-full animate-pulse animate-particle-drift" />
          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse animate-particle-drift-delayed" />
          <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse animate-particle-drift-slow" />
          <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-white/15 rounded-full animate-pulse animate-particle-drift" />
        </div>
        
        {/* Radial Spotlight Effect */}
        <div className="absolute inset-0 z-40 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,0.5)_75%)]" />
      </div>
      
      {/* Back to Home Link */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-10 flex items-center gap-2 text-white/70 hover:text-white transition-colors glass-button px-4 py-2 rounded-full"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="w-full max-w-md z-10">
        <Card className="glass-card border-white/10 bg-black/80 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Welcome to Axions Laboratory</CardTitle>
            <CardDescription className="text-white/70">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20">
                <TabsTrigger value="signin" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-white/90 font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-white/90 font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            {error && (
              <Alert className="mt-4 border-red-500/50 bg-red-500/10">
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}
            
            {message && (
              <Alert className="mt-4 border-green-500/50 bg-green-500/10">
                <AlertDescription className="text-green-400">{message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
