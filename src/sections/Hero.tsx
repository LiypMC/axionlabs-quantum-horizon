
import NotifyButton from "@/components/NotifyButton";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, Zap, Code, Cpu, ChevronDown, Home, User, Mail, Info } from "lucide-react";
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
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Spline Background */}
      <div className="absolute inset-0 z-0">
        <iframe 
          src='https://my.spline.design/particles-M8cFBTt81yqFzQOHv7R06Ql3/' 
          frameBorder='0' 
          width='100%' 
          height='100%'
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
      </div>

      {/* Floating QHub Notification */}
      <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${isAnnouncementOpen ? 'translate-y-0' : '-translate-y-2'}`}>
        <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          <button
            onClick={() => setIsAnnouncementOpen(!isAnnouncementOpen)}
            className="w-full p-4 flex items-center justify-center gap-3 hover:bg-white/5 transition-colors"
          >
            <Badge variant="outline" className="bg-white/10 text-white border-white/30">
              <Zap className="w-4 h-4 mr-2" />
              Coming Soon
            </Badge>
            <span className="text-white font-semibold">QHub Platform</span>
            <ChevronDown className={`w-5 h-5 text-white/70 transition-transform duration-300 ${isAnnouncementOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`transition-all duration-500 ease-out ${isAnnouncementOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="p-6 border-t border-white/10">
              <div className="text-center max-w-md">
                <h2 className="text-2xl font-bold mb-3 text-white">
                  Revolutionary Quantum Computing
                </h2>
                <p className="text-white/70 mb-4">
                  Run Python code on real quantum computers. The future of quantum development is here.
                </p>
                <div className="flex items-center justify-center gap-6 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    <span>Python Package</span>
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

      {/* Dock Navigation */}
      <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-3xl px-6 py-3 shadow-2xl">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:scale-110 transition-transform">
              <img
                src={logoSrc}
                alt="Axions Laboratory Logo"
                className="h-10 w-auto"
              />
            </Link>
            
            {/* Navigation Items */}
            <div className="flex items-center gap-4">
              <Link to="/" className="p-3 hover:bg-white/10 rounded-2xl transition-all hover:scale-110">
                <Home className="w-5 h-5 text-white" />
              </Link>
              <Link to="#mission" className="p-3 hover:bg-white/10 rounded-2xl transition-all hover:scale-110">
                <Info className="w-5 h-5 text-white" />
              </Link>
              <a href="#" className="p-3 hover:bg-white/10 rounded-2xl transition-all hover:scale-110">
                <Mail className="w-5 h-5 text-white" />
              </a>
            </div>

            {/* User Section */}
            <div className="flex items-center pl-4 border-l border-white/20">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-white/20 transition-all border border-white/10 hover:scale-110">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-white text-black font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-black/95 backdrop-blur-sm border border-white/20 text-white mb-4">
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
                  asChild
                  size="sm"
                  className="bg-white hover:bg-white/90 text-black font-medium hover:scale-110 transition-all"
                >
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="text-center max-w-5xl mx-auto z-10 space-y-8 relative">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
          <span className="block text-white drop-shadow-2xl">
            Axions Laboratory
          </span>
          <span className="block text-2xl md:text-3xl lg:text-4xl mt-4 text-white/90 font-semibold drop-shadow-xl">
            Pioneering Quantum Frontiers
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
          Advancing particle physics, quantum computing, and breakthrough technologies that shape tomorrow's world.
        </p>
        
        <div className="mt-12">
          <NotifyButton variant="filled" className="text-lg py-6 px-10 font-semibold bg-white text-black hover:bg-white/90 shadow-2xl hover:scale-105 transition-all" />
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
        <a 
          href="#mission" 
          className="text-white/80 hover:text-white transition-colors animate-bounce drop-shadow-lg"
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
