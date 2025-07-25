import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Brain, 
  Mic, 
  Zap, 
  Shield, 
  MessageSquare, 
  Activity,
  Users,
  Clock,
  CheckCircle2
} from "lucide-react";

export function AuthShowcase() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Advanced AI Reasoning",
      description: "Gideon processes complex queries with human-like understanding and reasoning capabilities.",
      color: "from-blue-500 to-cyan-400",
      metrics: { accuracy: "99.2%", speed: "120ms", users: "10K+" }
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Voice-First Interface",
      description: "Natural voice interactions with real-time processing and emotion recognition.",
      color: "from-purple-500 to-pink-400",
      metrics: { recognition: "98.7%", latency: "50ms", languages: "12+" }
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Bank-grade encryption with zero data retention options for maximum privacy.",
      color: "from-green-500 to-emerald-400",
      metrics: { encryption: "AES-256", compliance: "SOC2", uptime: "99.9%" }
    }
  ];

  const chatMessages = [
    { role: "user", text: "Analyze this quarterly report and highlight key insights" },
    { role: "gideon", text: "I've analyzed your Q3 report. Revenue increased 23% with strong performance in AI services. Key growth drivers include enterprise partnerships and international expansion. Would you like me to dive deeper into any specific metrics?" }
  ];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Typing animation
  useEffect(() => {
    const targetText = chatMessages[1].text;
    let currentIndex = 0;
    setIsTyping(true);
    setTypingText("");

    const typingInterval = setInterval(() => {
      if (currentIndex < targetText.length) {
        setTypingText(targetText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [activeFeature]);

  const currentFeature = features[activeFeature];

  return (
    <div className="h-full flex flex-col justify-center space-y-8 p-8 lg:p-12">
      {/* Header */}
      <div className="space-y-4">
        <Badge className="bg-white/10 text-white border-white/20 text-sm px-3 py-1">
          <Zap className="w-4 h-4 mr-2" />
          AI-Powered Platform
        </Badge>
        <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
          Meet the Future of
          <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Artificial Intelligence
          </span>
        </h1>
        <p className="text-white/80 text-lg max-w-md">
          Experience Gideon AI - where advanced reasoning meets human-like interaction in a secure enterprise environment.
        </p>
      </div>

      {/* Interactive Feature Showcase */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r ${currentFeature.color}`}>
            {currentFeature.icon}
            <span className="font-semibold text-white">{currentFeature.title}</span>
          </div>
          <div className="flex gap-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeFeature ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
        
        <p className="text-white/70 mb-4">{currentFeature.description}</p>
        
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(currentFeature.metrics).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-xs text-white/60 capitalize">{key}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Live Chat Demo */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-green-400" />
          <span className="text-white font-medium">Live Demo</span>
          <Badge className="bg-green-500/20 text-green-400 text-xs">Active</Badge>
        </div>
        
        <div className="space-y-4">
          {/* User Message */}
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-white/90 text-sm">{chatMessages[0].text}</p>
              </div>
            </div>
          </div>

          {/* Gideon Response */}
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-3 border border-purple-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white font-medium text-sm">Gideon</span>
                  {isTyping && (
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                </div>
                <p className="text-white/90 text-sm">{typingText}</p>
                {!isTyping && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-white/60">
                    <Clock className="w-3 h-3" />
                    <span>Processed in 120ms</span>
                    <CheckCircle2 className="w-3 h-3 text-green-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Trust Indicators */}
      <div className="flex items-center gap-6 text-white/60 text-sm">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span>SOC2 Compliant</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>10K+ Users</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4" />
          <span>99.9% Uptime</span>
        </div>
      </div>
    </div>
  );
}