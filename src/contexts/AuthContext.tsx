import { createContext, useContext, useState, ReactNode } from "react";
import { defaultMinistryAccounts, MinistryAccount } from "@/data/ministries";

export interface UserData {
  name: string;
  email: string;
  role: "citizen" | "ministry" | "admin";
  ministryId?: number;
  ministryName?: string;
  avatar?: string;
}

interface AuthContextType {
  currentUser: UserData | null;
  ministryAccounts: MinistryAccount[];
  login: (user: UserData) => void;
  loginAsMinistry: (email: string, password: string) => UserData | null;
  logout: () => void;
  addMinistryAccount: (account: MinistryAccount) => void;
  removeMinistryAccount: (id: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [ministryAccounts, setMinistryAccounts] = useState<MinistryAccount[]>(
    defaultMinistryAccounts
  );

  const login = (user: UserData) => {
    setCurrentUser(user);
  };

  const loginAsMinistry = (email: string, password: string): UserData | null => {
    const account = ministryAccounts.find(
      (a) => a.email === email && a.password === password
    );
    if (account) {
      const user: UserData = {
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
        ministryAccounts,
        login,
        loginAsMinistry,
        logout,
        addMinistryAccount,
        removeMinistryAccount,
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
