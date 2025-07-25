import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Brain, Headphones, Zap, Volume2, MessageSquare } from "lucide-react";

export default function VoiceIntelligence() {
  return (
    <section id="voice-intelligence" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-gray-900/50 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-6 border-white/30 text-white bg-white/10 text-lg px-6 py-2">
            <Mic className="w-4 h-4 mr-2" />
            Voice Intelligence Core
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Voice is not a feature.
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            It's the foundation.
          </h3>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Gideon is designed for natural voice-first interaction. You don't need to type. You don't need commands. 
            You speak — it listens, reasons, and responds.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 transition-all duration-300 group">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Headphones className="w-6 h-6 text-blue-400" />
              </div>
              <CardTitle className="text-white">Real-time Recognition</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/70">
                Advanced speech processing that understands context, emotion, and intent in real-time conversations.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 transition-all duration-300 group">
            <CardHeader>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Volume2 className="w-6 h-6 text-green-400" />
              </div>
              <CardTitle className="text-white">Emotion-Aware Output</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/70">
                Gideon doesn't just speak — it communicates with natural intonation, emotion, and personality.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 transition-all duration-300 group">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-purple-400" />
              </div>
              <CardTitle className="text-white">Persistent Memory</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/70">
                Long-term contextual memory that remembers your conversations, preferences, and relationship over time.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white mb-6">
              This is not text-to-speech or voice commands.
            </h3>
            <p className="text-xl text-white/80 leading-relaxed">
              Gideon <strong>talks</strong> — like it's alive.
            </p>
            
            <div className="space-y-4">
              {[
                "No wake words needed — natural conversation flow",
                "Contextual understanding across multiple topics", 
                "Emotional intelligence and personality adaptation",
                "Real-time response generation without delays"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <Brain className="w-12 h-12 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-2xl font-bold text-white">Gideon E2</h4>
                    <p className="text-white/70">Core Intelligence Model</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">Voice Processing</span>
                      <span className="text-green-400 text-sm">Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">Memory Context</span>
                      <span className="text-blue-400 text-sm">2.4k tokens</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">Response Time</span>
                      <span className="text-purple-400 text-sm">~120ms</span>
                    </div>
                  </div>
                  
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    <Zap className="w-3 h-3 mr-1" />
                    Real-time Intelligence
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            {/* Glowing effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-2xl -z-10 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}