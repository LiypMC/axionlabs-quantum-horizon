
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { ProfileForm } from '@/components/settings/ProfileForm';
import { UserAvatar } from '@/components/settings/UserAvatar';
import { AccountSettings } from '@/components/settings/AccountSettings';

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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-axion-blue" />
      </div>
    );
  }
  
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
              <UserAvatar 
                userId={user?.id} 
                avatarUrl={avatarUrl} 
                getInitials={getInitials} 
              />
              
              <ProfileForm 
                user={user} 
                initialUsername={username} 
                initialFullName={fullName} 
              />
            </TabsContent>
            
            <TabsContent value="account">
              <AccountSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
