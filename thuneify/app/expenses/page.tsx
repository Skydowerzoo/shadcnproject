'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Dashboard } from "@/components/expenses/expenses-dashboard";

export default function Expenses() {
  const auth = useAuth() as { user: unknown } | null;
  const user = auth ? auth.user : null;
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Dashboard />
    </div>
  );
}