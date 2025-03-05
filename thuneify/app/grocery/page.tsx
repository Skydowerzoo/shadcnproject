"use client";

import { GroceryList } from "@/components/grocery/grocery-liste";
import { useAuth } from "@/context/auth-context";

export default function Expenses() {
    const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
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
