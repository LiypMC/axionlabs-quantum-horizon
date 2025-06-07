
import { useEffect } from "react";
import Hero from "@/sections/Hero";
import Mission from "@/sections/Mission";
import Showcase from "@/sections/Showcase";
import ProjectSpotlight from "@/sections/ProjectSpotlight";
import EmailSignup from "@/sections/EmailSignup";
import Footer from "@/sections/Footer";

const Index = () => {
  // Minimal effects for better performance
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle Alt+T for basic particle effect
      if (e.altKey && e.key === 't') {
        console.log('Easter egg activated!');
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
