
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserAvatarProps {
  userId: string | undefined;
  avatarUrl: string;
  getInitials: () => string;
}

export const UserAvatar = ({ userId, avatarUrl, getInitials }: UserAvatarProps) => {
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !userId) {
      return;
    }
    
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}-${Math.random()}.${fileExt}`;
    
    setUploading(true);
    
    try {
      // For demo purposes, we're just using the existing avatar URL
      // In a real implementation, you would upload the file to storage
      // and then update the user's profile with the new URL
      
      // Since we don't have storage bucket set up yet, we'll simulate this
      // by just using a timeout and then updating the UI
      setTimeout(async () => {
        // Update profile with new avatar URL
        const { error } = await supabase
          .from('profiles')
          .update({
            avatar_url: `https://www.gravatar.com/avatar/${Math.random().toString(36).substring(2)}?d=identicon`,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);
          
        if (error) {
          throw error;
        }
        
        toast.success('Avatar updated successfully');
        
        // Refresh the page to show the updated avatar
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      toast.error('Error uploading avatar');
      console.error('Error uploading avatar:', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <Avatar className="h-24 w-24 mb-4">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
      </Avatar>
      <Button
        variant="outline"
        className="relative"
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Change Avatar'}
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleAvatarUpload}
          disabled={uploading}
        />
      </Button>
    </div>
  );
};
