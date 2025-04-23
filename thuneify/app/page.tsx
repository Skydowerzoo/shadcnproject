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
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import { useAuth } from "@/context/auth-context";
import axios from "axios";
import { BookOpen, DollarSign, LogIn, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

type Expense = {
  date: string;
  perso: number;
  commun: number;
};

const chartConfig = {
  perso: {
    label: "Personnel",
    color: "hsl(var(--chart-1))",
  },
  commun: {
    label: "Commun",
    color: "hsl(var(--chart-2))",
  },
} as const;

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [expensesData, setExpensesData] = useState<
    { name: string; total: number; perso: number; commun: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router, mounted]);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      const fetchExpenses = async () => {
        try {
          const response = await axios.get<Expense[]>(
            "http://localhost:5000/api/expenses"
          );
          setExpensesData(transformExpensesData(response.data));
        } catch (error) {
          console.error("Erreur lors de la récupération des dépenses:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchExpenses();
    }
  }, [mounted, isAuthenticated]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  function transformExpensesData(data: Expense[]) {
    const monthlyData = data.reduce((acc, expense) => {
      const date = new Date(expense.date);
      const month = date.toLocaleString("fr-FR", { month: "long" });

      if (!acc[month]) {
        acc[month] = { name: month, total: 0, perso: 0, commun: 0 };
      }
      acc[month].perso += Number(expense.perso || 0);
      acc[month].commun += Number(expense.commun || 0);
      acc[month].total = acc[month].perso + acc[month].commun;

      return acc;
    }, {} as Record<string, { name: string; total: number; perso: number; commun: number }>);

    return Object.values(monthlyData);
  }

  function calculateStats() {
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
  }

  const stats = calculateStats();

  return (
    <div className="container mx-auto p-4">
      {/* En-tête */}
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

          {/* Nouvel encart pour infos rapides */}
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 mb-4">
            <div className="flex flex-col items-center p-4 bg-primary/10 rounded-md">
              <span className="font-bold text-primary">Total du mois</span>
              <span className="text-sm">{stats.total} €</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-primary/10 rounded-md">
              <span className="font-bold text-primary">Moyenne mensuelle</span>
              <span className="text-sm">{stats.moyenne} €</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-primary/10 rounded-md">
              <span className="font-bold text-primary">Max dépense</span>
              <span className="text-sm">{stats.max} €</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-primary/10 rounded-md">
              <span className="font-bold text-primary">État du compte</span>
              <span className="text-sm">{user ? "Actif" : "Invité"}</span>
            </div>
          </div>

          {/* Carousel existant */}
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

      {/* Aperçu dépenses + résumé existants */}
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
              <ChartContainer config={chartConfig}>
                <BarChart width={564} height={317} data={expensesData}>
                  <defs>
                    <linearGradient id="fillPerso" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--chart-1))"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--chart-1))"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillCommun" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--chart-2))"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--chart-2))"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis
                    tickFormatter={(value) => `${value} €`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (!active || !payload) return null;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Personnel
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {payload[0]?.value}€
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Commun
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {payload[1]?.value}€
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    dataKey="commun"
                    stackId="a"
                    fill="url(#fillCommun)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="perso"
                    stackId="a"
                    fill="url(#fillPerso)"
                    radius={[0, 0, 4, 4]}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </BarChart>
              </ChartContainer>
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

      {/* Section d'objectifs financiers */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Vos objectifs financiers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Suivez votre progression vers vos objectifs d'épargne.
          </p>

          <div className="mt-4 space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Vacances d'été</span>
                <span>1200€ / 2000€</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="bg-green-500 h-full rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
              <p className="text-xs text-right mt-1 text-muted-foreground">
                60% atteint
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Nouvel ordinateur</span>
                <span>750€ / 1500€</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: "50%" }}
                ></div>
              </div>
              <p className="text-xs text-right mt-1 text-muted-foreground">
                50% atteint
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Fond d'urgence</span>
                <span>3500€ / 5000€</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: "70%" }}
                ></div>
              </div>
              <p className="text-xs text-right mt-1 text-muted-foreground">
                70% atteint
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="outline" size="sm">
              <span className="mr-2">+</span> Ajouter un objectif
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
