'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AccountForm from "@/components/account-form";

export default function AccountPage() {
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
      <AccountForm />
    </div>
  );
}