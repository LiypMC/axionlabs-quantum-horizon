
import { useEffect, lazy, Suspense } from "react";
import Hero from "@/sections/Hero";
import Mission from "@/sections/Mission";
import Showcase from "@/sections/Showcase";
import ProjectSpotlight from "@/sections/ProjectSpotlight";
import EmailSignup from "@/sections/EmailSignup";
import Footer from "@/sections/Footer";
import { useTheme } from "@/components/ThemeProvider";
import { triggerPulseAnimation, createParticleExplosion } from "@/lib/animations";

const Index = () => {
  const { theme, setTheme } = useTheme();
  
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
