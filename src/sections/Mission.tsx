
import { Brain, Cpu, Shield, Mic, Layers, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Mission() {
  return (
    <section id="mission" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            The Intelligence Revolution
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We are not building another chatbot or AI wrapper. We are developing a new kind of intelligence.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl">Meet Gideon</CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="text-lg border-l-4 border-primary pl-6 italic text-muted-foreground">
                "Gideon is our flagship platform — a hyper-intelligent, real-time AI assistant that you can speak to, 
                learn from, and work with. This is not based on GPT, Claude, or LLaMA. This is pure AxionsLab IP."
              </blockquote>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-6">The Echelon Model Series</h3>
            {[
              { icon: <Layers className="w-6 h-6" />, text: "E1 — Ultra-lightweight for mobile & embedded systems", color: "text-blue-500" },
              { icon: <Brain className="w-6 h-6" />, text: "E2 — Core intelligence powering all Gideon services", color: "text-green-500" },
              { icon: <Zap className="w-6 h-6" />, text: "E3 — Experimental AGI-class system in development", color: "text-purple-500" },
              { icon: <Mic className="w-6 h-6" />, text: "Real-time speech recognition & voice generation", color: "text-orange-500" },
              { icon: <Shield className="w-6 h-6" />, text: "Proprietary architecture designed from ground up", color: "text-red-500" },
              { icon: <Cpu className="w-6 h-6" />, text: "Voice-first interaction with persistent memory", color: "text-yellow-500" }
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
