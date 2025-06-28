
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { triggerPulseAnimation, createParticleExplosion } from "@/lib/animations";
import { useState } from "react";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(true);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsDark(!isDark);
    
    // Apply theme to document
    const root = document.documentElement;
    if (!isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.backgroundColor = '#000000';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.style.backgroundColor = '#ffffff';
    }
    
    triggerPulseAnimation();
    createParticleExplosion(event.clientX, event.clientY);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={`rounded-full theme-transition border-white/20 hover:bg-white/10 ${className || ""}`}
      onClick={handleClick}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${isDark ? 'rotate-0 scale-0' : 'rotate-0 scale-100'} text-white`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0'} text-white`} />
      <span className="sr-only">{isDark ? 'Switch to light mode' : 'Switch to dark mode'}</span>
    </Button>
  );
}
