"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
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
import { useEffect, useState, FormEvent } from "react";

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

  // Fonction de recherche
  const handleSearch = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    setShowSearchResults(true);
    
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchTerm)}&limit=5`);
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
    window.open(`https://myanimelist.net/anime/${animeId}`, '_blank');
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

  return (
    <div className="container mx-auto py-8 px-4 space-y-10">
      {/* En-tête avec recherche */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h1 className="text-4xl font-bold">Univers Manga</h1>
        <div className="relative w-full md:w-1/3">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input 
                placeholder="Rechercher un anime..." 
                className="pl-10 pr-4" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2" 
                  onClick={() => setSearchTerm("")}
                >
                  <X size={16} className="text-gray-400" />
                </button>
              )}
            </div>
            <Button type="submit" className="ml-2" disabled={isSearching}>
              {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Rechercher"}
            </Button>
          </form>
          
          {/* Résultats de recherche */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border overflow-y-auto max-h-80">
              <div className="p-2 flex justify-between items-center border-b">
                <span className="text-sm font-medium">Résultats</span>
                <button onClick={() => setShowSearchResults(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={16} />
                </button>
              </div>
              <ul>
                {searchResults.map(anime => (
                  <li key={anime.mal_id} className="border-b last:border-0">
                    <button 
                      className="p-2 hover:bg-gray-100 w-full text-left flex items-start gap-2"
                      onClick={() => viewAnimeDetails(anime.mal_id)}
                    >
                      <div className="h-16 w-12 bg-gray-200 flex-shrink-0 rounded overflow-hidden">
                        <img 
                          src={anime.images.jpg.image_url} 
                          alt={anime.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-medium text-sm truncate">{anime.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {anime.synopsis || "Aucune description disponible"}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {showSearchResults && searchResults.length === 0 && !isSearching && (
            <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border p-4 text-center">
              <p>Aucun résultat trouvé pour "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-primary/10 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">
            {stats.animeCount.toLocaleString()}+
          </p>
          <p className="text-sm text-muted-foreground">Animes disponibles</p>
        </div>
        <div className="bg-primary/10 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">
            {stats.mangaCount.toLocaleString()}+
          </p>
          <p className="text-sm text-muted-foreground">Mangas référencés</p>
        </div>
        <div className="bg-primary/10 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">{stats.upcomingCount}</p>
          <p className="text-sm text-muted-foreground">Animes à venir</p>
        </div>
        <div className="bg-primary/10 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">{genres.length}</p>
          <p className="text-sm text-muted-foreground">Genres disponibles</p>
        </div>
      </div>

      {/* Catégories populaires */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Catégories populaires</h2>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <Badge
              key={genre.mal_id}
              variant="secondary"
              className="text-sm py-2 px-4 cursor-pointer hover:bg-secondary"
              onClick={() => filterByGenre(genre.mal_id, genre.name)}
            >
              {genre.name} ({genre.count})
            </Badge>
          ))}
        </div>
      </div>

      {/* Trending animes */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp size={20} />
          Tendances
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {trendingAnimes.map((anime) => (
            <Card
              key={anime.mal_id}
              className="overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div className="aspect-[2/3] relative">
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                  <Star
                    size={12}
                    className="mr-1 text-yellow-400"
                    fill="currentColor"
                  />{" "}
                  {anime.score}
                </div>
                <img
                  src={anime.images.jpg.image_url}
                  alt={anime.title}
                  className="w-full h-full object-cover absolute inset-0"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{anime.title}</h3>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <span className="text-xs text-muted-foreground">
                  ID: {anime.mal_id}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => viewAnimeDetails(anime.mal_id)}
                >
                  Voir plus
                </Button>
              </CardFooter>
            </Card>
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

      {/* Actualités dynamiques basées sur les animes à venir */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Clock size={20} />
          Dernières actualités
        </h2>
        <Card className="p-4">
          <div className="space-y-4">
            {trendingAnimes.slice(0, 2).map((anime) => (
              <div
                key={anime.mal_id}
                className="flex items-start gap-3 pb-3 border-b cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={() => viewAnimeDetails(anime.mal_id)}
              >
                <div className="bg-gray-100 h-14 w-14 flex-shrink-0 rounded relative overflow-hidden">
                  <img
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                </div>
                <div>
                  <h3 className="font-medium">
                    {anime.title} - Nouvelle saison annoncée
                  </h3>
                  <p className="text-sm text-gray-500">
                    Mis à jour récemment • Score: {anime.score}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={viewAllNews}>Voir toutes les actualités</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MangaHomePage;