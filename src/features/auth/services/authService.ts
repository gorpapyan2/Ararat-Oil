import { supabase } from "@/services/supabase";
import type {
  AuthResponse,
  AuthError,
  LoginCredentials,
  RegisterCredentials,
  PasswordResetRequest,
  SessionDevice,
} from "../types/auth.types";

const EDGE_FUNCTION_URL = "/functions/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      return {
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      return { error: error as Error };
    }
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.fullName,
          },
        },
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      return {
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      return { error: error as Error };
    }
  },

  async logout(): Promise<{ error?: Error }> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { error: new Error(error.message) };
      }

      return {};
    } catch (error) {
      return { error: error as Error };
    }
  },

  async getSessions(): Promise<{ sessions?: any[]; error?: Error }> {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        return { error: new Error(error.message) };
      }

      return { sessions: data.session ? [data.session] : [] };
    } catch (error) {
      return { error: error as Error };
    }
  },

  async deleteSession(sessionId: string): Promise<{ error?: Error }> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { error: new Error(error.message) };
      }

      return {};
    } catch (error) {
      return { error: error as Error };
    }
  },

  async requestPasswordReset(
    request: PasswordResetRequest
  ): Promise<{ error?: Error }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        request.email,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );

      if (error) {
        return { error: new Error(error.message) };
      }

      return {};
    } catch (error) {
      return { error: error as Error };
    }
  },

  async updatePassword(password: string): Promise<{ error?: Error }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      return {};
    } catch (error) {
      return { error: error as Error };
    }
  },
};
