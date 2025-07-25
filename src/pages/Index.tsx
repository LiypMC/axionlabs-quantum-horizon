
import { useEffect, useState } from "react";
import Hero from "@/sections/Hero";
import Mission from "@/sections/Mission";
import Showcase from "@/sections/Showcase";
import VoiceIntelligence from "@/sections/VoiceIntelligence";
import ProjectSpotlight from "@/sections/ProjectSpotlight";
import EmailSignup from "@/sections/EmailSignup";
import Footer from "@/sections/Footer";
import SplashScreen from "@/components/SplashScreen";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  
  // Check if user has already seen the splash screen today
  useEffect(() => {
    const splashShownToday = localStorage.getItem('splashShownToday');
    const today = new Date().toDateString();
    
    if (splashShownToday === today) {
      setShowSplash(false);
    }
  }, []);
  
  const handleSplashContinue = () => {
    const today = new Date().toDateString();
    localStorage.setItem('splashShownToday', today);
    setShowSplash(false);
  };
  
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
  
  if (showSplash) {
    return <SplashScreen onContinue={handleSplashContinue} />;
  }
  
  return (
    <div className="min-h-screen">
      <Hero />
      <Mission />
      <Showcase />
      <VoiceIntelligence />
      <ProjectSpotlight />
      <EmailSignup />
      <Footer />
    </div>
  );
};

export default Index;
