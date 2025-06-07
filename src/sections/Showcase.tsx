
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Atom, Cpu, Shield, Sparkles, Clock, GitBranch, Code, Zap, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const showcaseItems = [
  {
    title: "QHub Platform",
    description: "Revolutionary quantum computing platform for Python developers",
    icon: <Code className="w-8 h-8" />,
    status: "Coming June 20",
    category: "Quantum Computing",
    featured: true
  },
  {
    title: "Particle Collider X-500",
    description: "Next-generation collider for sub-atomic exploration and research",
    icon: <Atom className="w-8 h-8" />,
    status: "In Development",
    category: "Particle Physics"
  },
  {
    title: "Quantum AI Core",
    description: "AI chipset optimized for quantum state prediction and analysis",
    icon: <Cpu className="w-8 h-8" />,
    status: "Research Phase",
    category: "AI Technology"
  },
  {
    title: "Defense HyperShield",
    description: "Adaptive defense technology for autonomous threat mitigation",
    icon: <Shield className="w-8 h-8" />,
    status: "Prototype",
    category: "Defense Systems"
  },
  {
    title: "DarkMatter Explorer",
    description: "Advanced instruments to detect and harness dark matter energy",
    icon: <Sparkles className="w-8 h-8" />,
    status: "Research Phase",
    category: "Dark Matter"
  },
  {
    title: "Wormhole Gate",
    description: "Proof-of-concept for stable spacetime bridge technology",
    icon: <GitBranch className="w-8 h-8" />,
    status: "Conceptual",
    category: "Spacetime"
  },
  {
    title: "ChronoDrive Engine",
    description: "Experimental device for controlled time dilation effects",
    icon: <Clock className="w-8 h-8" />,
    status: "Theory",
    category: "Temporal Physics"
  },
  {
    title: "Quantum Database",
    description: "Quantum-encrypted data storage with impossible breach protection",
    icon: <Database className="w-8 h-8" />,
    status: "Development",
    category: "Data Security"
  }
];

export default function Showcase() {
  return (
    <section id="showcase" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Innovation Pipeline
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our cutting-edge projects blend advanced physics, quantum computing, and breakthrough technologies
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {showcaseItems.map((item, index) => (
            <Card 
              key={index} 
              className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                item.featured ? 'ring-2 ring-primary/20 bg-primary/5' : 'bg-card/50'
              } backdrop-blur-sm border border-border/50`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-primary">{item.icon}</div>
                  {item.featured && (
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      <Zap className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {item.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
