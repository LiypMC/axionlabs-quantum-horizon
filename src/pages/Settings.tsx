
import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, User, Settings as SettingsIcon, Shield, Cpu, Zap, AlertCircle } from 'lucide-react';
import { ProfileForm } from '@/components/settings/ProfileForm';
import { UserAvatar } from '@/components/settings/UserAvatar';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { ProfileCompletion } from '@/components/settings/ProfileCompletion';

export default function Settings() {
  const { user, profile, isAuthenticated, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setFullName(profile.full_name || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);
  
  // Redirect if not authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading quantum profile...</p>
        </div>
      </div>
    );
  }
  
  const getInitials = () => {
    if (fullName) {
      return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    
    return username?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || 'AX';
  };
  
  const logoSrc = "/lovable-uploads/1649c4bf-c03b-4d41-b660-4a2d8eded619.png";
  
  // Check if profile is incomplete
  const isProfileIncomplete = !profile?.profile_completed || 
    !profile?.full_name || 
    !profile?.company_name || 
    !profile?.job_title;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-neural-grid opacity-30" />
      <div className="absolute inset-0 bg-energy-field" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse delay-1000" />
      
      <header className="relative z-10 w-full p-6 flex justify-between items-center border-b border-border/20 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-3 text-foreground hover:text-primary transition-all duration-300 group">
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img src={logoSrc} alt="AxionLabs" className="h-8" />
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{fullName || username || 'Quantum Researcher'}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>
      </header>
      
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] p-6">
        <Card className="w-full max-w-4xl glass-panel border-primary/20 shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center space-y-4 pb-8 border-b border-border/20">
            <div className="flex items-center justify-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl font-bold text-primary border-2 border-primary/30">
                  {getInitials()}
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <SettingsIcon className="w-3 h-3 text-primary-foreground" />
                </div>
              </div>
            </div>
            
            <div>
              <CardTitle className="heading text-3xl mb-2">Quantum Profile Settings</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Manage your research profile and quantum platform preferences
              </CardDescription>
            </div>
            
            {isProfileIncomplete && (
              <div className="flex items-center justify-center gap-2 text-sm text-orange-400 bg-orange-400/10 border border-orange-400/20 rounded-lg px-4 py-2">
                <AlertCircle className="h-4 w-4" />
                <span>Complete your profile to unlock all features</span>
              </div>
            )}
            
            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>Quantum Secure</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Cpu className="h-4 w-4 text-accent" />
                <span>QHub Ready</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-primary" />
                <span>Premium Access</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <Tabs defaultValue={isProfileIncomplete ? "complete" : "profile"} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-background/20 border border-border/30 h-12">
                {isProfileIncomplete && (
                  <TabsTrigger 
                    value="complete" 
                    className="data-[state=active]:bg-orange-400/20 data-[state=active]:text-orange-400 font-medium h-10 flex items-center gap-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    Complete Profile
                  </TabsTrigger>
                )}
                <TabsTrigger 
                  value="profile" 
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-medium h-10 flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Research Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="account" 
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-medium h-10 flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Account Security
                </TabsTrigger>
              </TabsList>
              
              {isProfileIncomplete && (
                <TabsContent value="complete" className="space-y-8">
                  <Card className="border-orange-400/30 bg-orange-400/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-orange-400" />
                        Complete Your Profile
                      </CardTitle>
                      <CardDescription>
                        Help us customize your AxionLabs experience by completing your professional profile
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ProfileCompletion user={user} />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              
              <TabsContent value="profile" className="space-y-8">
                <Card className="border-border/30 bg-background/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Profile Avatar
                    </CardTitle>
                    <CardDescription>
                      Your avatar represents you across the AxionLabs quantum platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserAvatar 
                      userId={user?.id} 
                      avatarUrl={avatarUrl} 
                      getInitials={getInitials} 
                    />
                  </CardContent>
                </Card>
                
                <Card className="border-border/30 bg-background/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-primary" />
                      Researcher Information
                    </CardTitle>
                    <CardDescription>
                      Update your professional information for quantum research collaboration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProfileForm 
                      user={user} 
                      initialUsername={username} 
                      initialFullName={fullName} 
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="account" className="space-y-8">
                <Card className="border-border/30 bg-background/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Security Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your quantum platform security and authentication preferences
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
}
