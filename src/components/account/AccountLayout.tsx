
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
  const logoSrc = "/lovable-uploads/1649c4bf-c03b-4d41-b660-4a2d8eded619.png";
  
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse delay-1000" />
      
      <header className="relative z-10 w-full p-6 flex justify-between items-center border-b border-white/20">
        <Button 
          variant="ghost" 
          as={Link}
          to="/" 
          className="flex items-center gap-3 text-white hover:text-white/80 transition-all duration-300 group hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </Button>
      </header>
      
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] p-6">
        <Card className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img src={logoSrc} alt="AxionLabs Logo" className="h-16 drop-shadow-lg" />
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl -z-10" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">{title}</CardTitle>
            {description && (
              <CardDescription className="text-lg text-white/70">
                {description}
              </CardDescription>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            {children}
          </CardContent>
          
          <CardFooter className="justify-center pt-6 border-t border-white/20">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Shield className="h-4 w-4" />
              <p>Protected by AxionsLab enterprise encryption</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
