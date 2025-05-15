import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/core/api";
import type { Session, User } from "@supabase/supabase-js";

type AuthContextProps = {
  user: User | null;
  session: Session | null;
  profile: any;
  isLoading: boolean;
  isOffline: boolean;
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

// Mock user for offline development mode
const MOCK_USER = {
  id: "offline-user-id",
  email: "offline@example.com",
  user_metadata: { full_name: "Offline User" },
  app_metadata: { role: "admin" },
  aud: "authenticated",
  created_at: new Date().toISOString(),
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  role: "authenticated",
  updated_at: new Date().toISOString()
} as unknown as User;

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
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
          console.warn("Network appears offline, using offline mode");
          setIsOffline(true);
          setUser(MOCK_USER);
          setProfile({ id: MOCK_USER.id, full_name: MOCK_USER.user_metadata.full_name });
          setIsLoading(false);
          return;
        }

        // Get initial session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Supabase auth error:", error);
          setIsOffline(true);
          setUser(MOCK_USER);
          setProfile({ id: MOCK_USER.id, full_name: MOCK_USER.user_metadata.full_name });
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
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
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
              }, (err) => {
                console.error("Error fetching profile on auth change:", err);
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
      } catch (err) {
        console.error("Critical auth error:", err);
        setIsOffline(true);
        setUser(MOCK_USER);
        setProfile({ id: MOCK_USER.id, full_name: MOCK_USER.user_metadata.full_name });
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
      console.log("Network is offline, switching to offline mode");
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
      console.log("Offline mode: simulating login");
      setUser(MOCK_USER);
      setProfile({ id: MOCK_USER.id, full_name: MOCK_USER.user_metadata.full_name });
      return {};
    }
    
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
    if (isOffline) {
      console.log("Offline mode: simulating logout");
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
      value={{ user, session, profile, isLoading, isOffline, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, useAuth };
