
import { Link } from 'react-router-dom';
import { ReactNode } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AccountLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export const AccountLayout = ({ children, title, description }: AccountLayoutProps) => {
  // Always use dark theme logo
  const logoSrc = "/lovable-uploads/1649c4bf-c03b-4d41-b660-4a2d8eded619.png";
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-neural-grid opacity-30" />
      <div className="absolute inset-0 bg-energy-field" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse delay-1000" />
      
      <header className="relative z-10 w-full p-6 flex justify-between items-center">
        <Button 
          variant="ghost" 
          as={Link}
          to="/" 
          className="flex items-center gap-3 text-foreground hover:text-primary transition-all duration-300 group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </Button>
      </header>
      
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] p-6">
        <Card className="w-full max-w-lg glass-panel border-primary/20 shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img src={logoSrc} alt="AxionLabs Logo" className="h-16 drop-shadow-lg" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl -z-10" />
              </div>
            </div>
            <CardTitle className="heading text-2xl">{title}</CardTitle>
            {description && (
              <CardDescription className="text-lg text-muted-foreground">
                {description}
              </CardDescription>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            {children}
          </CardContent>
          
          <CardFooter className="justify-center pt-6 border-t border-border/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <p>Protected by AxionLabs quantum encryption</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
