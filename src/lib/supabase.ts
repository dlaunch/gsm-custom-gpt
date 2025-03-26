import { createClient } from '@supabase/supabase-js';

// Get environment variables or use fallbacks
const getEnvVariable = (key: string, defaultValue: string = ''): string => {
  // For Vite, environment variables are prefixed with VITE_
  const envValue = import.meta.env[`VITE_${key}`];
  return envValue !== undefined ? envValue : defaultValue;
};

const supabaseUrl = getEnvVariable('SUPABASE_URL');
// Don't use a default value for the key to avoid hardcoding it
const supabaseKey = getEnvVariable('SUPABASE_KEY');

if (!supabaseKey) {
  console.warn('Supabase key is not defined. Authentication and database operations will not work.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export type UserMessage = {
  id: string;
  session_id: string;
  message: {
    content: string;
    type: 'human' | 'ai';
  };
};

export type ConversationPreview = {
  session_id: string;
  title: string;
};
