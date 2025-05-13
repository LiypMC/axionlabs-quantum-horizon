
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export const EmailUpdateForm = ({ initialEmail = '' }: { initialEmail?: string }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your new email address');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ email });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Verification email sent to your new address', {
          description: 'Please check your email to confirm the change'
        });
        navigate('/');
      }
    } catch (error: any) {
      toast.error('Failed to update email');
      console.error('Update email error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdateEmail} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="new-email">New Email</Label>
        <Input 
          id="new-email" 
          type="email" 
          placeholder="your.new.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-background/50"
          required
        />
      </div>
      <Button 
        type="submit" 
        className="w-full glass-panel border-axion-blue text-axion-white hover:bg-axion-blue/20 neon-glow"
        disabled={loading}
      >
        {loading ? 'Updating...' : 'Update Email'}
      </Button>
    </form>
  );
};
