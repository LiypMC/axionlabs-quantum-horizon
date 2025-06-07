// Manual auth implementation using fetch as fallback
const SUPABASE_URL = "https://ikzgrktaaawjiaqnxwfx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlremdya3RhYWF3amlhcW54d2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4OTA4NzksImV4cCI6MjA2MjQ2Njg3OX0.uQXjaE2ihXCJkSZWRcvm0hm3xltGxXCT4upzRMRQHr0";

export const manualSignUp = async (email: string, password: string) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    console.log('Manual signup response status:', response.status);
    const data = await response.json();
    console.log('Manual signup response data:', data);
    
    if (!response.ok) {
      return { error: data.error || { message: data.msg || 'Signup failed' } };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Manual signup error:', error);
    return { error: { message: 'Network error during signup' } };
  }
};

export const manualSignIn = async (email: string, password: string) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { error: data.error || { message: data.msg || 'Signin failed' } };
    }

    // Store tokens in localStorage
    if (data.access_token) {
      localStorage.setItem('supabase.auth.token', JSON.stringify(data));
    }

    return { data, error: null };
  } catch (error) {
    console.error('Manual signin error:', error);
    return { error: { message: 'Network error during signin' } };
  }
};