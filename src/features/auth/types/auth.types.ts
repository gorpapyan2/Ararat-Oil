
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  fullName?: string;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  permissions?: string[];
}

export interface AuthUser extends User {}

export interface AuthState {
  user: SupabaseUser | null;
  session: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
}

export interface AuthError extends Error {}

export interface AuthResponse {
  user: SupabaseUser | null;
  session: any | null;
  error: Error | null;
}

export interface PasswordResetRequest {
  email: string;
}

export interface SessionDevice {
  id: string;
  browser?: string;
  os?: string;
  lastAccessed: Date;
}

export interface AuthConfig {
  requiredRole?: AuthRole;
  redirectTo?: string;
  permissions?: string[];
}

export type AuthRole = 'admin' | 'employee' | 'manager' | 'user';
