
import NotifyButton from "@/components/NotifyButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, Zap, Code, Cpu, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function Hero() {
  const { theme } = useTheme();
  const { isAuthenticated, user, signOut } = useAuth();
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  
  const logoSrc = "/lovable-uploads/1649c4bf-c03b-4d41-b660-4a2d8eded619.png";
  
  const getUserInitials = () => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };
  
  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative bg-black">
      <AnimatedBackground />
      
      <header className="w-full absolute top-0 left-0 right-0 flex justify-between items-center p-6 z-10 border-b border-white/10">
        <div className="flex items-center gap-4">
          <img
            src={logoSrc}
            alt="Axions Laboratory Logo"
            className="h-16 md:h-20 w-auto drop-shadow-lg"
          />
          <ThemeToggle className="ml-2" />
        </div>
        
        <div className="flex items-center">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-white/20 transition-all border border-white/10">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-white text-black font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-black/95 backdrop-blur-sm border border-white/20 text-white">
                <div className="p-3 border-b border-white/20">
                  <p className="font-medium text-sm text-white">{user?.email}</p>
                  <p className="text-xs text-white/60">Axions Laboratory Account</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center cursor-pointer text-white hover:bg-white/10">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/20" />
                <DropdownMenuItem onClick={signOut} className="flex items-center cursor-pointer text-red-400 hover:bg-white/10">
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
              className="bg-white hover:bg-white/90 text-black font-medium border border-white/20"
            >
              Sign In
            </Button>
          )}
        </div>
      </header>

      {/* Compact QHub Announcement Banner */}
      <div className="w-full max-w-4xl mx-auto z-10 mb-8">
        <div className="bg-white/5 border border-white/20 rounded-lg backdrop-blur-sm overflow-hidden">
          <button
            onClick={() => setIsAnnouncementOpen(!isAnnouncementOpen)}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-black/50 text-white border-white/30">
                <Zap className="w-4 h-4 mr-2" />
                Coming Soon
              </Badge>
              <span className="text-white font-semibold">QHub Platform - Revolutionary Quantum Computing</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-white/70 transition-transform duration-300 ${isAnnouncementOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`transition-all duration-300 ease-in-out ${isAnnouncementOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="p-6 border-t border-white/10">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
                  Introducing QHub
                </h2>
                <p className="text-lg text-white/70 mb-4 max-w-2xl mx-auto">
                  Run Python code on real quantum computers. The future of quantum development is here.
                </p>
                <div className="flex items-center justify-center gap-6 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    <span>Python Package Coming</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    <span>Web & Desktop App</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center max-w-5xl mx-auto z-10 space-y-8">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
          <span className="block text-white">
            Axions Laboratory
          </span>
          <span className="block text-2xl md:text-3xl lg:text-4xl mt-4 text-white/80 font-semibold">
            Pioneering Quantum Frontiers
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto leading-relaxed">
          Advancing particle physics, quantum computing, and breakthrough technologies that shape tomorrow's world.
        </p>
        
        <div className="mt-12">
          <NotifyButton variant="filled" className="text-lg py-6 px-10 font-semibold bg-white text-black hover:bg-white/90" />
        </div>
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <a 
          href="#mission" 
          className="text-white hover:text-white/80 transition-colors animate-bounce"
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
