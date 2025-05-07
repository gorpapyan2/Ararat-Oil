import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/services/supabase";
import type { Session, User } from "@supabase/supabase-js";

type AuthContextProps = {
  user: User | null;
  session: Session | null;
  profile: any;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    fullName?: string,
  ) => Promise<{ error?: string }>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      if (initialSession?.user) {
        supabase
          .from("profiles")
          .select("*")
          .eq("id", initialSession.user.id)
          .single()
          .then(({ data }) => {
            setProfile(data);
          });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        supabase
          .from("profiles")
          .select("*")
          .eq("id", currentSession.user.id)
          .single()
          .then(({ data }) => {
            setProfile(data);
          });
      } else {
        setProfile(null);
        if (event === "SIGNED_OUT") {
          window.location.href = "/auth";
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error: error.message };
      return {};
    } catch (error: any) {
      return { error: error.message || "An error occurred during sign in" };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    // Return a message indicating signup is disabled
    return {
      error:
        "Signup is disabled. Please contact your administrator for account access.",
    };
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      window.location.href = "/auth";
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, session, profile, isLoading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, useAuth };
