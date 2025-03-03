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
import { BookOpen, DollarSign, LogIn, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const auth = useAuth();
  const user = auth ? auth.user : null;
  const router = useRouter();

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
    </div>
  );
}
