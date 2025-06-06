
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { triggerPulseAnimation, createParticleExplosion } from "@/lib/animations";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme } = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Since we're locked to dark mode, just trigger animations for visual feedback
    triggerPulseAnimation();
    
    // Create particle explosion at the click position
    createParticleExplosion(event.clientX, event.clientY);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={`rounded-full theme-transition ${className || ""}`}
      onClick={handleClick}
      aria-label="Dark mode (locked)"
      disabled
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-0 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Dark mode enabled</span>
    </Button>
  );
}
