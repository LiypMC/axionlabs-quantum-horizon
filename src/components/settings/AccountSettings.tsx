
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const AccountSettings = () => {
  const { signOut, user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isSendingEmailChange, setIsSendingEmailChange] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  
  const handleSendPasswordResetLink = async () => {
    try {
      setIsSendingReset(true);
      
      if (!user || !user.email) {
        throw new Error('User email not found');
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(
        user.email,
        {
          redirectTo: `${window.location.origin}/account/update`,
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
      
      if (!newEmail) {
        throw new Error('Please enter a new email address');
      }
      
      if (newEmail === user?.email) {
        throw new Error('New email cannot be the same as current email');
      }
      
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Email verification sent', {
        description: 'Check your new email address for the verification link'
      });
      
      setShowEmailInput(false);
      setNewEmail('');
      
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
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Change Password</h3>
        <p className="text-sm text-muted-foreground">
          We'll send a password reset link to your email address.
        </p>
        <Button 
          variant="outline" 
          className="w-full border-border/30 hover:bg-background/50"
          onClick={handleSendPasswordResetLink}
          disabled={isSendingReset}
        >
          {isSendingReset ? 'Sending Link...' : 'Send Password Reset Link'}
        </Button>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Change Email</h3>
        <p className="text-sm text-muted-foreground">
          Enter your new email address and we'll send a verification link.
        </p>
        <p className="text-xs text-muted-foreground">
          Current email: <span className="font-medium">{user?.email}</span>
        </p>
        
        {showEmailInput ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-email" className="text-foreground">New Email Address</Label>
              <Input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter your new email address"
                className="bg-background/50 border-border/30 focus:border-primary"
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex-1 border-border/30 hover:bg-background/50"
                onClick={handleSendEmailUpdateLink}
                disabled={isSendingEmailChange || !newEmail}
              >
                {isSendingEmailChange ? 'Sending...' : 'Send Verification'}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setShowEmailInput(false);
                  setNewEmail('');
                }}
                className="hover:bg-background/30"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            variant="outline" 
            className="w-full border-border/30 hover:bg-background/50"
            onClick={() => setShowEmailInput(true)}
          >
            Change Email Address
          </Button>
        )}
      </div>
      
      <div className="border-t border-border/30 pt-6">
        <h3 className="text-lg font-medium mb-2 text-foreground">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          These actions will permanently affect your account and cannot be undone.
        </p>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 text-red-400"
            >
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="glass-panel border-red-600/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-border/30 hover:bg-background/50">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
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
