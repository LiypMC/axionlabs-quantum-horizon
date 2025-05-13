
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AccountLayout } from '@/components/account/AccountLayout';
import { PasswordUpdateForm } from '@/components/account/PasswordUpdateForm';
import { EmailUpdateForm } from '@/components/account/EmailUpdateForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function AccountUpdate() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    // Check if we have a hash fragment that indicates password recovery
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      // We're in password recovery mode
      toast.info('Please set your new password');
    } else if (!isAuthenticated) {
      // Not authenticated and not in recovery mode, redirect to auth
      navigate('/auth');
    } else if (user?.email) {
      // If we have the user email, set it
      setEmail(user.email);
    }
  }, [isAuthenticated, navigate, user]);
  
  const isRecoveryMode = window.location.hash.includes('type=recovery');
  
  return (
    <AccountLayout 
      title="Account Settings" 
      description="Update your account information"
    >
      {isRecoveryMode ? (
        <PasswordUpdateForm />
      ) : (
        <Tabs defaultValue="password" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>
          
          <TabsContent value="password">
            <PasswordUpdateForm />
          </TabsContent>
          
          <TabsContent value="email">
            <EmailUpdateForm initialEmail={email} />
          </TabsContent>
        </Tabs>
      )}
    </AccountLayout>
  );
}
