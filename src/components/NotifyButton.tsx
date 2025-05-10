
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Atom } from "lucide-react";
import { toast } from "sonner";

interface NotifyButtonProps {
  variant?: "outline" | "filled";
  className?: string;
}

export default function NotifyButton({ variant = "outline", className = "" }: NotifyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    
    toast.success("Thanks! We'll notify you when we launch", {
      description: "You've been added to our waiting list"
    });
    setEmail("");
    setIsOpen(false);
  };
  
  const buttonClasses = variant === "outline" 
    ? "border-axion-blue text-axion-blue hover:bg-axion-blue/10 neon-glow"
    : "bg-axion-blue/20 hover:bg-axion-blue/30 text-axion-white border-axion-blue neon-glow";
  
  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className={`${buttonClasses} glass-panel ${className}`}
      >
        Notify Me
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="glass-panel text-axion-white p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading flex items-center gap-2 text-axion-white">
              <Atom className="h-6 w-6 text-axion-blue" />
              Join the AxionLabs Insider List
            </DialogTitle>
            <DialogDescription className="text-axion-gray">
              Be the first to know when we launch and receive exclusive updates on our research.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/5 border-white/10 text-axion-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full glass-panel border-axion-blue text-axion-white hover:bg-axion-blue/20 neon-glow"
            >
              Notify Me When We Launch
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
