
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
    const hash = window.location.hash;
    if (hash && hash.includes('type=email_change')) {
      setIsVerificationMode(true);
    }
    
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
      toast.success('Email change verified!', {
        description: 'Your email has been updated successfully'
      });
      navigate('/settings');
    } catch (error: any) {
      toast.error('Failed to verify email change');
      console.error('Update email error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCompleteEmailUpdate} className="space-y-6">
      {isVerificationMode ? (
        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 mb-6">
          <p className="text-sm text-primary font-medium">
            You're verifying your new email address. Click the button below to complete the process.
          </p>
        </div>
      ) : (
        <div className="p-4 bg-accent/10 rounded-lg border border-accent/20 mb-6">
          <p className="text-sm text-accent font-medium">
            Your verification link has been sent. Complete the process by clicking the link in your email.
          </p>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="new-email" className="text-foreground font-medium">Email Address</Label>
        <Input 
          id="new-email" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20"
          readOnly={isVerificationMode}
          required
          placeholder="your-email@company.com"
        />
        {isVerificationMode && (
          <p className="text-sm text-primary">
            Click the button below to complete your email change.
          </p>
        )}
      </div>
      
      {isVerificationMode && (
        <Button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold shadow-lg"
          disabled={loading}
        >
          {loading ? 'Completing Update...' : 'Complete Email Change'}
        </Button>
      )}
    </form>
  );
};
