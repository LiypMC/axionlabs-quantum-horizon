
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

export default function Settings() {
  const { user, profile, isAuthenticated, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-axion-blue" />
      </div>
    );
  }
  
  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setUpdating(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error('Error updating profile');
      console.error('Error updating profile:', error.message);
    } finally {
      setUpdating(false);
    }
  };
  
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) {
      return;
    }
    
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}-${Math.random()}.${fileExt}`;
    
    setUploading(true);
    
    try {
      // For demo purposes, we're just using the existing avatar URL
      // In a real implementation, you would upload the file to storage
      // and then update the user's profile with the new URL
      
      // Since we don't have storage bucket set up yet, we'll simulate this
      // by just using a timeout and then updating the UI
      setTimeout(async () => {
        // Update profile with new avatar URL
        const { error } = await supabase
          .from('profiles')
          .update({
            avatar_url: `https://www.gravatar.com/avatar/${Math.random().toString(36).substring(2)}?d=identicon`,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
          
        if (error) {
          throw error;
        }
        
        toast.success('Avatar updated successfully');
        
        // Refresh the page to show the updated avatar
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      toast.error('Error uploading avatar');
      console.error('Error uploading avatar:', error.message);
    } finally {
      setUploading(false);
    }
  };
  
  const getInitials = () => {
    if (fullName) {
      return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    
    return username?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || 'AX';
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background animate-fade-in">
      <Card className="w-full max-w-2xl glass-panel border-axion-blue/30">
        <CardHeader className="text-center">
          <CardTitle className="heading text-2xl">User Settings</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  className="relative"
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Change Avatar'}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                  />
                </Button>
              </div>
              
              <form onSubmit={updateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                  />
                  <p className="text-xs text-axion-gray">Email cannot be changed (yet)</p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full glass-panel border-axion-blue text-axion-white hover:bg-axion-blue/20 neon-glow"
                  disabled={updating}
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="account">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <p className="text-sm text-axion-gray">
                    Password reset functionality will be added later as per requirements.
                  </p>
                </div>
                
                <div className="border-t border-axion-blue/20 pt-6">
                  <h3 className="text-lg font-medium mb-2">Account Management</h3>
                  <p className="text-sm text-axion-gray mb-4">
                    These actions will affect your account and cannot be undone easily.
                  </p>
                  
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => toast.info('This feature will be added later')}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
