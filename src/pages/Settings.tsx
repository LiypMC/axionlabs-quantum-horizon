
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Settings as SettingsIcon } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { useAuth } from "@/contexts/AuthContext";

const Settings = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    const currentUrl = window.location.href;
    const redirectUrl = `https://user.axionshosting.com/auth/login?redirect=${encodeURIComponent(currentUrl)}&app=main`;
    window.location.href = redirectUrl;
    return null;
  }

  return (
    <div className="min-h-screen bg-black p-4 relative overflow-hidden">
      {/* Enhanced Spline Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Gradient Overlay Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/80 to-black z-10" />
        
        {/* Spline 3D Scene */}
        <div className="absolute inset-0 transform origin-center spline-background">
          <iframe 
            src='https://my.spline.design/particles-M8cFBTt81yqFzQOHv7R06Ql3/' 
            frameBorder='0' 
            width='100%' 
            height='100%'
            className="w-full h-full opacity-70"
            loading="lazy"
            title="3D Particle Background"
          />
        </div>
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50 z-20" />
        
        {/* Floating Particles Effect */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse animate-particle-drift" />
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-pulse animate-particle-drift-delayed" />
          <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white/15 rounded-full animate-pulse animate-particle-drift-slow" />
          <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-white/25 rounded-full animate-pulse animate-particle-drift" />
        </div>
        
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 z-25 opacity-10">
          <div className="absolute inset-0"
               style={{
                 backgroundImage: `
                   linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                 `,
                 backgroundSize: '40px 40px'
               }}
          />
        </div>
        
        {/* Radial Spotlight Effect */}
        <div className="absolute inset-0 z-40 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.4)_80%)]" />
      </div>
      
      {/* Back to Home */}
      <Link 
        to="/" 
        className="fixed top-6 left-6 z-10 flex items-center gap-2 text-white/70 hover:text-white transition-colors glass-button px-4 py-2 rounded-full"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="max-w-4xl mx-auto pt-20 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-white/70">Manage your account and preferences</p>
        </div>

        <Card className="glass-card border-white/10 bg-black/80 backdrop-blur-xl">
          <CardContent className="p-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20 mb-6">
                <TabsTrigger value="profile" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="account" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Account
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card className="glass-card border-white/10 bg-white/5">
                  <CardHeader>
                    <CardTitle className="text-white">Profile Information</CardTitle>
                    <CardDescription className="text-white/70">
                      Update your personal information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProfileForm 
                      user={user}
                      initialUsername={profile?.username || ''}
                      initialFullName={profile?.full_name || ''}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="account" className="space-y-6">
                <Card className="glass-card border-white/10 bg-white/5">
                  <CardHeader>
                    <CardTitle className="text-white">Account Settings</CardTitle>
                    <CardDescription className="text-white/70">
                      Manage your account security and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AccountSettings />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
