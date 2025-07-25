
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Cpu, Shield, Mic, Layers, Code, Zap, Eye, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const showcaseItems = [
  {
    title: "Gideon Platform",
    description: "Hyper-intelligent AI assistant with real-time voice interaction",
    icon: <Brain className="w-8 h-8" />,
    status: "Coming Soon",
    category: "AGI Platform",
    featured: true
  },
  {
    title: "Echelon E1",
    description: "Ultra-lightweight AI model for mobile and embedded systems",
    icon: <Layers className="w-8 h-8" />,
    status: "In Development",
    category: "Mobile AI"
  },
  {
    title: "Echelon E2",
    description: "Core intelligence layer powering all Gideon public services",
    icon: <Cpu className="w-8 h-8" />,
    status: "Active Development",
    category: "Core AI"
  },
  {
    title: "Echelon E3",
    description: "Experimental AGI-class system for high-level planning and foresight",
    icon: <Zap className="w-8 h-8" />,
    status: "Research Phase",
    category: "AGI Research"
  },
  {
    title: "Voice Intelligence Core",
    description: "Real-time speech recognition and emotion-aware voice generation",
    icon: <Mic className="w-8 h-8" />,
    status: "Beta Testing",
    category: "Voice AI"
  },
  {
    title: "Visual Perception Engine",
    description: "Advanced computer vision for multi-modal AI interaction",
    icon: <Eye className="w-8 h-8" />,
    status: "Development",
    category: "Vision AI"
  },
  {
    title: "Memory Architecture",
    description: "Persistent long-term contextual memory system",
    icon: <MessageSquare className="w-8 h-8" />,
    status: "Alpha",
    category: "Memory AI"
  },
  {
    title: "Security Framework",
    description: "Enterprise-grade AI security and privacy protection",
    icon: <Shield className="w-8 h-8" />,
    status: "Development",
    category: "AI Security"
  }
];

export default function Showcase() {
  return (
    <section id="showcase" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Intelligence Architecture
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our proprietary AI technology stack powering the next generation of human-machine interaction
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
