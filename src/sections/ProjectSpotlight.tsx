
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Zap, Target, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProjectSpotlight() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setProgress(75), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="spotlight" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Project Spotlight
          </h2>
          <p className="text-xl text-muted-foreground">
            Current focus: Building the future of quantum computing
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    <Zap className="w-3 h-3 mr-1" />
                    Active Development
                  </Badge>
                  <Badge variant="outline">
                    <Calendar className="w-3 h-3 mr-1" />
                    June 20, 2025
                  </Badge>
                </div>
                <CardTitle className="text-3xl">QHub Platform</CardTitle>
                <CardDescription className="text-lg">
                  The world's first accessible quantum computing platform for Python developers
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span>50+ Beta Users</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-primary" />
                    <span>5 Quantum Backends</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Development Progress</span>
                    <span className="font-semibold">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <div className="pt-4">
                  <Button className="w-full group" size="lg">
                    Learn More About QHub
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="bg-card/30 backdrop-blur-sm border border-border/30">
              <CardHeader>
                <CardTitle className="text-xl">Key Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Native Python integration with quantum circuits",
                  "Real quantum hardware access (IBM, Google, IonQ)",
                  "Visual circuit designer and debugger",
                  "Collaborative quantum algorithm development",
                  "Educational tutorials and quantum examples"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card className="bg-card/30 backdrop-blur-sm border border-border/30">
              <CardHeader>
                <CardTitle className="text-xl">Target Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>• Quantum Machine Learning</div>
                  <div>• Cryptography Research</div>
                  <div>• Optimization Algorithms</div>
                  <div>• Quantum Simulation</div>
                  <div>• Drug Discovery</div>
                  <div>• Financial Modeling</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
