
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

interface SplashScreenProps {
  onContinue: () => void;
}

export default function SplashScreen({ onContinue }: SplashScreenProps) {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  
  const logoSrc = theme === "dark" 
    ? "/lovable-uploads/1649c4bf-c03b-4d41-b660-4a2d8eded619.png"
    : "/lovable-uploads/b799f614-ce3b-419b-be33-2205f81930dc.png";

  const handleContinue = () => {
    setIsVisible(false);
    setTimeout(onContinue, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-neural-grid opacity-30" />
      <div className="absolute inset-0 bg-energy-field" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary/5 rounded-full blur-lg animate-pulse delay-500" />
      
      <Card className="w-full max-w-2xl glass-panel border-primary/20 shadow-2xl backdrop-blur-xl relative z-10">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img src={logoSrc} alt="AxionLabs Logo" className="h-20 drop-shadow-lg" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl -z-10" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              <h2 className="text-2xl font-bold text-foreground">Important Notice</h2>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-6 space-y-3">
              <p className="text-lg text-foreground leading-relaxed">
                We're excited to share our quantum computing innovations with you. Please note that our 
                <span className="font-semibold text-primary"> product launch timelines may be subject to adjustments</span> 
                as we ensure the highest standards of quantum technology delivery.
              </p>
              
              <p className="text-base text-muted-foreground">
                We appreciate your understanding as we work to revolutionize quantum computing accessibility.
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Quality assured quantum innovation</span>
            </div>
          </div>
          
          <Button 
            onClick={handleContinue}
            size="lg"
            className="w-full mt-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold shadow-lg h-12"
          >
            Continue to AxionLabs
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
