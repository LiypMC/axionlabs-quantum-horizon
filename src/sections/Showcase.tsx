
import ParticleCard from "@/components/ParticleCard";
import { Atom, Cpu, Shield, Sparkles, Clock, GitBranch } from "lucide-react";

const showcaseItems = [
  {
    title: "Particle Collider X-500",
    description: "Next-level collider for sub-atomic exploration.",
    icon: <Atom size={36} />
  },
  {
    title: "Quantum AI Core",
    description: "AI chipset optimized for quantum state prediction.",
    icon: <Cpu size={36} />
  },
  {
    title: "Defense HyperShield",
    description: "Adaptive defense tech for autonomous threat mitigation.",
    icon: <Shield size={36} />
  },
  {
    title: "DarkMatter Explorer",
    description: "Instruments to detect & harness dark matter energy.",
    icon: <Sparkles size={36} />
  },
  {
    title: "Wormhole Gate Prototype",
    description: "Proof-of-concept for stable spacetime bridges.",
    icon: <GitBranch size={36} />
  },
  {
    title: "ChronoDrive Engine",
    description: "Experimental device for controlled time dilation.",
    icon: <Clock size={36} />
  }
];

export default function Showcase() {
  return (
    <section id="showcase" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="heading text-3xl md:text-4xl mb-4">What We'll Build</h2>
          <p className="text-axion-gray max-w-2xl mx-auto">
            Our innovative projects blend cutting-edge physics, quantum computing, and breakthrough technologies.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcaseItems.map((item, index) => (
            <div key={index} style={{ animationDelay: `${index * 150}ms` }}>
              <ParticleCard
                title={item.title}
                description={item.description}
                icon={item.icon}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
