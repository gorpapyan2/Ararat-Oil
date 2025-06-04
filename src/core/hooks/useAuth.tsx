import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/core/api";
import type { Session, User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  email?: string | null;
  role?: string | null;
  updated_at?: string | null;
  username?: string | null;
  [key: string]: unknown;
}

type AuthContextProps = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isOffline: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    fullName?: string
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  // Check if we're online
  const checkOnlineStatus = () => {
    return window.navigator.onLine;
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if we're online
        if (!checkOnlineStatus()) {
          console.warn("Network appears offline. Authentication required when online.");
          setIsOffline(true);
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          return;
        }

        // Get initial session
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Supabase auth error:", error);
          setIsOffline(false);
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          return;
        }

        const initialSession = data.session;
        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          try {
            const { data: profileData } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", initialSession.user.id)
              .single();

            setProfile(profileData);
          } catch (profileError) {
            console.error("Error fetching user profile:", profileError);
          }
        }

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
              .then(
                ({ data }) => {
                  setProfile(data);
                },
                (err) => {
                  console.error("Error fetching profile on auth change:", err);
                }
              );
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
      } catch (err) {
        console.error("Critical auth error:", err);
        setIsOffline(false);
        setUser(null);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for online/offline events
    const handleOnline = () => {
      console.log("Network is online, refreshing auth");
      setIsOffline(false);
      window.location.reload(); // Refresh to re-establish connection
    };

    const handleOffline = () => {
      console.log("Network is offline");
      setIsOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (isOffline) {
      return { error: "Cannot sign in while offline. Please check your internet connection." };
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error: error.message };
      return {};
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred during sign in";
      return { error: errorMessage };
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
    if (isOffline) {
      console.log("Offline mode: Cannot sign out properly");
      setUser(null);
      setSession(null);
      setProfile(null);
      window.location.href = "/auth";
      return;
    }

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
      value={{
        user,
        session,
        profile,
        isLoading,
        isOffline,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, useAuth };
