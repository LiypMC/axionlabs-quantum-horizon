
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import FloatingCube from "@/components/FloatingCube";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Only mount the 3D cube when this section is visible
  useEffect(() => {
    setIsMounted(true);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      });
    }, { threshold: 0.2 });
    
    const element = document.getElementById('signup');
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Store email in Supabase
      const { error } = await supabase
        .from('notification_signups')
        .insert({ email });
        
      if (error) {
        if (error.code === '23505') { // Unique violation code
          toast.info("You're already on our list!", {
            description: "We'll notify you when we launch"
          });
        } else {
          console.error("Error saving email:", error);
          toast.error("Something went wrong. Please try again.");
        }
      } else {
        toast.success("Thanks for signing up!", {
          description: "You've been added to our waiting list"
        });
      }
      
      setEmail("");
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="signup" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="glass-panel p-6 md:p-10 text-center animate-fade-in">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="heading text-3xl md:text-4xl mb-4">Be the First to Witness the Future</h2>
              <p className="text-axion-gray mb-8">
                Join our insider list for launch updates, research briefs, and VIP access.
              </p>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/5 border-white/10 text-axion-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  className="glass-panel border-axion-blue text-axion-white hover:bg-axion-blue/20 neon-glow"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Notify Me"}
                </Button>
              </form>
            </div>
            
            <div className="hidden md:block">
              {/* Only render the cube when section is visible */}
              {isMounted && isVisible && <FloatingCube />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
