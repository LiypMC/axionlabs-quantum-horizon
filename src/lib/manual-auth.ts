import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/integrations/supabase/client';

export const manualSignUp = async (email: string, password: string) => {
  try {
    // Try with URL param first
    const urlWithApiKey = `${SUPABASE_URL}/auth/v1/signup?apikey=${encodeURIComponent(SUPABASE_ANON_KEY)}`;
    
    const response = await fetch(urlWithApiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-Supabase-Api-Version': '2024-01-01',
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
    // Try with URL param first
    const urlWithApiKey = `${SUPABASE_URL}/auth/v1/token?grant_type=password&apikey=${encodeURIComponent(SUPABASE_ANON_KEY)}`;
    
    const response = await fetch(urlWithApiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-Supabase-Api-Version': '2024-01-01',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    console.log('Manual signin response status:', response.status);
    const data = await response.json();
    console.log('Manual signin response data:', data);
    
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