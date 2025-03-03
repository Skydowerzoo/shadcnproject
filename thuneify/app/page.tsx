"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useAuth } from "@/context/auth-context";
import axios from "axios";
import { BookOpen, DollarSign, LogIn, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

// Ajouter le type Expense
type Expense = {
  date: string;
  perso: number;
  commun: number;
};

export default function Home() {
  const auth = useAuth();
  const user = auth ? auth.user : null;
  const router = useRouter();

  // Ajouter l'état pour les données
  const [expensesData, setExpensesData] = useState<
    {
      name: string;
      total: number;
      perso: number;
      commun: number;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Ajouter useEffect pour charger les données
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get<Expense[]>(
          "http://localhost:5000/api/expenses"
        );
        const transformedData = transformExpensesData(response.data);
        setExpensesData(transformedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des dépenses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Fonction pour transformer les données
  const transformExpensesData = (data: Expense[]) => {
    const monthlyData = data.reduce((acc, expense) => {
      const date = new Date(expense.date);
      const month = date.toLocaleString("fr-FR", { month: "short" });

      if (!acc[month]) {
        acc[month] = {
          name: month,
          total: 0,
          perso: 0,
          commun: 0,
        };
      }

      acc[month].perso += Number(expense.perso || 0);
      acc[month].commun += Number(expense.commun || 0);
      acc[month].total = acc[month].perso + acc[month].commun;

      return acc;
    }, {} as Record<string, { name: string; total: number; perso: number; commun: number }>);

    return Object.values(monthlyData);
  };

  // Fonction pour calculer les statistiques
  const calculateStats = () => {
    if (expensesData.length === 0) return { total: 0, moyenne: 0, max: 0 };

    const currentMonth = new Date().toLocaleString("fr-FR", { month: "short" });
    const totalMois =
      expensesData.find((d) => d.name === currentMonth)?.total || 0;
    const moyenne =
      expensesData.reduce((acc, curr) => acc + curr.total, 0) /
      expensesData.length;
    const max = Math.max(...expensesData.map((d) => d.total));

    return {
      total: Math.round(totalMois),
      moyenne: Math.round(moyenne),
      max: Math.round(max),
    };
  };

  const stats = calculateStats();

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Bienvenue sur Thuneify {user ? `${user.firstname}` : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-lg">
            Gérez vos tâches quotidiennes et vos dépenses efficacement.
          </p>
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <Link href="/grocery">
                  <Button className="w-full flex flex-col items-center p-4 h-32">
                    <ShoppingCart className="h-8 w-8 mb-2" />
                    <span className="text-lg">Liste de courses</span>
                    <span className="text-sm text-gray-500">
                      Gérez vos achats
                    </span>
                  </Button>
                </Link>
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <Link href="/expenses">
                  <Button className="w-full flex flex-col items-center p-4 h-32">
                    <DollarSign className="h-8 w-8 mb-2" />
                    <span className="text-lg">Dépenses</span>
                    <span className="text-sm text-gray-500">
                      Suivez vos dépenses
                    </span>
                  </Button>
                </Link>
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <Link href="/account">
                  <Button className="w-full flex flex-col items-center p-4 h-32">
                    <User className="h-8 w-8 mb-2" />
                    <span className="text-lg">Compte</span>
                    <span className="text-sm text-gray-500">
                      Gérez votre compte
                    </span>
                  </Button>
                </Link>
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <Link href="/manga">
                  <Button className="w-full flex flex-col items-center p-4 h-32">
                    <BookOpen className="h-8 w-8 mb-2" />
                    <span className="text-lg">Manga</span>
                    <span className="text-sm text-gray-500">
                      Suivez vos mangas
                    </span>
                  </Button>
                </Link>
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <Link href="/login">
                  <Button className="w-full flex flex-col items-center p-4 h-32">
                    <LogIn className="h-8 w-8 mb-2" />
                    <span className="text-lg">Connexion</span>
                    <span className="text-sm text-gray-500">
                      Connectez-vous
                    </span>
                  </Button>
                </Link>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
      </Card>

      {/* Section Dashboard modifiée */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Aperçu des Dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-[350px]">
                Chargement...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={expensesData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar
                    dataKey="perso"
                    name="Personnel"
                    fill="#adfa1d"
                    stackId="a"
                  />
                  <Bar
                    dataKey="commun"
                    name="Commun"
                    fill="#2563eb"
                    stackId="a"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Résumé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total du mois</span>
                <span className="font-bold">{stats.total} €</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Moyenne mensuelle</span>
                <span className="font-bold">{stats.moyenne} €</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Plus grosse dépense</span>
                <span className="font-bold">{stats.max} €</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
