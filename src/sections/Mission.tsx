
import { Atom, Cpu, Shield, Sparkles, Clock, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Mission() {
  return (
    <section id="mission" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Our Mission
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Engineering tomorrow's technology today through advanced research and innovation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl">Vision Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="text-lg border-l-4 border-primary pl-6 italic text-muted-foreground">
                "At AxionLabs, we're engineering tomorrow's technology today—advancing particle physics, 
                harnessing dark matter, and unlocking the secrets of time and space through quantum innovation."
              </blockquote>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-6">Research Areas</h3>
            {[
              { icon: <Atom className="w-6 h-6" />, text: "Particle Accelerators & Quantum Colliders", color: "text-blue-500" },
              { icon: <Cpu className="w-6 h-6" />, text: "AI-Powered Quantum Computing Devices", color: "text-green-500" },
              { icon: <Shield className="w-6 h-6" />, text: "Advanced Defense & Security Systems", color: "text-red-500" },
              { icon: <Sparkles className="w-6 h-6" />, text: "Dark Matter & Wormhole Research", color: "text-purple-500" },
              { icon: <Clock className="w-6 h-6" />, text: "Experimental Time-Dilation Theories", color: "text-orange-500" },
              { icon: <Zap className="w-6 h-6" />, text: "Quantum Programming Platforms", color: "text-yellow-500" }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-card/30 border border-border/30 hover:bg-card/50 transition-colors">
                <span className={item.color}>{item.icon}</span>
                <span className="text-lg">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
