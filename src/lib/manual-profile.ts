import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/integrations/supabase/client';

export const manualCreateProfile = async (profileData: {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  profile_completed: boolean;
  updated_at: string;
}) => {
  try {
    const urlWithApiKey = `${SUPABASE_URL}/rest/v1/profiles?apikey=${encodeURIComponent(SUPABASE_ANON_KEY)}`;
    
    const response = await fetch(urlWithApiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-Supabase-Api-Version': '2024-01-01',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(profileData),
    });

    console.log('Manual profile creation response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Manual profile creation error:', errorData);
      return { error: errorData.error || { message: 'Profile creation failed' } };
    }

    console.log('Manual profile creation successful');
    return { error: null };
  } catch (error) {
    console.error('Manual profile creation network error:', error);
    return { error: { message: 'Network error during profile creation' } };
  }
};

export const manualCheckProfile = async (userId: string) => {
  try {
    const urlWithApiKey = `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=*&apikey=${encodeURIComponent(SUPABASE_ANON_KEY)}`;
    
    const response = await fetch(urlWithApiKey, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-Supabase-Api-Version': '2024-01-01',
      },
    });

    console.log('Manual profile check response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Manual profile check error:', errorData);
      return { data: null, error: errorData.error || { message: 'Profile check failed' } };
    }

    const data = await response.json();
    console.log('Manual profile check result:', data);
    
    return { 
      data: data.length > 0 ? data[0] : null, 
      error: data.length === 0 ? { code: 'PGRST116', message: 'Profile not found' } : null 
    };
  } catch (error) {
    console.error('Manual profile check network error:', error);
    return { data: null, error: { message: 'Network error during profile check' } };
  }
};