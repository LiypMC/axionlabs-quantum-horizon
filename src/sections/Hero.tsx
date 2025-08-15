
import NotifyButton from "@/components/NotifyButton";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, Zap, Code, Cpu, ChevronDown, Home, User, Mail, Info, Brain, MessageCircle } from "lucide-react";
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
      {/* Enhanced Spline Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Gradient Overlay Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/80 to-black z-10" />
        
        {/* Spline 3D Scene */}
        <div className="absolute inset-0 transform origin-center spline-background">
          <iframe 
            src='https://my.spline.design/particles-M8cFBTt81yqFzQOHv7R06Ql3/' 
            frameBorder='0' 
            width='100%' 
            height='100%'
            className="w-full h-full opacity-90"
            loading="lazy"
            title="3D Particle Background"
          />
        </div>
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 z-20" />
        
        {/* Floating Particles Effect */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse animate-particle-drift" />
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white/40 rounded-full animate-pulse animate-particle-drift-delayed" />
          <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse animate-particle-drift-slow" />
          <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-white/50 rounded-full animate-pulse animate-particle-drift" />
          <div className="absolute bottom-1/4 right-1/2 w-2 h-2 bg-white/25 rounded-full animate-pulse animate-particle-drift-delayed" />
        </div>
        
        {/* Neural Grid Overlay */}
        <div className="absolute inset-0 z-25 opacity-20">
          <div className="absolute inset-0"
               style={{
                 backgroundImage: `
                   linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                 `,
                 backgroundSize: '50px 50px'
               }}
          />
        </div>
        
        {/* Radial Spotlight Effect */}
        <div className="absolute inset-0 z-40 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.3)_70%)]" />
      </div>

      {/* Floating Gideon Announcement */}
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
            <span className="text-white font-semibold">Gideon AI Platform</span>
            <ChevronDown className={`w-5 h-5 text-white/70 transition-transform duration-300 ${isAnnouncementOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`transition-all duration-500 ease-out ${isAnnouncementOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="p-6 border-t border-white/10">
              <div className="text-center max-w-md">
                <h2 className="text-2xl font-bold mb-3 text-white">
                  The Intelligence Revolution
                </h2>
                <p className="text-white/70 mb-4">
                  Meet Gideon — the hyper-intelligent AI that speaks, thinks, reasons, and acts like it's alive.
                </p>
                <div className="flex items-center justify-center gap-6 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    <span>Voice-First AI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    <span>Proprietary LLM</span>
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
              <Link to="/gideon" className="p-3 hover:bg-white/10 rounded-2xl transition-all hover:scale-110">
                <Brain className="w-5 h-5 text-white" />
              </Link>
              <Link to="/chat" className="p-3 hover:bg-white/10 rounded-2xl transition-all hover:scale-110">
                <MessageCircle className="w-5 h-5 text-white" />
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
                  size="sm"
                  className="bg-white hover:bg-white/90 text-black font-medium hover:scale-110 transition-all"
                  onClick={() => {
                    const currentUrl = window.location.href;
                    const redirectUrl = `https://user.axionshosting.com/auth/login?redirect=${encodeURIComponent(currentUrl)}&app=main`;
                    window.location.href = redirectUrl;
                  }}
                >
                  Sign In
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
            AxionsLab
          </span>
          <span className="block text-2xl md:text-3xl lg:text-4xl mt-4 text-white/90 font-semibold drop-shadow-xl">
            Talk to the Future
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
          We are building Gideon — a hyper-intelligent AI that speaks, thinks, reasons, and acts. The next evolution of human-machine interaction.
        </p>
        
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <NotifyButton variant="filled" className="text-lg py-6 px-10 font-semibold bg-white text-black hover:bg-white/90 shadow-2xl hover:scale-105 transition-all" />
          <Button 
            asChild
            variant="outline"
            className="text-lg py-6 px-10 font-semibold border-white/30 text-white hover:bg-white/10 shadow-2xl hover:scale-105 transition-all"
          >
            <Link to="/gideon">
              <Brain className="w-5 h-5 mr-2" />
              Meet Gideon
            </Link>
          </Button>
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
