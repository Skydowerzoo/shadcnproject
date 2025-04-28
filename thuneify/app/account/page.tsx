"use client";

import AccountForm from "@/components/account-form";
import { useAuth } from "@/context/auth-context";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountPage() {
  useAuthRedirect();

  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 rounded-full border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <AccountForm />
    </div>
  );
}
