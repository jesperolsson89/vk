import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface User {
  name: string;
  givenName: string;
  surname: string;
  personalNumber: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    fetch(`${API_URL}/api/me`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => { if (data) setUser(data); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  async function logout() {
    await fetch(`${API_URL}/api/me/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
};