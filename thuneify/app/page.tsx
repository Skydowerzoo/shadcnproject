'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, DollarSign, User, BookOpen, LogIn } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const auth = useAuth();
  const user = auth ? auth.user : null;
  const router = useRouter();

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Bienvenue sur Thuneify</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-lg">Gérez vos tâches quotidiennes et vos dépenses efficacement.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/grocery">
              <Button className="w-full flex flex-col items-center p-4 h-32">
                <ShoppingCart className="h-8 w-8 mb-2" />
                <span className="text-lg">Liste de courses</span>
                <span className="text-sm text-gray-500">Gérez vos achats</span>
              </Button>
            </Link>
            <Link href="/expenses">
              <Button className="w-full flex flex-col items-center p-4 h-32">
                <DollarSign className="h-8 w-8 mb-2" />
                <span className="text-lg">Dépenses</span>
                <span className="text-sm text-gray-500">Suivez vos dépenses</span>
              </Button>
            </Link>
            <Link href="/account">
              <Button className="w-full flex flex-col items-center p-4 h-32">
                <User className="h-8 w-8 mb-2" />
                <span className="text-lg">Compte</span>
                <span className="text-sm text-gray-500">Gérez votre compte</span>
              </Button>
            </Link>
            <Link href="/manga">
              <Button className="w-full flex flex-col items-center p-4 h-32">
                <BookOpen className="h-8 w-8 mb-2" />
                <span className="text-lg">Manga</span>
                <span className="text-sm text-gray-500">Suivez vos mangas</span>
              </Button>
            </Link>
            <Link href="/login">
              <Button className="w-full flex flex-col items-center p-4 h-32">
                <LogIn className="h-8 w-8 mb-2" />
                <span className="text-lg">Connexion</span>
                <span className="text-sm text-gray-500">Connectez-vous</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}