import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Mic, 
  Zap, 
  Eye, 
  MessageSquare, 
  Shield, 
  Layers, 
  Clock, 
  ArrowRight,
  Volume2,
  Cpu,
  Database,
  Headphones,
  PlayCircle,
  Sparkles,
  MessageCircle,
  ArrowLeft,
  Home
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Gideon() {
  const [activeModel, setActiveModel] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const echelonModels = [
    {
      name: "Echelon E1",
      subtitle: "Ultra-Lightweight Intelligence",
      description: "Designed for mobile, embedded systems, and real-time device interaction.",
      specs: {
        "Model Size": "1.2B parameters",
        "Latency": "~50ms",
        "Memory": "2GB RAM",
        "Use Cases": "Mobile apps, IoT devices, edge computing"
      },
      color: "from-blue-500 to-cyan-400",
      icon: <Layers className="w-8 h-8" />
    },
    {
      name: "Echelon E2",
      subtitle: "Core Intelligence Layer",
      description: "Balanced speed, depth, and memory powering all Gideon public services.",
      specs: {
        "Model Size": "15B parameters",
        "Latency": "~120ms",
        "Memory": "24GB RAM",
        "Use Cases": "Web services, voice assistants, real-time chat"
      },
      color: "from-purple-500 to-pink-400",
      icon: <Brain className="w-8 h-8" />
    },
    {
      name: "Echelon E3",
      subtitle: "Experimental AGI-Class",
      description: "Built for high-level planning, deep simulation, and foresight.",
      specs: {
        "Model Size": "70B+ parameters",
        "Latency": "~500ms",
        "Memory": "128GB RAM",
        "Use Cases": "Complex reasoning, strategic planning, research"
      },
      color: "from-violet-500 to-purple-600",
      icon: <Zap className="w-8 h-8" />
    }
  ];

  const voiceFeatures = [
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "Real-time Recognition",
      description: "Advanced speech processing with contextual understanding and emotion detection"
    },
    {
      icon: <Volume2 className="w-6 h-6" />,
      title: "Natural Voice Output",
      description: "Human-like speech generation with emotion, personality, and natural intonation"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Persistent Memory",
      description: "Long-term contextual memory that remembers conversations and preferences"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Visual Perception",
      description: "Advanced computer vision for multi-modal AI interaction and understanding"
    }
  ];

  const capabilities = [
    { title: "Voice-First Design", value: "100%", color: "bg-purple-500" },
    { title: "Real-time Response", value: "120ms", color: "bg-blue-500" },
    { title: "Context Retention", value: "∞", color: "bg-green-500" },
    { title: "Emotion Awareness", value: "Advanced", color: "bg-pink-500" }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(168,85,247,0.1),transparent_50%)]" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation Header */}
        <div className="absolute top-0 left-0 right-0 z-20 p-6">
          <div className="flex items-center justify-between">
            <Button 
              asChild
              variant="outline" 
              size="sm"
              className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
            >
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              size="sm"
              className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
            >
              <Link to="/chat">
                <MessageCircle className="w-4 h-4 mr-2" />
                Try Gideon
              </Link>
            </Button>
          </div>
        </div>
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
          <div className={`max-w-6xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Main Hero Content */}
            <div className="mb-16">
              <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-400/30 text-lg px-6 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                The Intelligence Revolution
              </Badge>
              
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
                GIDEON
              </h1>
              
              <p className="text-2xl md:text-3xl text-purple-200/90 mb-8 max-w-4xl mx-auto leading-relaxed">
                The hyper-intelligent AI that speaks, thinks, reasons, and acts.
              </p>
              
              <p className="text-xl text-white/70 mb-12 max-w-3xl mx-auto">
                Powered by our proprietary Echelon models — designed from the ground up to be faster, 
                smarter, more secure, and more adaptable than anything else.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  asChild
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold px-8 py-4 text-lg rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 border-0"
                >
                  <Link to="/chat">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Chat with Gideon
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-purple-400/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 font-semibold px-8 py-4 text-lg rounded-2xl backdrop-blur-sm"
                >
                  Learn More
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>

            {/* Voice Demo Card */}
            <Card className="bg-white/5 backdrop-blur-xl border border-purple-400/20 shadow-2xl overflow-hidden max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/80">Live Demo Available</span>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-400/30">
                    <p className="text-purple-200 text-lg">
                      "Hey Gideon, can you help me understand quantum entanglement?"
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-200"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-400"></div>
                    <span className="text-white/60 ml-2">Gideon is thinking...</span>
                  </div>
                  
                  <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                    <p className="text-white/90">
                      "Absolutely! Quantum entanglement is a fascinating phenomenon where particles become interconnected..."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Echelon Models Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-400/30">
                <Cpu className="w-4 h-4 mr-2" />
                Intelligence Architecture
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                The Echelon Series
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Three levels of intelligence, built for different capabilities, platforms, and use cases.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {echelonModels.map((model, index) => (
                <Card 
                  key={index}
                  className={`bg-white/5 backdrop-blur-xl border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105 cursor-pointer ${activeModel === index ? 'ring-2 ring-purple-400' : ''}`}
                  onClick={() => setActiveModel(index)}
                >
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${model.color} flex items-center justify-center mb-4 shadow-lg`}>
                      {model.icon}
                    </div>
                    <CardTitle className="text-white text-2xl">{model.name}</CardTitle>
                    <CardDescription className="text-purple-200">{model.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80 mb-6">{model.description}</p>
                    
                    <div className="space-y-3">
                      {Object.entries(model.specs).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-white/60 text-sm">{key}</span>
                          <span className="text-white font-medium text-sm">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Voice Intelligence Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-400/30">
                <Mic className="w-4 h-4 mr-2" />
                Voice Intelligence Core
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                Voice is not a feature.
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                It's the foundation.
              </h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {voiceFeatures.map((feature, index) => (
                <Card key={index} className="bg-white/5 backdrop-blur-xl border border-purple-400/20 hover:bg-white/10 transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-purple-400">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-white/70">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Capabilities Metrics */}
            <Card className="bg-white/5 backdrop-blur-xl border border-purple-400/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white text-center">Real-time Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  {capabilities.map((cap, index) => (
                    <div key={index} className="text-center">
                      <div className={`text-3xl font-bold ${cap.color.replace('bg-', 'text-')} mb-2`}>
                        {cap.value}
                      </div>
                      <div className="text-white/70">{cap.title}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Technical Architecture Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-400/30">
                <Database className="w-4 h-4 mr-2" />
                Technical Architecture
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                Built from the ground up
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Every layer — from tokenizer to memory — is handcrafted. No borrowed blueprints. 
                No copy-paste architectures. This is AxionsLab IP.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <Card className="bg-white/5 backdrop-blur-xl border border-purple-400/20">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Shield className="w-8 h-8 text-purple-400" />
                      <div>
                        <CardTitle className="text-white">Security & Privacy</CardTitle>
                        <CardDescription className="text-purple-200">Enterprise-grade protection</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-white/80">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        End-to-end encryption for all conversations
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        Zero data retention policy option
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        On-premises deployment available
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 backdrop-blur-xl border border-purple-400/20">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Clock className="w-8 h-8 text-purple-400" />
                      <div>
                        <CardTitle className="text-white">Performance</CardTitle>
                        <CardDescription className="text-purple-200">Optimized for real-time interaction</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-white/80">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        Sub-second response times
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        Infinite context window
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        99.9% uptime guarantee
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 backdrop-blur-xl border border-purple-400/20 shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <Brain className="w-16 h-16 text-white" />
                    </div>
                    
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">Gideon E2</h3>
                      <p className="text-purple-200 mb-6">Core Intelligence Model</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-black/20 rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-400">15B</div>
                        <div className="text-white/70 text-sm">Parameters</div>
                      </div>
                      <div className="bg-black/20 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-400">120ms</div>
                        <div className="text-white/70 text-sm">Latency</div>
                      </div>
                      <div className="bg-black/20 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-400">∞</div>
                        <div className="text-white/70 text-sm">Context</div>
                      </div>
                      <div className="bg-black/20 rounded-lg p-4">
                        <div className="text-2xl font-bold text-pink-400">99.9%</div>
                        <div className="text-white/70 text-sm">Uptime</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 backdrop-blur-xl border border-purple-400/30 shadow-2xl">
              <CardContent className="p-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                  Ready to talk to the future?
                </h2>
                <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
                  Join the waitlist to be among the first to experience Gideon's revolutionary AI intelligence.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold px-8 py-4 text-lg rounded-2xl shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    Join the Waitlist
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-purple-400/50 text-purple-300 hover:bg-purple-500/10 font-semibold px-8 py-4 text-lg rounded-2xl backdrop-blur-sm"
                  >
                    Schedule Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}