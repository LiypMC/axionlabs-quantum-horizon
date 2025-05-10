
import { ReactNode } from "react";

interface ParticleCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export default function ParticleCard({ title, description, icon }: ParticleCardProps) {
  return (
    <div className="glass-panel p-6 hover:neon-border transition-all duration-300 animate-fade-in">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-axion-blue h-12 w-12 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="heading text-xl">{title}</h3>
      </div>
      <p className="text-axion-gray">{description}</p>
    </div>
  );
}
