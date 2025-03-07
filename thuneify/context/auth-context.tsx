"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  id: string;
  email: string;
  firstname: string;
};

// Modifions d'abord le type pour inclure isLoading
type AuthContextType = {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean; // Ajouté
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

  const login = useCallback((token: string, userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);

    // Stocker dans localStorage pour usage côté client
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);

    // Stocker aussi dans un cookie pour le middleware
    document.cookie = `auth-token=${token}; path=/; max-age=${
      60 * 60 * 24 * 7
    }; SameSite=Strict`;

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);

    // Supprimer du localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Supprimer le cookie
    document.cookie =
      "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";

    delete axios.defaults.headers.common["Authorization"];
    router.push("/login");
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, isLoading }}
    >
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
