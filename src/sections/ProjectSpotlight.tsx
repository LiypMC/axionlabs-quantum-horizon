
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Zap, Code, Cpu, ArrowRight, Clock } from "lucide-react";

export default function ProjectSpotlight() {
  return (
    <section id="qhub-spotlight" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute inset-0 bg-neural-grid opacity-20" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent/10 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-primary/5 rounded-full blur-xl animate-pulse delay-500" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-6 border-primary/30 text-primary bg-primary/10 text-lg px-6 py-2">
            <Zap className="w-4 h-4 mr-2" />
            Featured Innovation
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Introducing QHub
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The world's first cloud platform for running Python code directly on quantum computers. 
            Revolutionary quantum computing made accessible to everyone.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Code className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Python Integration</h3>
                  <p className="text-muted-foreground">Write quantum algorithms in familiar Python syntax</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Real Quantum Hardware</h3>
                  <p className="text-muted-foreground">Execute on actual quantum processors, not simulators</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Cloud-Native</h3>
                  <p className="text-muted-foreground">Access quantum computing power from anywhere</p>
                </div>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-accent" />
                <span className="font-semibold text-foreground">Coming Soon</span>
              </div>
              <p className="text-2xl font-bold text-primary mb-2">June 20, 2025</p>
              <p className="text-muted-foreground mb-4">
                Be among the first to experience quantum computing in the cloud
              </p>
              <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold">
                <Clock className="w-4 h-4 mr-2" />
                Get Early Access
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <Card className="glass-panel border-primary/20 shadow-2xl backdrop-blur-xl overflow-hidden">
              <CardContent className="p-8">
                <div className="bg-slate-900 rounded-xl p-6 font-mono text-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="ml-4 text-gray-400">quantum_algorithm.py</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="text-blue-300">import <span className="text-yellow-300">qhub</span></div>
                    <div className="text-blue-300">from <span className="text-yellow-300">qiskit</span> import QuantumCircuit</div>
                    <div className="text-gray-400"># Create quantum circuit</div>
                    <div>qc = <span className="text-green-300">QuantumCircuit</span>(<span className="text-orange-300">2</span>)</div>
                    <div>qc.<span className="text-purple-300">h</span>(<span className="text-orange-300">0</span>)  <span className="text-gray-400"># Hadamard gate</span></div>
                    <div>qc.<span className="text-purple-300">cx</span>(<span className="text-orange-300">0</span>, <span className="text-orange-300">1</span>)  <span className="text-gray-400"># CNOT gate</span></div>
                    <div className="text-gray-400"># Execute on quantum computer</div>
                    <div>result = <span className="text-yellow-300">qhub</span>.<span className="text-purple-300">execute</span>(qc)</div>
                    <div className="text-green-300">print(result.get_counts())</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Glowing effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-2xl -z-10 animate-pulse" />
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-4 bg-card/30 backdrop-blur-sm border border-border/50 rounded-full px-8 py-4">
            <span className="text-muted-foreground">Join the quantum revolution</span>
            <ArrowRight className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">Early access available</span>
          </div>
        </div>
      </div>
    </section>
  );
}
