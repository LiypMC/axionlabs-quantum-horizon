
import NotifyButton from "@/components/NotifyButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, Calendar, Zap, Code, Cpu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  const { theme } = useTheme();
  const { isAuthenticated, user, signOut } = useAuth();
  
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
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      <AnimatedBackground />
      
      <header className="w-full absolute top-0 left-0 right-0 flex justify-between items-center p-6 z-10">
        <div className="flex items-center gap-4">
          <img
            src={logoSrc}
            alt="AxionLabs Logo"
            className="h-12 md:h-14"
          />
          <ThemeToggle className="ml-2" />
        </div>
        
        <div className="flex items-center">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-sm border border-border/50">
                <div className="p-3 border-b border-border/50">
                  <p className="font-medium text-sm">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">AxionLabs Account</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="flex items-center cursor-pointer text-destructive">
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
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              Sign In
            </Button>
          )}
        </div>
      </header>

      {/* QHub Announcement Banner */}
      <div className="w-full max-w-4xl mx-auto z-10 mb-8">
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
              <Zap className="w-3 h-3 mr-1" />
              Coming Soon
            </Badge>
            <Badge variant="outline" className="border-accent/30 text-accent">
              <Calendar className="w-3 h-3 mr-1" />
              June 20, 2025
            </Badge>
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Introducing QHub
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              Run Python code on real quantum computers. The future of quantum development is here.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Code className="w-4 h-4" />
                <span>Python Integration</span>
              </div>
              <div className="flex items-center gap-1">
                <Cpu className="w-4 h-4" />
                <span>Real Quantum Hardware</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center max-w-5xl mx-auto z-10 space-y-8">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
          <span className="block bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            AxionLabs
          </span>
          <span className="block text-2xl md:text-3xl lg:text-4xl mt-4 text-primary font-semibold">
            Pioneering Quantum Frontiers
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Advancing particle physics, quantum computing, and breakthrough technologies that shape tomorrow's world.
        </p>
        
        <div className="mt-12">
          <NotifyButton variant="filled" className="text-lg py-6 px-10 font-semibold" />
        </div>
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <a 
          href="#mission" 
          className="text-primary hover:text-primary/80 transition-colors animate-bounce"
          aria-label="Scroll down to learn more"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="28" 
            height="28" 
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
