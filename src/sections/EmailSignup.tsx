
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Zap, Bell, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Successfully subscribed!",
      description: "You'll be the first to know about Gideon and our latest AGI innovations.",
    });
    
    setEmail("");
    setIsLoading(false);
  };

  return (
    <section id="signup" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border border-primary/20 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <Badge className="bg-primary/20 text-primary border-primary/30">
                <Bell className="w-3 h-3 mr-1" />
                Early Access
              </Badge>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
              Be First to Meet Gideon
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our exclusive list and get early access to the hyper-intelligent AI platform 
              that will change how humans interact with artificial intelligence.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-2 p-4 bg-card/50 rounded-lg border border-border/30">
                <Zap className="w-6 h-6 text-primary" />
                <span className="font-medium">Early Access</span>
                <span className="text-sm text-muted-foreground">Beta invitations before launch</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-card/50 rounded-lg border border-border/30">
                <Mail className="w-6 h-6 text-primary" />
                <span className="font-medium">Exclusive Updates</span>
                <span className="text-sm text-muted-foreground">Behind-the-scenes development</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-card/50 rounded-lg border border-border/30">
                <ArrowRight className="w-6 h-6 text-primary" />
                <span className="font-medium">Special Pricing</span>
                <span className="text-sm text-muted-foreground">Founder pricing for early users</span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-background/50 border-border/50"
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="font-semibold"
                size="lg"
              >
                {isLoading ? "Subscribing..." : "Get Early Access"}
              </Button>
            </form>
            
            <p className="text-center text-sm text-muted-foreground">
              Join 2,500+ researchers, developers, and AI enthusiasts already on our list.
              <br />
              No spam, unsubscribe anytime.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
