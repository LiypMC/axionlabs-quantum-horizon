
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Code, Cpu, ArrowRight, Clock } from "lucide-react";

export default function ProjectSpotlight() {
  return (
    <section id="qhub-spotlight" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse delay-500" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-6 border-white/30 text-white bg-white/10 text-lg px-6 py-2">
            <Zap className="w-4 h-4 mr-2" />
            Featured Innovation
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Introducing QHub
          </h2>
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            The world's first cloud platform for running Python code directly on quantum computers. 
            Revolutionary quantum computing made accessible to everyone.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Python Integration</h3>
                  <p className="text-white/60">Write quantum algorithms in familiar Python syntax</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Real Quantum Hardware</h3>
                  <p className="text-white/60">Execute on actual quantum processors, not simulators</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Cloud-Native</h3>
                  <p className="text-white/60">Access quantum computing power from anywhere</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Badge variant="outline" className="bg-black/50 text-white border-white/30">
                  <Zap className="w-4 h-4 mr-2" />
                  Coming Soon
                </Badge>
              </div>
              <p className="text-white/70 mb-4 text-center">
                Be among the first to experience quantum computing in the cloud
              </p>
              <Button className="w-full bg-white hover:bg-white/90 text-black font-semibold">
                <Clock className="w-4 h-4 mr-2" />
                Get Early Access
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="bg-black/80 border border-white/20 rounded-xl p-6 font-mono text-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="ml-4 text-white/60">quantum_algorithm.py</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="text-blue-300">import <span className="text-yellow-300">qhub</span></div>
                    <div className="text-blue-300">from <span className="text-yellow-300">qiskit</span> import QuantumCircuit</div>
                    <div className="text-white/40"># Create quantum circuit</div>
                    <div className="text-white">qc = <span className="text-green-300">QuantumCircuit</span>(<span className="text-orange-300">2</span>)</div>
                    <div className="text-white">qc.<span className="text-purple-300">h</span>(<span className="text-orange-300">0</span>)  <span className="text-white/40"># Hadamard gate</span></div>
                    <div className="text-white">qc.<span className="text-purple-300">cx</span>(<span className="text-orange-300">0</span>, <span className="text-orange-300">1</span>)  <span className="text-white/40"># CNOT gate</span></div>
                    <div className="text-white/40"># Execute on quantum computer</div>
                    <div className="text-white">result = <span className="text-yellow-300">qhub</span>.<span className="text-purple-300">execute</span>(qc)</div>
                    <div className="text-green-300">print(result.get_counts())</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Glowing effect */}
            <div className="absolute inset-0 bg-white/10 rounded-2xl blur-2xl -z-10 animate-pulse" />
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full px-8 py-4">
            <span className="text-white/60">Join the quantum revolution</span>
            <ArrowRight className="w-4 h-4 text-white" />
            <span className="font-semibold text-white">Early access available</span>
          </div>
        </div>
      </div>
    </section>
  );
}
