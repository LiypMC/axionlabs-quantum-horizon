
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const EmailUpdateForm = ({ initialEmail = '' }: { initialEmail?: string }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [isVerificationMode, setIsVerificationMode] = useState(false);
  
  useEffect(() => {
    // Check if we are in verification mode (from a verification link)
    const hash = window.location.hash;
    if (hash && hash.includes('type=email_change')) {
      setIsVerificationMode(true);
    }
    
    // Update email state if user changes
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);
  
  const handleCompleteEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your new email address');
      return;
    }
    
    setLoading(true);
    
    try {
      // In verification mode, the email update is already being processed
      // We just need to redirect to a success page
      toast.success('Email change successful!', {
        description: 'Your email has been updated successfully'
      });
      navigate('/settings');
    } catch (error: any) {
      toast.error('Failed to update email');
      console.error('Update email error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCompleteEmailUpdate} className="space-y-4">
      {isVerificationMode ? (
        <div className="p-4 bg-blue-500/10 rounded-md border border-blue-200 mb-4">
          <p className="text-sm text-axion-blue font-medium">
            You're verifying your new email address. Click the button below to complete the process.
          </p>
        </div>
      ) : (
        <p className="text-sm text-axion-gray">
          Your verification link has been sent. Complete the process by clicking the link in your email.
        </p>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="new-email">Email Address</Label>
        <Input 
          id="new-email" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-background/50"
          readOnly={isVerificationMode}
          required
        />
        {isVerificationMode && (
          <p className="text-sm text-axion-blue">
            Click the button below to complete your email change.
          </p>
        )}
      </div>
      
      {isVerificationMode && (
        <Button 
          type="submit" 
          className="w-full glass-panel border-axion-blue text-axion-white hover:bg-axion-blue/20 neon-glow"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Complete Email Change'}
        </Button>
      )}
    </form>
  );
};
