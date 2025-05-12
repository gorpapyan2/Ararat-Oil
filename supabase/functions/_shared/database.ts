import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import type { PostgrestError } from 'npm:@supabase/supabase-js@2.39.3';

// Supabase client with service role key (admin privileges)
export const createServiceClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase URL or service role key environment variables');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
};

// Supabase client with anon key (public privileges with RLS)
export const createAnonClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or anon key environment variables');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Helper function to handle and standardize errors
export const handleError = (error: PostgrestError | unknown): { error: string; details?: unknown } => {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return {
      error: String(error.message),
      details: error
    };
  }
  
  return {
    error: 'An unknown error occurred',
    details: error
  };
};

// Utility to check if the current request is authenticated
export const isAuthenticated = async (request: Request) => {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.replace('Bearer ', '');
  const supabase = createAnonClient();
  
  const { data, error } = await supabase.auth.getUser(token);
  
  if (error || !data.user) {
    return false;
  }
  
  return true;
};

// Extract user ID from JWT token
export const getUserFromRequest = async (request: Request) => {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.replace('Bearer ', '');
  const supabase = createAnonClient();
  
  const { data, error } = await supabase.auth.getUser(token);
  
  if (error || !data.user) {
    return null;
  }
  
  return data.user;
}; 