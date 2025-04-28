"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardContent,
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Créer une instance axios personnalisée
const jikanAPI = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
  headers: {
    'Content-Type': 'application/json'
  }
});

// IDs des mangas
const MANGA_IDS = {
  naruto: 11,
  onePiece: 13,
  fairyTail: 598,
  kurokoBasket: 11652,
  attaqueTitan: 23390,
  drStone: 103897
};

// Volumes prédéfinis pour chaque série
const PREDEFINED_VOLUMES = {
  naruto: 72,
  onePiece: 106,
  fairyTail: 63,
  kurokoBasket: 30,
  attaqueTitan: 34,
  drStone: 26
};

const MyMangaCollection = () => {
  const [mangaData, setMangaData] = useState({
    naruto: { info: null, volumes: [] },
    onePiece: { info: null, volumes: [] },
    fairyTail: { info: null, volumes: [] },
    kurokoBasket: { info: null, volumes: [] },
    attaqueTitan: { info: null, volumes: [] },
    drStone: { info: null, volumes: [] }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collection, setCollection] = useState(() => {
    try {
      // Récupérer la collection depuis localStorage s'il existe
      const savedCollection = localStorage.getItem('mangaCollection');
      const parsedCollection = savedCollection ? JSON.parse(savedCollection) : null;
      
      // Vérifier que la structure est correcte, sinon initialiser à nouveau
      const defaultCollection = {
        naruto: {},
        onePiece: {},
        fairyTail: {},
        kurokoBasket: {},
        attaqueTitan: {},
        drStone: {}
      };
      
      // Si parsedCollection existe et a les propriétés attendues, l'utiliser
      if (parsedCollection && 
          typeof parsedCollection === 'object' &&
          parsedCollection.naruto &&
          parsedCollection.onePiece &&
          parsedCollection.fairyTail &&
          parsedCollection.kurokoBasket &&
          parsedCollection.attaqueTitan &&
          parsedCollection.drStone) {
        return parsedCollection;
      }
      
      // Sinon, retourner la structure par défaut
      return defaultCollection;
    } catch (e) {
      // En cas d'erreur (JSON invalide par exemple), utiliser les valeurs par défaut
      console.error("Erreur lors du chargement de la collection:", e);
      return {
        naruto: {},
        onePiece: {},
        fairyTail: {},
        kurokoBasket: {},
        attaqueTitan: {},
        drStone: {}
      };
    }
  });

  // Charger les infos des mangas
  useEffect(() => {
    const fetchMangaInfo = async () => {
      try {
        setLoading(true);
        
        // Fonction pour récupérer les infos avec délai entre chaque requête
        const getMangaInfo = async (id, delay = 1000) => {
          const response = await jikanAPI.get(`/manga/${id}`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return response;
        };
        
        // Récupérer les infos de base pour chaque manga
        const narutoInfo = await getMangaInfo(MANGA_IDS.naruto);
        const onePieceInfo = await getMangaInfo(MANGA_IDS.onePiece);
        const fairyTailInfo = await getMangaInfo(MANGA_IDS.fairyTail);
        const kurokoInfo = await getMangaInfo(MANGA_IDS.kurokoBasket);
        const attackTitanInfo = await getMangaInfo(MANGA_IDS.attaqueTitan);
        const drStoneInfo = await getMangaInfo(MANGA_IDS.drStone);
        
        // Fonction pour créer un tableau de volumes pour une série
        const createVolumes = (mangaInfo, seriesName) => {
          // S'assurer que mangaInfo.data.data existe
          if (!mangaInfo || !mangaInfo.data || !mangaInfo.data.data) {
            console.error(`Données manquantes pour ${seriesName}`);
            return { volumes: [], count: 0 };
          }
          
          const volumesCount = Math.max(mangaInfo.data.data.volumes || 0, PREDEFINED_VOLUMES[seriesName]);
          const volumes = [];
          
          // S'assurer que collection[seriesName] existe
          const seriesCollection = collection[seriesName] || {};
          
          for (let i = 1; i <= volumesCount; i += 1) {
            volumes.push({ number: i, owned: !!seriesCollection[i] });
          }
          return { volumes, count: volumesCount };
        };
        
        // Créer les volumes pour chaque série
        const narutoData = createVolumes(narutoInfo, 'naruto');
        const onePieceData = createVolumes(onePieceInfo, 'onePiece');
        const fairyTailData = createVolumes(fairyTailInfo, 'fairyTail');
        const kurokoData = createVolumes(kurokoInfo, 'kurokoBasket');
        const attackTitanData = createVolumes(attackTitanInfo, 'attaqueTitan');
        const drStoneData = createVolumes(drStoneInfo, 'drStone');
        
        // Mettre à jour les données des mangas avec les vraies valeurs
        setMangaData({
          naruto: { 
            info: {...narutoInfo.data.data, volumes: narutoData.count},
            volumes: narutoData.volumes 
          },
          onePiece: { 
            info: {...onePieceInfo.data.data, volumes: onePieceData.count}, 
            volumes: onePieceData.volumes 
          },
          fairyTail: { 
            info: {...fairyTailInfo.data.data, volumes: fairyTailData.count}, 
            volumes: fairyTailData.volumes 
          },
          kurokoBasket: { 
            info: {...kurokoInfo.data.data, volumes: kurokoData.count}, 
            volumes: kurokoData.volumes 
          },
          attaqueTitan: { 
            info: {...attackTitanInfo.data.data, volumes: attackTitanData.count}, 
            volumes: attackTitanData.volumes 
          },
          drStone: { 
            info: {...drStoneInfo.data.data, volumes: drStoneData.count}, 
            volumes: drStoneData.volumes 
          }
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        setError(error);
        setLoading(false);
      }
    };
  
    fetchMangaInfo();
  }, []);

  // Sauvegarder la collection dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('mangaCollection', JSON.stringify(collection));
  }, [collection]);

  const handleCheckboxChange = (series, volumeNumber) => {
    setCollection(prev => {
      const newCollection = JSON.parse(JSON.stringify(prev)); // Copie profonde
      
      // S'assurer que newCollection[series] existe
      if (!newCollection[series]) {
        newCollection[series] = {};
      }
      
      if (newCollection[series][volumeNumber]) {
        delete newCollection[series][volumeNumber];
      } else {
        newCollection[series][volumeNumber] = true;
      }
      
      return newCollection;
    });
    
    // Mettre à jour l'état des volumes
    setMangaData(prev => {
      const newData = JSON.parse(JSON.stringify(prev)); // Copie profonde
      
      // Vérifier que les données existent
      if (newData[series] && newData[series].volumes) {
        newData[series].volumes = newData[series].volumes.map(vol => 
          vol.number === volumeNumber ? { ...vol, owned: !vol.owned } : vol
        );
      }
      
      return newData;
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Ma Collection de Mangas</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full mb-4" />
                <div className="grid grid-cols-5 gap-2">
                  {[...Array(10)].map((_, idx) => (
                    <Skeleton key={idx} className="h-10 w-full" />
                  ))}
                </div>
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
      <h1 className="text-3xl font-bold mb-2">Ma Collection de Mangas</h1>
      <p className="text-muted-foreground mb-6">Cochez les volumes que vous possédez pour suivre votre collection</p>
      
      <Tabs defaultValue="naruto">
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="naruto">Naruto</TabsTrigger>
          <TabsTrigger value="onePiece">One Piece</TabsTrigger>
          <TabsTrigger value="fairyTail">Fairy Tail</TabsTrigger>
          <TabsTrigger value="kurokoBasket">Kuroko no Basket</TabsTrigger>
          <TabsTrigger value="attaqueTitan">L'Attaque des Titans</TabsTrigger>
          <TabsTrigger value="drStone">Dr. Stone</TabsTrigger>
        </TabsList>
        
        <TabsContent value="naruto">
          <MangaSeriesCard
            manga={mangaData.naruto.info}
            volumes={mangaData.naruto.volumes}
            onCheckboxChange={(volumeNumber) => handleCheckboxChange('naruto', volumeNumber)}
          />
        </TabsContent>
        
        <TabsContent value="onePiece">
          <MangaSeriesCard
            manga={mangaData.onePiece.info}
            volumes={mangaData.onePiece.volumes}
            onCheckboxChange={(volumeNumber) => handleCheckboxChange('onePiece', volumeNumber)}
          />
        </TabsContent>
        
        <TabsContent value="fairyTail">
          <MangaSeriesCard
            manga={mangaData.fairyTail.info}
            volumes={mangaData.fairyTail.volumes}
            onCheckboxChange={(volumeNumber) => handleCheckboxChange('fairyTail', volumeNumber)}
          />
        </TabsContent>
        
        <TabsContent value="kurokoBasket">
          <MangaSeriesCard
            manga={mangaData.kurokoBasket.info}
            volumes={mangaData.kurokoBasket.volumes}
            onCheckboxChange={(volumeNumber) => handleCheckboxChange('kurokoBasket', volumeNumber)}
          />
        </TabsContent>
        
        <TabsContent value="attaqueTitan">
          <MangaSeriesCard
            manga={mangaData.attaqueTitan.info}
            volumes={mangaData.attaqueTitan.volumes}
            onCheckboxChange={(volumeNumber) => handleCheckboxChange('attaqueTitan', volumeNumber)}
          />
        </TabsContent>
        
        <TabsContent value="drStone">
          <MangaSeriesCard
            manga={mangaData.drStone.info}
            volumes={mangaData.drStone.volumes}
            onCheckboxChange={(volumeNumber) => handleCheckboxChange('drStone', volumeNumber)}
          />
        </TabsContent>
      </Tabs>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Statistiques de votre collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CollectionStats 
            title="Naruto" 
            volumes={mangaData.naruto.volumes} 
            totalVolumes={mangaData.naruto.info?.volumes || 0} 
          />
          <CollectionStats 
            title="One Piece" 
            volumes={mangaData.onePiece.volumes} 
            totalVolumes={mangaData.onePiece.info?.volumes || 0} 
          />
          <CollectionStats 
            title="Fairy Tail" 
            volumes={mangaData.fairyTail.volumes} 
            totalVolumes={mangaData.fairyTail.info?.volumes || 0} 
          />
          <CollectionStats 
            title="Kuroko no Basket" 
            volumes={mangaData.kurokoBasket.volumes} 
            totalVolumes={mangaData.kurokoBasket.info?.volumes || 0} 
          />
          <CollectionStats 
            title="L'Attaque des Titans" 
            volumes={mangaData.attaqueTitan.volumes} 
            totalVolumes={mangaData.attaqueTitan.info?.volumes || 0} 
          />
          <CollectionStats 
            title="Dr. Stone" 
            volumes={mangaData.drStone.volumes} 
            totalVolumes={mangaData.drStone.info?.volumes || 0} 
          />
        </div>
      </div>
    </div>
  );
};

// Composant pour afficher une carte de série manga
const MangaSeriesCard = ({ manga, volumes, onCheckboxChange }) => {
  const ownedVolumes = volumes.filter(vol => vol.owned).length;
  
  return (
    <Card className="mb-6">
      <div className="md:flex">
        <div className="md:w-1/3 p-4">
          <img 
            src={manga.images.jpg.large_image_url || manga.images.jpg.image_url}
            alt={manga.title}
            className="rounded-md w-full max-w-xs mx-auto mb-4"
          />
          <h2 className="text-xl font-bold">{manga.title}</h2>
          <p className="text-muted-foreground">{manga.authors?.[0]?.name || 'Auteur inconnu'}</p>
          
          <div className="mt-2 flex gap-2">
            <Badge>{manga.volumes || '?'} volumes</Badge>
            <Badge variant="outline">{manga.status}</Badge>
          </div>
          
          <p className="mt-4 text-sm">
            <span className="font-semibold">Progression : </span>
            {ownedVolumes} / {manga.volumes || '?'} volumes
            ({Math.round((ownedVolumes / (manga.volumes || volumes.length)) * 100)}%)
          </p>
        </div>
        
        <div className="md:w-2/3 p-4">
          <h3 className="font-semibold mb-4">Volumes :</h3>
          <ScrollArea className="h-[500px] pr-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {volumes.map((volume) => (
                <div key={volume.number} className={`p-2 border rounded-md ${volume.owned ? 'bg-primary/10 border-primary' : 'border-muted'}`}>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`${manga.title}-vol-${volume.number}`}
                      checked={volume.owned}
                      onCheckedChange={(_checked) => onCheckboxChange(volume.number)}
                    />
                    <Label 
                      htmlFor={`${manga.title}-vol-${volume.number}`} 
                      className="cursor-pointer w-full"
                      onClick={() => onCheckboxChange(volume.number)}
                    >
                      Volume {volume.number}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Card>
  );
};

// Composant pour afficher les statistiques de la collection
const CollectionStats = ({ title, volumes, totalVolumes }) => {
  const ownedCount = volumes.filter(vol => vol.owned).length;
  const percentOwned = Math.round((ownedCount / (totalVolumes || volumes.length)) * 100);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Progression de votre collection</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-2">
          <span>{ownedCount} / {totalVolumes || volumes.length} volumes</span>
          <span>{percentOwned}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary" 
            style={{ width: `${percentOwned}%` }}
          ></div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            {ownedCount === 0 ? (
              "Vous n'avez encore aucun volume de cette série."
            ) : ownedCount === totalVolumes ? (
              "Félicitations ! Vous avez la collection complète !"
            ) : (
              `Il vous manque ${totalVolumes - ownedCount} volumes pour compléter la collection.`
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyMangaCollection;