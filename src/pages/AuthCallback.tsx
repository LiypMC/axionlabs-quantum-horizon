import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { manualCreateProfile, manualCheckProfile } from '@/lib/manual-profile';
import { toast } from 'sonner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Auth callback started, URL:', window.location.href);
        console.log('URL hash:', window.location.hash);
        console.log('URL search:', window.location.search);
        
        // First, try to get the session from URL hash/params (OAuth callback)
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        console.log('Initial session check:', { sessionData, sessionError });
        
        // If no session yet, check if we have OAuth tokens in URL
        if (!sessionData.session || sessionError) {
          console.log('No session found, checking for OAuth tokens in URL...');
          
          // Check for OAuth tokens in URL hash
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          console.log('OAuth tokens from hash:', { accessToken: !!accessToken, refreshToken: !!refreshToken });
          
          if (accessToken && refreshToken) {
            console.log('Setting session from OAuth tokens...');
            
            const { data: newSessionData, error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            console.log('Set session result:', { newSessionData, setSessionError });
            
            if (setSessionError) {
              console.error('Error setting session:', setSessionError);
              toast.error('Authentication failed. Please try again.');
              navigate('/auth');
              return;
            }
            
            // Use the new session data
            if (newSessionData.session && newSessionData.session.user) {
              await handleSuccessfulAuth(newSessionData.session.user);
              return;
            }
          }
        } else if (sessionData.session && sessionData.session.user) {
          console.log('Existing session found');
          await handleSuccessfulAuth(sessionData.session.user);
          return;
        }
        
        // If we get here, no valid session was found
        console.log('No valid session found, redirecting to auth');
        toast.error('Authentication failed. Please try again.');
        navigate('/auth');
        
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        toast.error('An unexpected error occurred. Please try again.');
        navigate('/auth');
      } finally {
        setIsProcessing(false);
      }
    };

    const handleSuccessfulAuth = async (user: any) => {
      try {
        console.log('Handling successful auth for user:', user.id);
        
        // Try Supabase client first, then manual fetch
        let profile = null;
        let profileError = null;
        
        try {
          console.log('Checking profile with Supabase client...');
          const { data: profileData, error: supabaseProfileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          profile = profileData;
          profileError = supabaseProfileError;
          console.log('Supabase profile check:', { profile, profileError });
        } catch (err) {
          console.error('Supabase profile check failed, trying manual fetch...', err);
          
          // Fallback to manual profile check
          const { data: manualProfileData, error: manualProfileError } = await manualCheckProfile(user.id);
          profile = manualProfileData;
          profileError = manualProfileError;
          console.log('Manual profile check:', { profile, profileError });
        }

        if (profileError && profileError.code === 'PGRST116') {
          console.log('Creating new profile for user...');
          
          const profileData = {
            id: user.id,
            full_name: user.user_metadata?.full_name || 
                      user.user_metadata?.name || null,
            avatar_url: user.user_metadata?.avatar_url || 
                       user.user_metadata?.picture || null,
            profile_completed: false,
            updated_at: new Date().toISOString(),
          };
          
          // Try Supabase client first, then manual
          try {
            const { error: createError } = await supabase
              .from('profiles')
              .insert(profileData);

            if (createError) {
              console.error('Supabase profile creation failed, trying manual...', createError);
              
              // Fallback to manual profile creation
              const { error: manualCreateError } = await manualCreateProfile(profileData);
              
              if (manualCreateError) {
                console.error('Manual profile creation also failed:', manualCreateError);
                console.log('Continuing without profile creation...');
              } else {
                console.log('Manual profile creation successful');
              }
            } else {
              console.log('Supabase profile creation successful');
            }
          } catch (profileCreateError) {
            console.error('Profile creation failed completely, but continuing auth:', profileCreateError);
          }
        } else if (profileError) {
          console.error('Profile check error (non-404):', profileError);
          // Don't fail auth for profile errors
        } else {
          console.log('Profile already exists');
        }

        toast.success('Successfully signed in!');
        
        // Clear the URL hash to clean up the redirect
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Small delay before redirect to ensure everything is set
        setTimeout(() => {
          console.log('Redirecting to home page...');
          navigate('/');
        }, 500);
        
      } catch (error) {
        console.error('Error in handleSuccessfulAuth:', error);
        toast.error('Authentication completed but there was an error setting up your profile.');
        navigate('/');
      }
    };

    // Add a small delay to ensure Supabase has processed the OAuth callback
    const timer = setTimeout(handleAuthCallback, 200);
    
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