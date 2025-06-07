
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
    <form onSubmit={handleUpdatePassword} className="space-y-6">
      {isRecoveryMode && (
        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 mb-6">
          <p className="text-sm text-primary font-medium">
            You're setting a new password via a recovery link. Please enter your new password below.
          </p>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="new-password" className="text-foreground font-medium">New Password</Label>
        <Input 
          id="new-password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20"
          required
          minLength={6}
          placeholder="Enter your new password"
        />
        <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password" className="text-foreground font-medium">Confirm New Password</Label>
        <Input 
          id="confirm-password" 
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20"
          required
          placeholder="Confirm your new password"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold shadow-lg"
        disabled={loading}
      >
        {loading ? 'Updating Password...' : 'Update Password'}
      </Button>
    </form>
  );
};
