
import NotifyButton from "@/components/NotifyButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";

export default function Hero() {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" 
    ? "/lovable-uploads/0785e971-63b4-4ed9-81b0-936bc447673d.png"
    : "/lovable-uploads/d903c226-cab4-4b0d-a97d-8f198c048300.png";
  
  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative theme-transition">
      <div className="absolute inset-0 bg-radial pointer-events-none" />
      
      <header className="w-full absolute top-0 left-0 right-0 flex justify-between items-center p-4 md:p-6 z-10">
        <div className="flex items-center">
          <img
            src={logoSrc}
            alt="AxionLabs Logo"
            className="h-12 md:h-16 theme-transition"
          />
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <NotifyButton variant="outline" />
        </div>
      </header>
      
      <div className="text-center max-w-4xl mx-auto z-10 space-y-8">
        <h1 className="heading text-4xl md:text-6xl lg:text-7xl tracking-wide">
          <span className="block">AxionLabs</span>
          <span className="block text-2xl md:text-3xl lg:text-4xl mt-2 text-axion-blue">Pioneering Quantum Frontiers</span>
        </h1>
        
        <p className="text-axion-gray text-lg md:text-xl max-w-2xl mx-auto">
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
