
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';

export const AccountSettings = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleChangePassword = () => {
    navigate('/account/update-password');
  };
  
  const handleChangeEmail = () => {
    navigate('/account/update');
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
      navigate('/');
      
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
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleChangePassword}
        >
          Change Password
        </Button>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Change Email</h3>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleChangeEmail}
        >
          Change Email
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
