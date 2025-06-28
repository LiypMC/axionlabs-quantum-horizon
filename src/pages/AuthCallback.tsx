
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
        console.log('Auth callback started, URL:', window.location.href);
        
        // Check for OAuth error first
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');
        
        if (error) {
          console.error('OAuth error in URL:', { error, errorDescription });
          toast.error(`Authentication failed: ${errorDescription || error}`);
          navigate('/auth');
          return;
        }
        
        // Get session from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          toast.error('Authentication failed. Please try again.');
          navigate('/auth');
          return;
        }
        
        if (session && session.user) {
          console.log('Authentication successful for user:', session.user.email);
          
          // Create or update user profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profileError) {
            console.error('Profile fetch error:', profileError);
          }
          
          if (!profile) {
            // Create new profile
            const { error: createError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                full_name: session.user.user_metadata?.full_name || 
                          session.user.user_metadata?.name || null,
                avatar_url: session.user.user_metadata?.avatar_url || 
                           session.user.user_metadata?.picture || null,
                profile_completed: false,
                updated_at: new Date().toISOString(),
              });
              
            if (createError) {
              console.error('Profile creation error:', createError);
            }
          }

          toast.success('Successfully signed in!');
          
          // Clear the URL hash
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Navigate to home
          setTimeout(() => {
            navigate('/');
          }, 500);
          
        } else {
          console.log('No valid session found');
          toast.error('Authentication failed. Please try again.');
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

    // Small delay to ensure Supabase has processed the OAuth callback
    const timer = setTimeout(handleAuthCallback, 200);
    
    // Fallback timeout
    const fallbackTimer = setTimeout(() => {
      console.warn('Auth callback taking too long, redirecting to auth page');
      toast.error('Authentication is taking too long. Please try again.');
      navigate('/auth');
      setIsProcessing(false);
    }, 10000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
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
