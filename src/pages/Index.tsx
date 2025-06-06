
import { useEffect } from "react";
import Hero from "@/sections/Hero";
import Mission from "@/sections/Mission";
import Showcase from "@/sections/Showcase";
import ProjectSpotlight from "@/sections/ProjectSpotlight";
import EmailSignup from "@/sections/EmailSignup";
import Footer from "@/sections/Footer";
import { createParticleExplosion } from "@/lib/animations";

const Index = () => {
  // Handle key press for particle effects only
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Create particle explosion with Alt+T for fun
      if (e.altKey && e.key === 't') {
        createParticleExplosion(window.innerWidth / 2, window.innerHeight / 2, 20);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return (
    <div className="min-h-screen">
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
