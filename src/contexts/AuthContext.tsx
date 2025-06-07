
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { manualSignUp, manualSignIn } from '@/lib/manual-auth';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithGithub: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // First set up the auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Fetch user profile using setTimeout to avoid deadlock
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );
    
    // Then check for an existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
      
      setLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const createUserProfile = async (userId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
          profile_completed: false,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error creating user profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in createUserProfile:', error);
    }
  };
  
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        await createUserProfile(userId);
      } else if (error) {
        console.error('Error fetching user profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };
  
  const signUp = async (email: string, password: string) => {
    try {
      console.log('Attempting signup with Supabase...');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      console.log('Signup response:', { data, error });
      
      if (error) {
        console.error('SignUp error:', error);
        return { error };
      }
      
      toast.success('Account created successfully!', {
        description: 'You can now sign in with your credentials'
      });
      
      return { error: null };
    } catch (err) {
      console.error('Supabase signup failed, trying manual auth...', err);
      
      // Fallback to manual auth
      try {
        const { data, error } = await manualSignUp(email, password);
        
        if (error) {
          return { error };
        }
        
        toast.success('Account created successfully!', {
          description: 'You can now sign in with your credentials'
        });
        
        return { error: null };
      } catch (manualErr) {
        console.error('Manual signup also failed:', manualErr);
        toast.error('Network error. Please check your connection and try again.');
        const networkError = {
          message: 'Network error. Please check your connection and try again.',
          name: 'NetworkError'
        } as any;
        return { error: networkError };
      }
    }
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting signin with Supabase...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('Signin response:', { data, error });
      
      if (error) {
        console.error('SignIn error:', error);
        return { error };
      }
      
      toast.success('Successfully signed in!');
      return { error: null };
    } catch (err) {
      console.error('Supabase signin failed, trying manual auth...', err);
      
      // Fallback to manual auth
      try {
        const { data, error } = await manualSignIn(email, password);
        
        if (error) {
          return { error };
        }
        
        // Manually set the session if manual auth worked
        if (data && data.access_token) {
          // Refresh the auth state
          window.location.reload();
        }
        
        toast.success('Successfully signed in!');
        return { error: null };
      } catch (manualErr) {
        console.error('Manual signin also failed:', manualErr);
        toast.error('Network error. Please check your connection and try again.');
        const networkError = {
          message: 'Network error. Please check your connection and try again.',
          name: 'NetworkError'
        } as any;
        return { error: networkError };
      }
    }
  };
  
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        }
      });
      
      if (error) {
        console.error('Google OAuth error:', error);
        toast.error('Google sign-in failed: ' + error.message);
      }
      
      return { error };
    } catch (err) {
      console.error('Network error during Google OAuth:', err);
      toast.error('Network error. Please check your connection and try again.');
      return { error: err };
    }
  };
  
  const signInWithGithub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'read:user user:email',
        }
      });
      
      if (error) {
        console.error('GitHub OAuth error:', error);
        toast.error('GitHub sign-in failed: ' + error.message);
      }
      
      return { error };
    } catch (err) {
      console.error('Network error during GitHub OAuth:', err);
      toast.error('Network error. Please check your connection and try again.');
      return { error: err };
    }
  };
  
  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success('You have been signed out');
  };
  
  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithGithub,
        signOut,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
