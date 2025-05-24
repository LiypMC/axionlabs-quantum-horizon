
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

interface ProfileFormProps {
  user: User | null;
  initialUsername: string;
  initialFullName: string;
}

export const ProfileForm = ({ user, initialUsername, initialFullName }: ProfileFormProps) => {
  const [username, setUsername] = useState(initialUsername);
  const [fullName, setFullName] = useState(initialFullName);
  const [updating, setUpdating] = useState(false);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setUpdating(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error('Error updating profile');
      console.error('Error updating profile:', error.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <form onSubmit={updateProfile} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-background/50 border-white/20 focus:border-quantum-purple"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="bg-background/50 border-white/20 focus:border-quantum-purple"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={user?.email || ''}
          disabled
          className="bg-background/30 border-white/10"
        />
        <p className="text-xs text-foreground/60">Email cannot be changed (yet)</p>
      </div>
      <Button 
        type="submit" 
        className="w-full energy-button rounded-lg py-3 neon-glow"
        disabled={updating}
      >
        {updating ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
};
