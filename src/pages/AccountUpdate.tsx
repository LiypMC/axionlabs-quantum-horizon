
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
  const [activeTab, setActiveTab] = useState('password');
  
  useEffect(() => {
    // Check URL hash for type parameter
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(hash.replace('#', ''));
    const type = urlParams.get('type');
    
    if (type === 'recovery') {
      // We're in password recovery mode
      setActiveTab('password');
      toast.info('Please set your new password');
    } else if (type === 'email_change') {
      // We're in email change verification mode
      setActiveTab('email');
      toast.info('Please complete your email update');
    } else if (!isAuthenticated && !hash) {
      // Not authenticated and not in recovery mode, redirect to auth
      navigate('/auth');
    } else if (user?.email) {
      // If we have the user email, set it
      setEmail(user.email);
    }
  }, [isAuthenticated, navigate, user]);
  
  const isVerificationFlow = window.location.hash.includes('type=');
  
  return (
    <AccountLayout 
      title="Account Settings" 
      description={isVerificationFlow ? "Complete your verification" : "Update your account information"}
    >
      {isVerificationFlow ? (
        window.location.hash.includes('type=recovery') ? (
          <PasswordUpdateForm />
        ) : (
          <EmailUpdateForm initialEmail={email} />
        )
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
