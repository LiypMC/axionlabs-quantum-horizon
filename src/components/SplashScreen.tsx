
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface SplashScreenProps {
  onContinue: () => void;
}

export default function SplashScreen({ onContinue }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  const logoSrc = "/lovable-uploads/1649c4bf-c03b-4d41-b660-4a2d8eded619.png";

  const handleContinue = () => {
    setIsVisible(false);
    setTimeout(onContinue, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-6">
      {/* Subtle background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-lg animate-pulse delay-500" />
      
      <Card className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl relative z-10">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img src={logoSrc} alt="Axions Laboratory Logo" className="h-24 w-auto drop-shadow-lg" />
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl -z-10" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Important Notice</h2>
            </div>
            
            <div className="bg-white/10 border border-white/20 rounded-xl p-6 space-y-3">
              <p className="text-lg text-white leading-relaxed">
                We're excited to share our quantum computing innovations with you. Please note that our 
                <span className="font-semibold text-white"> product launch timelines may be subject to adjustments</span> 
                as we ensure the highest standards of quantum technology delivery.
              </p>
              
              <p className="text-base text-white/70">
                We appreciate your understanding as we work to revolutionize quantum computing accessibility.
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-white/60 pt-4">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Quality assured quantum innovation</span>
            </div>
          </div>
          
          <Button 
            onClick={handleContinue}
            size="lg"
            className="w-full mt-8 bg-white hover:bg-white/90 text-black font-semibold shadow-lg h-12"
          >
            Continue to Axions Laboratory
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
