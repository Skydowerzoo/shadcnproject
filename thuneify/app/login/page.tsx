"use client";

import Login from "@/components/login/login";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const auth = useAuth() as { user: unknown } | null;
  const user = auth ? auth.user : null;
  const router = useRouter();


  return (
    <div>
      <Login />
    </div>
  );
}
