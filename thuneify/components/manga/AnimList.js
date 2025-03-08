"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Créer une instance axios personnalisée sans en-têtes d'autorisation
const jikanAPI = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
  headers: {
    'Content-Type': 'application/json'
  }
});

const AnimeList = () => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Add a slight delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Construire l'endpoint avec les critères de tri
        let endpoint = `/anime?page=${page}&limit=12&order_by=${sortBy}&sort=asc`;
        if (searchQuery) {
          endpoint += `&q=${searchQuery}`;
        }
        
        // Utiliser l'instance personnalisée au lieu d'axios global
        const response = await jikanAPI.get(endpoint);
        setAnimes(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("API Error:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [page, searchQuery, sortBy]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setPage(1);
  };

  if (loading && page === 1) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Liste d'Animes</h1>
          <Input 
            className="max-w-sm"
            placeholder="Rechercher un anime..." 
            disabled
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-video w-full">
                <Skeleton className="h-full w-full" />
              </div>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">Une erreur est survenue</h1>
        <p className="my-4">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Liste d'Animes</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <Input 
            className="max-w-sm"
            placeholder="Rechercher un anime..." 
            value={searchQuery}
            onChange={handleSearch}
          />
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularité</SelectItem>
              <SelectItem value="score">Note</SelectItem>
              <SelectItem value="title">Titre</SelectItem>
              <SelectItem value="rank">Classement</SelectItem>
              <SelectItem value="start_date">Date de sortie</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading && page > 1 && (
        <div className="text-center my-4">
          <p className="text-muted-foreground">Chargement d'autres animes...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {animes.map((anime) => (
          <Card key={anime.mal_id} className="overflow-hidden flex flex-col">
            <div className="relative">
              <img 
                src={anime.images.jpg.large_image_url || anime.images.jpg.image_url} 
                alt={anime.title} 
                className="w-full object-cover"
              />
              <Badge className="absolute top-2 right-2 bg-black/70">
                ★ {anime.score || 'N/D'}
              </Badge>
              {sortBy === 'popularity' && (
                <Badge className="absolute top-2 left-2 bg-purple-700">
                  #{anime.popularity || '?'}
                </Badge>
              )}
            </div>
            
            <CardHeader>
              <CardTitle className="line-clamp-1">{anime.title}</CardTitle>
              <CardDescription>
                {anime.type || 'TV'} • {anime.episodes || '?'} épisodes
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-grow">
              <div className="mb-4">
                <div className="text-sm flex flex-wrap gap-1 mb-2">
                  {anime.genres?.map(genre => (
                    <Badge key={genre.mal_id} variant="outline">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Statut :</span> {anime.status || 'Inconnu'}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Studios :</span> {anime.studios?.map(studio => studio.name).join(', ') || 'Inconnu'}
                </p>
              </div>
              <Separator className="my-2" />
              <ScrollArea className="h-28">
                <p className="text-sm">{anime.synopsis || 'Aucun synopsis disponible.'}</p>
              </ScrollArea>
            </CardContent>
            
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Voir les détails
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <Button 
          variant="outline"
          onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
          disabled={page === 1 || loading}
        >
          Précédent
        </Button>
        <span className="text-sm font-medium">Page {page}</span>
        <Button 
          onClick={() => setPage(prev => prev + 1)}
          disabled={loading}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};

export default AnimeList;