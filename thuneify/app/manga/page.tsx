"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  List,
  Loader2,
  Search,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

// Types pour les données Jikan
interface AnimeItem {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  score: number;
  synopsis?: string;
}

interface GenreItem {
  mal_id: number;
  name: string;
  count: number;
}

const MangaHomePage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<AnimeItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [trendingAnimes, setTrendingAnimes] = useState<AnimeItem[]>([]);
  const [genres, setGenres] = useState<GenreItem[]>([]);
  const [stats, setStats] = useState({
    animeCount: 0,
    mangaCount: 0,
    upcomingCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Nouveaux états pour le carrousel
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Fonction de recherche
  const handleSearch = async (e?: FormEvent) => {
    if (e) e.preventDefault();

    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setShowSearchResults(true);

    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
          searchTerm
        )}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data.data || []);
    } catch (err) {
      console.error("Erreur lors de la recherche:", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Fonction pour voir les détails d'un anime
  const viewAnimeDetails = (animeId: number) => {
    // Dans une application réelle, vous navigueriez vers une page de détails
    // router.push(`/manga/anime/${animeId}`);
    // Pour l'instant, ouvrons simplement la page MAL dans un nouvel onglet
    window.open(`https://myanimelist.net/anime/${animeId}`, "_blank");
  };

  // Fonction pour filtrer par genre
  const filterByGenre = (genreId: number, genreName: string) => {
    console.log(`Filtrer par genre: ${genreName} (ID: ${genreId})`);
    // Implémentation: naviguer vers une page de résultats filtrés ou filtrer sur place
    router.push(`/manga/liste-anime?genre=${genreId}`);
  };

  // Fonction pour voir toutes les actualités
  const viewAllNews = () => {
    console.log("Voir toutes les actualités");
    // Navigation vers une page d'actualités
    router.push(`/manga/actualites`);
  };

  useEffect(() => {
    // Fonction pour charger les données depuis l'API Jikan
    const fetchData = async () => {
      try {
        setLoading(true);

        // Récupérer les animes tendances
        const animesResponse = await fetch(
          "https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=6"
        );
        const animesData = await animesResponse.json();

        // Attendre 1 seconde pour respecter la limite de rate de l'API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Récupérer les genres
        const genresResponse = await fetch(
          "https://api.jikan.moe/v4/genres/anime"
        );
        const genresData = await genresResponse.json();

        // Attendre 1 seconde pour respecter la limite de rate de l'API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Récupérer les statistiques
        const statsResponse = await fetch("https://api.jikan.moe/v4/anime");
        const upcomingResponse = await fetch(
          "https://api.jikan.moe/v4/seasons/upcoming"
        );

        const statsData = await statsResponse.json();
        const upcomingData = await upcomingResponse.json();

        // Mettre à jour les états avec les données récupérées
        setTrendingAnimes(animesData.data || []);
        setGenres(genresData.data?.slice(0, 8) || []);
        setStats({
          animeCount: statsData.pagination?.items?.total || 0,
          mangaCount: Math.floor(Math.random() * 5000) + 5000, // Estimation pour l'exemple
          upcomingCount: upcomingData.pagination?.items?.total || 0,
        });
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError(
          "Impossible de charger les données. Veuillez réessayer plus tard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Configure le défilement automatique
  useEffect(() => {
    if (trendingAnimes.length <= 3) return; // Ne pas démarrer l'autoplay s'il n'y a pas assez d'animes

    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        nextSlide();
      }, 5000); // Change de slide toutes les 5 secondes
    };

    startAutoplay();

    // Nettoyage du timer quand le composant est démonté
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [trendingAnimes.length]);

  // Afficher un état de chargement pendant la récupération des données
  if (loading) {
    return (
      <div className="container mx-auto py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">
          Chargement des données manga...
        </p>
      </div>
    );
  }

  // Afficher un message d'erreur si nécessaire
  if (error) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Erreur</h2>
        <p className="mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Réessayer</Button>
      </div>
    );
  }

  // Fonctions pour le carrousel
  const nextSlide = () => {
    if (!trendingAnimes.length) return;

    setCurrentSlide((prevSlide) => {
      const nextSlide = (prevSlide + 1) % trendingAnimes.length;
      return nextSlide;
    });
  };

  const prevSlide = () => {
    if (!trendingAnimes.length) return;

    setCurrentSlide((prevSlide) => {
      const nextSlide =
        (prevSlide - 1 + trendingAnimes.length) % trendingAnimes.length;
      return nextSlide;
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-10">
      {/* En-tête avec recherche */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h1 className="text-4xl font-bold">Univers Manga</h1>
      </div>

      {/* Trending animes - transformé en carrousel */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp size={20} />
            Tendances
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={prevSlide}
              aria-label="Slide précédent"
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={nextSlide}
              aria-label="Slide suivant"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>

        {/* Carrousel container - version très compacte */}
        <div className="relative overflow-hidden">
          <div
            ref={carouselRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * 16.666}%)`,
              width: `${
                trendingAnimes.length > 6 ? trendingAnimes.length * 16.666 : 100
              }%`,
            }}
          >
            {trendingAnimes.map((anime) => (
              <div
                key={anime.mal_id}
                className="px-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 flex-shrink-0"
              >
                <div
                  className="cursor-pointer h-full overflow-hidden rounded-md shadow-sm hover:shadow-md transition-all"
                  onClick={() => viewAnimeDetails(anime.mal_id)}
                >
                  <div className="aspect-[2/3] relative">
                    <div className="absolute top-1 right-1 bg-black/70 text-white px-1 py-0.5 rounded text-[8px] flex items-center">
                      <Star
                        size={8}
                        className="mr-0.5 text-yellow-400"
                        fill="currentColor"
                      />
                      {anime.score}
                    </div>
                    <img
                      src={anime.images.jpg.image_url}
                      alt={anime.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-1 bg-white">
                    <p className="text-xs font-medium truncate">
                      {anime.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicateurs de slide (optionnel) */}
        <div className="flex justify-center mt-4 gap-1">
          {trendingAnimes.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index ? "bg-primary w-4" : "bg-gray-300"
              }`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Sections principales */}
      <h2 className="text-2xl font-bold mb-4">Explorer</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/manga/my-anime" className="group">
          <Card className="p-6 border hover:border-primary transition-all duration-300">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Mes Animes</h2>
                <p className="text-gray-600 mb-4">
                  Accédez à votre collection personnelle d'animes, suivez votre
                  progression et recevez des recommandations basées sur vos
                  préférences.
                </p>
                <Button className="w-full">Voir ma collection</Button>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/manga/liste-anime" className="group">
          <Card className="p-6 border hover:border-primary transition-all duration-300">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors">
                <List className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Liste d'Animes</h2>
                <p className="text-gray-600 mb-4">
                  Explorez notre catalogue complet avec plus de{" "}
                  {stats.animeCount.toLocaleString()} titres, filtrez par genre,
                  année de sortie ou popularité.
                </p>
                <Button className="w-full">Explorer le catalogue</Button>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default MangaHomePage;
