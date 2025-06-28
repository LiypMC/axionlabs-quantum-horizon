
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
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
    // Set up the auth listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state change:', event, currentSession?.user?.email);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Fetch user profile without blocking
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );
    
    // Then check for an existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Initial session check:', currentSession?.user?.email);
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        setTimeout(() => {
          fetchUserProfile(currentSession.user.id);
        }, 0);
      }
      
      setLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const createUserProfile = async (userId: string, userData?: any) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: userData?.full_name || userData?.name || null,
          avatar_url: userData?.avatar_url || userData?.picture || null,
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
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching user profile:', error);
      } else if (!data) {
        // Profile doesn't exist, create one
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await createUserProfile(userId, user.user_metadata);
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };
  
  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('SignUp error:', error);
        return { error };
      }
      
      if (data?.user && !data.session) {
        toast.success('Check your email for verification link!');
      } else {
        toast.success('Account created successfully!');
      }
      
      return { error: null };
    } catch (err) {
      console.error('Signup failed:', err);
      const networkError = {
        message: 'Network error. Please check your connection and try again.',
        name: 'NetworkError'
      } as AuthError;
      return { error: networkError };
    }
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('SignIn error:', error);
        return { error };
      }
      
      toast.success('Successfully signed in!');
      return { error: null };
    } catch (err) {
      console.error('Signin failed:', err);
      const networkError = {
        message: 'Network error. Please check your connection and try again.',
        name: 'NetworkError'
      } as AuthError;
      return { error: networkError };
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
      return { error: err as AuthError };
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
      return { error: err as AuthError };
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
