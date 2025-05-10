
import { Button } from "@/components/ui/button";

export default function ProjectSpotlight() {
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
          
          <div className="my-10 max-w-3xl mx-auto">
            <div className="h-4 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-axion-blue progress-bar-animation rounded-full" 
                   style={{ width: "65%" }} />
            </div>
            <div className="mt-2 flex justify-between text-sm text-axion-gray">
              <span>Development</span>
              <span>65% Complete</span>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button className="glass-panel border-axion-blue text-axion-white hover:bg-axion-blue/20 neon-glow">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
