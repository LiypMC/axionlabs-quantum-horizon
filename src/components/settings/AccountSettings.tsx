
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const AccountSettings = () => {
  const navigate = useNavigate();
  
  const handleChangePassword = () => {
    navigate('/account/update-password');
  };
  
  const handleChangeEmail = () => {
    navigate('/account/update');
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
        
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={() => toast.info('This feature will be added later')}
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
};
