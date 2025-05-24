
import { Link } from 'react-router-dom';
import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/components/ThemeProvider';

interface AccountLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export const AccountLayout = ({ children, title, description }: AccountLayoutProps) => {
  const { theme } = useTheme();
  
  // Logo source based on theme
  const logoSrc = theme === "dark" 
    ? "/lovable-uploads/1649c4bf-c03b-4d41-b660-4a2d8eded619.png"
    : "/lovable-uploads/b799f614-ce3b-419b-be33-2205f81930dc.png";
  
  return (
    <div className="min-h-screen bg-background theme-transition animated-background-pulse">
      <header className="w-full p-4 md:p-6 flex justify-between items-center z-10">
        <Button 
          variant="ghost" 
          as={Link}
          to="/" 
          className="flex items-center gap-2 text-foreground hover:text-quantum-cyan transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </Button>
        <ThemeToggle />
      </header>
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6 animate-fade-in">
        <Card className="w-full max-w-md quantum-glass neural-border">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <img src={logoSrc} alt="AxionLabs Logo" className="h-12 theme-transition" />
            </div>
            <CardTitle className="heading text-2xl">{title}</CardTitle>
            {description && <CardDescription className="text-foreground/80">{description}</CardDescription>}
          </CardHeader>
          
          <CardContent>
            {children}
          </CardContent>
          
          <CardFooter className="justify-center text-sm text-foreground/60">
            <p>Protected by AxionLabs encryption</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
