import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContextType, User } from "../types";
import { authService } from "../services/authService";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        const userData: User = {
          id: parseInt(payload.sub),
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          createdAt: payload.createdAt,
          roles: payload.role ? [payload.role] : payload.roles || ["User"],
        };

        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token decode hatası:", error);
        logout();
      }
    }
    setLoading(false);
  };
  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
