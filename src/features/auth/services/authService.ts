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
  async login({ email, password }: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.functions.invoke(
        `${EDGE_FUNCTION_URL}/login`,
        {
          method: "POST",
          body: { email, password },
        }
      );

      if (error) throw error;

      return {
        user: data.user,
        session: data.session,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
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

      if (error) throw error;

      return {
        user: data.user,
        session: data.session,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  },

  async logout(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.functions.invoke(
        `${EDGE_FUNCTION_URL}/logout`,
        {
          method: "POST",
        }
      );

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  },

  async getSessions(): Promise<{
    sessions: SessionDevice[];
    error: AuthError | null;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke(
        `${EDGE_FUNCTION_URL}/sessions`,
        {
          method: "GET",
        }
      );

      if (error) throw error;

      return {
        sessions: data.sessions,
        error: null,
      };
    } catch (error) {
      return {
        sessions: [],
        error: error as AuthError,
      };
    }
  },

  async deleteSession(sessionId: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.functions.invoke(
        `${EDGE_FUNCTION_URL}/sessions`,
        {
          method: "DELETE",
          body: { sessionId },
        }
      );

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  },

  async requestPasswordReset({
    email,
  }: PasswordResetRequest): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.functions.invoke(
        `${EDGE_FUNCTION_URL}/password-reset`,
        {
          method: "POST",
          body: { email },
        }
      );

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  },

  async updatePassword(password: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.functions.invoke(
        `${EDGE_FUNCTION_URL}/update-password`,
        {
          method: "POST",
          body: { password },
        }
      );

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  },
};
