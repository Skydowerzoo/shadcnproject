"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner"; // Import du toast de shadcn/ui

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Corrigé pour rendre le bouton de chargement fonctionnel
  const { login } = useAuth();
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation côté client
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      if (!email && emailRef.current) emailRef.current.focus();
      else if (!password && passwordRef.current) passwordRef.current.focus();
      return;
    }
    // Validation email simple
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Veuillez entrer un email valide.");
      if (emailRef.current) emailRef.current.focus();
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email,
          password,
        }
      );
      const { token, user } = response.data;
      login(token, user);
      toast("Connexion réussie", {
        description: `Bonjour ${user.firstname || "utilisateur"} !`,
      });
      router.push("/");
    } catch (error: any) {
      // Gestion précise des erreurs
      const apiMsg = error?.response?.data?.message;
      setError(apiMsg || "Email ou mot de passe incorrect");
      if (passwordRef.current) passwordRef.current.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} autoComplete="on">
            <div className="grid gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  ref={emailRef}
                  autoFocus
                  aria-invalid={!!error}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  ref={passwordRef}
                  aria-invalid={!!error}
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm" role="alert">
                  {error}
                </p>
              )}
            </div>
            <CardFooter className="flex flex-col space-y-4 items-center mt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center"
              >
                {isLoading && (
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                )}
                {isLoading ? "Connexion..." : "Connexion"}
              </Button>
              <div className="text-sm text-muted-foreground">
                Pas encore de compte ?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Créer un compte
                </Link>
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
