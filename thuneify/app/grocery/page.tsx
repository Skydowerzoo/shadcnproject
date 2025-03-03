"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GroceryList } from "@/components/grocery/grocery-liste";

export default function Expenses() {
  const auth = useAuth() as { user: unknown } | null;
  const user = auth ? auth.user : null;
  const router = useRouter();



  return (

        <GroceryList />

  );
}
