"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { clearStoredToken, getMe, getStoredToken, login, logout, storeToken } from "./api";
import type { User } from "./types";

type AuthStatus = "loading" | "authenticated" | "anonymous";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refresh = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setStatus("anonymous");
      return;
    }
    try {
      const me = await getMe();
      setUser(me);
      setStatus("authenticated");
    } catch {
      clearStoredToken();
      setUser(null);
      setStatus("anonymous");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const token = await login({ email, password });
      storeToken(token.access_token);
      const me = await getMe();
      setUser(me);
      setStatus("authenticated");
      return me;
    },
    [],
  );

  const signOut = useCallback(async () => {
    try {
      const token = getStoredToken();
      if (token) await logout();
    } catch {
      /* token may already be revoked */
    } finally {
      clearStoredToken();
      setUser(null);
      setStatus("anonymous");
    }
  }, []);

  const value = useMemo(
    () => ({ user, status, signIn, signOut, refresh }),
    [user, status, signIn, signOut, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}