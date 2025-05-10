
import { Atom, Cpu, Shield, Sparkles, Clock } from "lucide-react";

export default function Mission() {
  return (
    <section id="mission" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="glass-panel p-6 md:p-10 grid md:grid-cols-2 gap-10 animate-fade-in">
          <div>
            <h2 className="heading text-2xl md:text-3xl mb-6">Our Mission</h2>
            <blockquote className="text-lg md:text-xl border-l-2 border-axion-blue pl-4 text-axion-gray italic">
              "At AxionLabs, we're engineering tomorrow's technology today—advancing particle physics, harnessing dark matter, and unlocking the secrets of time and space."
            </blockquote>
          </div>
          
          <div>
            <h2 className="heading text-2xl md:text-3xl mb-6">Research Areas</h2>
            <ul className="space-y-4">
              {[
                { icon: <Atom size={24} />, text: "Particle Accelerators & Colliders" },
                { icon: <Cpu size={24} />, text: "AI-Powered Quantum Computing Devices" },
                { icon: <Shield size={24} />, text: "Advanced Defense Systems" },
                { icon: <Sparkles size={24} />, text: "Dark Matter & Wormhole Research" },
                { icon: <Clock size={24} />, text: "Experimental Time-Travel Theories" }
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="text-axion-blue">{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
