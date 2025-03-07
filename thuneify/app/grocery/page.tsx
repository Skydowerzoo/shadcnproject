"use client";

import { GroceryList } from "@/components/grocery/grocery-liste";
import { useAuth } from "@/context/auth-context";
import AuthGuard from "@/context/auth-guard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GroceryPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Si on est en train de charger, on ne fait rien encore
    if (isLoading) return;
    
    // Si on n'est pas authentifié, on redirige
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    
    // Si on arrive ici, c'est qu'on est authentifié et chargé
    setIsReady(true);
  }, [isAuthenticated, isLoading, router]);

  // Un état de chargement silencieux sans affichage inutile
  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 rounded-full border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (

      <GroceryList />

  );
}
