'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: { id: string; name: string; email: string } | null;
  setUser: React.Dispatch<React.SetStateAction<{ id: string; name: string; email: string } | null>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

import { ReactNode } from 'react';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/auth', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error checking auth:', error);
          localStorage.removeItem('token');
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);