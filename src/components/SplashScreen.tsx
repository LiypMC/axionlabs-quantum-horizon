
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Zap } from "lucide-react";

interface SplashScreenProps {
  onContinue: () => void;
}

const SplashScreen = ({ onContinue }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const logoSrc = "/lovable-uploads/1649c4bf-c03b-4d41-b660-4a2d8eded619.png";
  
  const features = [
    "Quantum Computing Platform",
    "Real-time Particle Simulation",
    "Advanced Research Tools",
    "Breakthrough Technologies"
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % features.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_50%)]" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className={`relative z-10 text-center max-w-2xl mx-auto px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Logo */}
        <div className="mb-8">
          <img
            src={logoSrc}
            alt="Axions Laboratory"
            className="h-24 md:h-32 w-auto mx-auto drop-shadow-2xl animate-pulse"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
          Axions Laboratory
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/80 mb-8 drop-shadow-xl">
          Welcome to the Future of Quantum Research
        </p>

        {/* Animated Features */}
        <div className="mb-12 h-16 flex items-center justify-center">
          <div className="flex items-center gap-3 px-6 py-3 glass-card rounded-full">
            <Zap className="w-5 h-5 text-white" />
            <span className="text-white font-medium text-lg">
              {features[currentStep]}
            </span>
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={onContinue}
          size="lg"
          className="bg-white text-black hover:bg-white/90 font-semibold px-8 py-4 text-lg rounded-full shadow-2xl hover:scale-105 transition-all duration-300 group"
        >
          Enter Laboratory
          <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>

        {/* Skip Option */}
        <p className="text-white/60 text-sm mt-6">
          This screen appears once per day
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
