import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle OAuth callback - Supabase will automatically detect and parse the hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast.error('Authentication failed. Please try again.');
          navigate('/auth');
          return;
        }

        if (data.session && data.session.user) {
          const user = data.session.user;
          
          // Check if user has a profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileError && profileError.code === 'PGRST116') {
            // Profile doesn't exist, create one
            const { error: createError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                full_name: user.user_metadata?.full_name || 
                          user.user_metadata?.name || null,
                avatar_url: user.user_metadata?.avatar_url || 
                           user.user_metadata?.picture || null,
                profile_completed: false,
                updated_at: new Date().toISOString(),
              });

            if (createError) {
              console.error('Error creating profile:', createError);
            }
          }

          toast.success('Successfully signed in!');
          
          // Clear the URL hash to clean up the redirect
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Redirect to home
          navigate('/');
        } else {
          // No session, redirect to auth
          console.log('No session found in callback');
          navigate('/auth');
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        toast.error('An unexpected error occurred. Please try again.');
        navigate('/auth');
      } finally {
        setIsProcessing(false);
      }
    };

    // Add a small delay to ensure Supabase has processed the OAuth callback
    const timer = setTimeout(handleAuthCallback, 100);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  if (!isProcessing) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-lg text-muted-foreground">Completing sign-in...</p>
        <p className="text-sm text-muted-foreground">Setting up your account...</p>
      </div>
    </div>
  );
}