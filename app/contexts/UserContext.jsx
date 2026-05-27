"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hydrate user state from the current session on initial mount.
    const getSessionAndUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser ?? null);
      setLoading(false);
    };

    getSessionAndUser();

    // Keep user state in sync with auth events — SIGNED_IN, SIGNED_OUT,
    // TOKEN_REFRESHED, and PASSWORD_RECOVERY all flow through here. This is
    // especially important for cookie-based sessions set server-side (login
    // route) and for Google OAuth redirects.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
