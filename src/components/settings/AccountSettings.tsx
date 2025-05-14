
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';

export const AccountSettings = () => {
  const { signOut, user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isSendingEmailChange, setIsSendingEmailChange] = useState(false);
  
  const handleSendPasswordResetLink = async () => {
    try {
      setIsSendingReset(true);
      
      // Check if we have the user email
      if (!user || !user.email) {
        throw new Error('User email not found');
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(
        user.email,
        {
          redirectTo: `${window.location.origin}/account/update-password`,
        }
      );
      
      if (error) {
        throw error;
      }
      
      toast.success('Password reset link sent', {
        description: 'Check your email for the password reset link'
      });
      
    } catch (error: any) {
      toast.error('Failed to send password reset link: ' + error.message);
      console.error('Password reset error:', error);
    } finally {
      setIsSendingReset(false);
    }
  };
  
  const handleSendEmailUpdateLink = async () => {
    try {
      setIsSendingEmailChange(true);
      
      // Check if we have the user email
      if (!user || !user.email) {
        throw new Error('User email not found');
      }
      
      const { error } = await supabase.auth.updateUser({
        email: user.email, // We send to current email
        options: {
          emailRedirectTo: `${window.location.origin}/account/update`
        }
      } as any); // Type assertion to bypass TypeScript error temporarily
      
      if (error) {
        throw error;
      }
      
      toast.success('Email update link sent', {
        description: 'Check your email for the verification link'
      });
      
    } catch (error: any) {
      toast.error('Failed to send email update link: ' + error.message);
      console.error('Email update error:', error);
    } finally {
      setIsSendingEmailChange(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      
      const { error } = await supabase.rpc('delete_user');
      
      if (error) {
        throw error;
      }
      
      // Sign out after successful account deletion
      await signOut();
      toast.success('Your account has been deleted');
      
    } catch (error: any) {
      toast.error('Failed to delete account: ' + error.message);
      console.error('Delete account error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Change Password</h3>
        <p className="text-sm text-axion-gray">
          We'll send a password reset link to your email address.
        </p>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleSendPasswordResetLink}
          disabled={isSendingReset}
        >
          {isSendingReset ? 'Sending Link...' : 'Send Password Reset Link'}
        </Button>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Change Email</h3>
        <p className="text-sm text-axion-gray">
          We'll send a verification link to update your email address.
        </p>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleSendEmailUpdateLink}
          disabled={isSendingEmailChange}
        >
          {isSendingEmailChange ? 'Sending Link...' : 'Send Email Update Link'}
        </Button>
      </div>
      
      <div className="border-t border-axion-blue/20 pt-6">
        <h3 className="text-lg font-medium mb-2">Account Management</h3>
        <p className="text-sm text-axion-gray mb-4">
          These actions will affect your account and cannot be undone easily.
        </p>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              className="w-full"
            >
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
