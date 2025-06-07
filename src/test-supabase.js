// Simple test to check Supabase connectivity
const SUPABASE_URL = "https://ikzgrktaaawjiaqnxwfx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlremdya3RhYWF3amlhcW54d2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4OTA4NzksImV4cCI6MjA2MjQ2Njg3OX0.uQXjaE2ihXCJkSZWRcvm0hm3xltGxXCT4upzRMRQHr0";

// Test basic fetch to Supabase
console.log('Testing basic fetch to Supabase...');

fetch(`${SUPABASE_URL}/rest/v1/`, {
  method: 'GET',
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Fetch response status:', response.status);
  console.log('Fetch response ok:', response.ok);
  return response.text();
})
.then(data => {
  console.log('Fetch response data:', data);
})
.catch(error => {
  console.error('Fetch error:', error);
});