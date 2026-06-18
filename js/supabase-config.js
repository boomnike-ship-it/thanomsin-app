// Supabase Configuration
// Replace these with your Supabase project credentials

const SUPABASE_URL = localStorage.getItem('SUPABASE_URL') || 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = localStorage.getItem('SUPABASE_ANON_KEY') || 'eyJhbGc...YOUR_KEY';

// Initialize Supabase Client
const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other scripts
window.supabase = supabase;
window.supabaseReady = true;
