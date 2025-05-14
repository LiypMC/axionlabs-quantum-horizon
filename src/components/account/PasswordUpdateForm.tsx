
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export const PasswordUpdateForm = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  
  useEffect(() => {
    // Check if we are in recovery mode (from a password reset link)
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      setIsRecoveryMode(true);
    }
  }, []);
  
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      toast.error('Please enter your new password');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password updated successfully');
        navigate('/');
      }
    } catch (error: any) {
      toast.error('Failed to update password');
      console.error('Update password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdatePassword} className="space-y-4">
      {isRecoveryMode && (
        <div className="p-4 bg-blue-500/10 rounded-md border border-blue-200 mb-4">
          <p className="text-sm text-axion-blue font-medium">
            You're setting a new password via a recovery link. Please enter your new password below.
          </p>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <Input 
          id="new-password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-background/50"
          required
          minLength={6}
        />
        <p className="text-xs text-axion-gray">Must be at least 6 characters</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm New Password</Label>
        <Input 
          id="confirm-password" 
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="bg-background/50"
          required
        />
      </div>
      <Button 
        type="submit" 
        className="w-full glass-panel border-axion-blue text-axion-white hover:bg-axion-blue/20 neon-glow"
        disabled={loading}
      >
        {loading ? 'Updating...' : 'Update Password'}
      </Button>
    </form>
  );
};
