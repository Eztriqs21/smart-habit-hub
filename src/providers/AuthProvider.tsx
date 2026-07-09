"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { type User } from "@/types";
import type { Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);

      if (currentSession?.user) {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", currentSession.user.id)
          .single();

        if (data) {
          setUser({
            id: data.id,
            email: currentSession.user.email || "",
            display_name: data.display_name,
            avatar_url: data.avatar_url,
            onboarding_completed: data.onboarding_completed,
            preferences: data.preferences || { theme: "system", focus_areas: [], time_preference: "morning" },
            created_at: data.created_at,
            updated_at: data.updated_at,
          });
        } else {
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email || "",
            display_name: null,
            avatar_url: null,
            onboarding_completed: false,
            preferences: { theme: "system", focus_areas: [], time_preference: "morning" },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }
      setIsLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          const { data } = await supabase
            .from("users")
            .select("*")
            .eq("id", newSession.user.id)
            .single();

          if (data) {
            setUser({
              id: data.id,
              email: newSession.user.email || "",
              display_name: data.display_name,
              avatar_url: data.avatar_url,
              onboarding_completed: data.onboarding_completed,
              preferences: data.preferences || { theme: "system", focus_areas: [], time_preference: "morning" },
              created_at: data.created_at,
              updated_at: data.updated_at,
            });
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    window.location.href = "/auth/signin";
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
