import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { defaultMinistryAccounts, MinistryAccount } from "@/data/ministries";
import * as api from "@/lib/api";

const TOKEN_KEY = "civic_token";

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: "citizen" | "ministry" | "admin";
  ministryId?: number;
  ministryName?: string;
  avatar?: string;
}

function mapRole(role: string): "citizen" | "ministry" | "admin" {
  if (role === "responsable_ministere") return "ministry";
  if (role === "admin") return "admin";
  return "citizen";
}

function mapUser(u: api.AuthUser): UserData {
  return {
    id: u.id,
    name: u.nom,
    email: u.email,
    role: mapRole(u.role),
  };
}

interface AuthContextType {
  currentUser: UserData | null;
  token: string | null;
  ministryAccounts: MinistryAccount[];
  login: (user: UserData) => void;
  setAuthFromApi: (user: api.AuthUser, token: string) => void;
  loginAsMinistry: (email: string, password: string) => UserData | null;
  logout: () => void;
  addMinistryAccount: (account: MinistryAccount) => void;
  removeMinistryAccount: (id: number) => void;
  authLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [authLoading, setAuthLoading] = useState(!!localStorage.getItem(TOKEN_KEY));
  const [ministryAccounts, setMinistryAccounts] = useState<MinistryAccount[]>(
    defaultMinistryAccounts
  );

  useEffect(() => {
    if (!token) {
      setAuthLoading(false);
      return;
    }
    api
      .getMe(token)
      .then(({ user }) => {
        setCurrentUser(mapUser(user));
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      })
      .finally(() => setAuthLoading(false));
  }, [token]);

  const setAuthFromApi = (user: api.AuthUser, newToken: string) => {
    setCurrentUser(mapUser(user));
    setToken(newToken);
    localStorage.setItem(TOKEN_KEY, newToken);
  };

  const login = (user: UserData) => {
    setCurrentUser(user);
  };

  const loginAsMinistry = (email: string, password: string): UserData | null => {
    const account = ministryAccounts.find(
      (a) => a.email === email && a.password === password
    );
    if (account) {
      const user: UserData = {
        id: String(account.id),
        name: account.fullName,
        email: account.email,
        role: "ministry",
        ministryId: account.ministryId,
        ministryName: account.ministry,
      };
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
  };

  const addMinistryAccount = (account: MinistryAccount) => {
    setMinistryAccounts((prev) => [...prev, account]);
  };

  const removeMinistryAccount = (id: number) => {
    setMinistryAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        ministryAccounts,
        login,
        setAuthFromApi,
        loginAsMinistry,
        logout,
        addMinistryAccount,
        removeMinistryAccount,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
