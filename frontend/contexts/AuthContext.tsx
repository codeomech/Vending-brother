"use client";

import { AdminUser } from "@/interface";
import { loginAdmin } from "@/service/api";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AdminContextType {
  user: AdminUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored admin token on mount
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("admin_user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Verify token is still valid (you can add token expiration check here)
          setUser(parsedUser);
        } catch (error) {
          localStorage.removeItem("admin_user");
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Call your actual API - expects { token: "jwt-token-here" }
      const response = await loginAdmin(username, password);

      if (response.token) {
        const adminUser: AdminUser = {
          id: Date.now().toString(), // Generate a simple ID since API doesn't provide one
          username: username, // Use the entered username since API doesn't return user details
          token: response.token,
        };

        setUser(adminUser);
        localStorage.setItem("admin_user", JSON.stringify(adminUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_user");
    }
  };

  return (
    <AdminContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
