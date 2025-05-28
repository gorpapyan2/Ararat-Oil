import type { User, Session } from "@supabase/supabase-js";

export interface AuthUser extends User {
  role?: string;
  permissions?: string[];
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: AuthError | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  fullName: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface SessionDevice {
  id: string;
  user_id: string;
  created_at: string;
  last_active: string;
  user_agent: string;
  ip_address: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export type AuthRole = "admin" | "manager" | "employee" | "user";

export interface AuthConfig {
  requiredRole?: string;
  redirectTo?: string;
}
