"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  firstname: string;
};

type AuthContextType = {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Vérifier l'authentification au chargement
  useEffect(() => {
    console.log("AuthProvider - Initialisation du contexte");

    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    console.log("Données trouvées:", {
      hasUserData: !!userData,
      hasToken: !!token,
    });

    if (userData && token) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log("Utilisateur restauré:", parsedUser);

        setUser(parsedUser);
        setIsAuthenticated(true);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        console.log("État mis à jour - Authentifié");
      } catch (error) {
        console.error(
          "Erreur lors de la restauration de l'authentification:",
          error
        );
      }
    } else {
      console.log("Aucune donnée d'authentification trouvée");
    }

    setIsLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
    );
  }
  return context;
};
