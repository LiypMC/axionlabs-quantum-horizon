
import { Button } from "@/components/ui/button";
import RotatingGlobe from "@/components/RotatingGlobe";
import { useEffect, useState } from "react";

export default function ProjectSpotlight() {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Only mount the 3D globe when this section is visible
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
    
    const element = document.getElementById('spotlight');
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <section id="spotlight" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="glass-panel p-6 md:p-10 animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="heading text-3xl md:text-4xl mb-4">
              Current Focus: <span className="text-axion-blue">Project Horizon</span>
            </h2>
            <p className="text-axion-gray text-lg max-w-3xl mx-auto">
              Building the world's first table-top particle accelerator with integrated AI diagnostics.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <div className="my-10">
                <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-axion-blue progress-bar-animation rounded-full" 
                      style={{ width: "65%" }} />
                </div>
                <div className="mt-2 flex justify-between text-sm text-axion-gray">
                  <span>Development</span>
                  <span>65% Complete</span>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center md:justify-start">
                <Button className="glass-panel border-axion-blue text-axion-white hover:bg-axion-blue/20 neon-glow">
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              {/* Only render the globe when section is visible */}
              {isMounted && isVisible && <RotatingGlobe />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
