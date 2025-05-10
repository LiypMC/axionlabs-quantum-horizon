
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    
    toast.success("Thanks for signing up!", {
      description: "You've been added to our waiting list"
    });
    setEmail("");
  };

  return (
    <section id="signup" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="glass-panel p-6 md:p-10 text-center animate-fade-in">
          <h2 className="heading text-3xl md:text-4xl mb-4">Be the First to Witness the Future</h2>
          <p className="text-axion-gray mb-8">
            Join our insider list for launch updates, research briefs, and VIP access.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/5 border-white/10 text-axion-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button 
              type="submit" 
              className="glass-panel border-axion-blue text-axion-white hover:bg-axion-blue/20 neon-glow whitespace-nowrap"
            >
              Notify Me
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
