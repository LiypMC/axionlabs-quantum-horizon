
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Hero from "@/sections/Hero";
import Mission from "@/sections/Mission";
import Showcase from "@/sections/Showcase";
import ProjectSpotlight from "@/sections/ProjectSpotlight";
import EmailSignup from "@/sections/EmailSignup";
import Footer from "@/sections/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import { triggerPulseAnimation, createParticleExplosion } from "@/lib/animations";

const Index = () => {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, signOut } = useAuth();
  
  // Handle key press for theme toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle theme with Alt+T
      if (e.altKey && e.key === 't') {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        triggerPulseAnimation(newTheme);
        
        // Create particle explosion in the center of the screen
        createParticleExplosion(window.innerWidth / 2, window.innerHeight / 2, 20); // Reduced particle count
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [theme, setTheme]);
  
  return (
    <div className="min-h-screen theme-transition animated-background-pulse">
      {/* Auth Navigation - Fixed spacing between buttons */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <Button 
              as={Link} 
              to="/settings"
              variant="outline"
              size="sm"
              className="glass-panel border-axion-blue/30 text-axion-white hover:bg-axion-blue/10"
            >
              <Settings className="h-4 w-4 mr-1" /> 
              Profile
            </Button>
            <Button 
              onClick={signOut}
              variant="outline"
              size="sm"
              className="glass-panel border-axion-blue/30 text-axion-white hover:bg-axion-blue/10"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </Button>
          </>
        ) : (
          <Button 
            as={Link} 
            to="/auth"
            size="sm"
            className="glass-panel border-axion-blue text-axion-white hover:bg-axion-blue/20 neon-glow"
          >
            Sign In
          </Button>
        )}
      </div>

      <Hero />
      <Mission />
      <Showcase />
      <ProjectSpotlight />
      <EmailSignup />
      <Footer />
    </div>
  );
};

export default Index;
