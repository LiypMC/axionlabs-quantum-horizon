
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Cross-domain auth callback started, URL:', window.location.href);
        
        // Check for temp token from cross-domain auth
        const urlParams = new URLSearchParams(window.location.search);
        const tempToken = urlParams.get('token');
        const returnTo = urlParams.get('return_to') || '/';
        
        if (tempToken) {
          try {
            // Exchange temp token with API
            const response = await fetch('https://axionlabs-api.a-contactnaol.workers.dev/auth/cross-domain/callback', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                temp_token: tempToken,
                target_domain: window.location.hostname,
                return_url: returnTo,
              }),
            });

            const result = await response.json();
            
            if (result.success && result.data.access_token) {
              // Store authentication token
              localStorage.setItem('auth_token', result.data.access_token);
              localStorage.setItem('user_data', JSON.stringify(result.data.user));
              
              toast.success('Successfully authenticated!');
              
              // Navigate to return URL or home
              setTimeout(() => {
                navigate(returnTo === window.location.href ? '/' : returnTo);
              }, 500);
            } else {
              throw new Error(result.error || 'Authentication failed');
            }
          } catch (error) {
            console.error('Cross-domain auth error:', error);
            toast.error('Authentication failed. Please try again.');
            const currentUrl = window.location.href;
            const redirectUrl = `https://user.axionshosting.com/auth/login?redirect=${encodeURIComponent(currentUrl)}&app=main`;
            window.location.href = redirectUrl;
            return;
          }
        } else {
          console.log('No temp token found, redirecting to auth');
          toast.error('Invalid authentication callback.');
          const currentUrl = window.location.href;
          const redirectUrl = `https://user.axionshosting.com/auth/login?redirect=${encodeURIComponent(currentUrl)}&app=main`;
          window.location.href = redirectUrl;
          return;
        }
        
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        toast.error('An unexpected error occurred. Please try again.');
        const currentUrl = window.location.href;
        const redirectUrl = `https://user.axionshosting.com/auth/login?redirect=${encodeURIComponent(currentUrl)}&app=main`;
        window.location.href = redirectUrl;
      } finally {
        setIsProcessing(false);
      }
    };

    // Small delay to ensure URL params are available
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
