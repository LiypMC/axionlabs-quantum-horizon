
import NotifyButton from "@/components/NotifyButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Hero() {
  const { theme } = useTheme();
  const { isAuthenticated, user, signOut } = useAuth();
  
  // Updated logo sources - dark stays the same, light uses the new uploaded image
  const logoSrc = theme === "dark" 
    ? "/lovable-uploads/1649c4bf-c03b-4d41-b660-4a2d8eded619.png"
    : "/lovable-uploads/b799f614-ce3b-419b-be33-2205f81930dc.png";
  
  const getUserInitials = () => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };
  
  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative theme-transition">
      <AnimatedBackground />
      
      <header className="w-full absolute top-0 left-0 right-0 flex justify-between items-center p-4 md:p-6 z-10 theme-transition">
        <div className="flex items-center gap-4">
          <img
            src={logoSrc}
            alt="AxionLabs Logo"
            className="h-12 md:h-16 theme-transition"
          />
          <ThemeToggle className="ml-2" />
        </div>
        
        <div className="flex items-center">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer hover:opacity-80 transition-opacity">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-axion-blue text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-panel">
                <div className="p-2 text-sm">
                  <p className="font-medium">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="flex items-center cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              as={Link} 
              to="/auth"
              size="sm"
              className="glass-panel border-axion-blue text-axion-white hover:bg-axion-blue/20 neon-glow"
            >
              Sign In
            </Button>
          )}
        </div>
      </header>
      
      <div className="text-center max-w-4xl mx-auto z-10 space-y-8">
        <h1 className="heading text-4xl md:text-6xl lg:text-7xl tracking-wide theme-text-transition">
          <span className="block">AxionLabs</span>
          <span className="block text-2xl md:text-3xl lg:text-4xl mt-2 text-axion-blue">Pioneering Quantum Frontiers</span>
        </h1>
        
        <p className="text-axion-gray text-lg md:text-xl max-w-2xl mx-auto theme-text-transition">
          Coming Soon: The Next Generation of Particle Accelerators, AI-Driven Devices & Interstellar Research
        </p>
        
        <div className="mt-10">
          <NotifyButton variant="filled" className="text-lg py-6 px-8" />
        </div>
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <a 
          href="#mission" 
          className="text-axion-blue hover:text-foreground transition-colors animate-bounce"
          aria-label="Scroll down"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </a>
      </div>
    </section>
  );
}
