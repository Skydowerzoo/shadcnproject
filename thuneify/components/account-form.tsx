"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import axios from "axios";
import { Loader2, PencilIcon, SaveIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";


export default function AccountForm() {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    date: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    bio: "",
  });

  // Initialisation avec les données utilisateur lorsqu'elles sont disponibles
  useEffect(() => {
    if (user) {
      setUserData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        date: user.date || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "", // Ne jamais afficher le mot de passe existant
        address: user.address || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user || !user.id) return;

    try {
      setIsLoading(true);
      console.log("Données à envoyer:", userData);
      
      const dataToSubmit = {
        ...userData,
        password: userData.password ? userData.password : undefined,
      };

      // CORRECTION: L'URL d'API est /api/users/:id
      const response = await axios.put(
        `http://localhost:5000/api/users/${user.id}`,
        dataToSubmit
      );
      
      console.log("Réponse:", response.data);
      setIsEditing(false);
      
      

      // Actualiser les données utilisateur dans le contexte
      // Idéalement, ajoutez une fonction refreshUser dans votre contexte
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Restaurer les données originales
    if (user) {
      setUserData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        date: user.date || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        address: user.address || "",
        bio: user.bio || "",
      });
    }
    setIsEditing(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <p>Veuillez vous connecter pour voir votre compte</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Formulaire du compte</CardTitle>
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <PencilIcon className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          ) : (
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    <XIcon className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Les modifications ne sont pas encore enregistrées !
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      Continuer l&apos;édition
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancel}>
                      Annuler les modifications
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <SaveIcon className="w-4 h-4 mr-2" />
                )}
                Sauvegarder
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstname">Prénom</Label>
              <Input
                id="firstname"
                value={userData.firstname}
                onChange={(e) =>
                  setUserData({ ...userData, firstname: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname">Nom</Label>
              <Input
                id="lastname"
                value={userData.lastname}
                onChange={(e) =>
                  setUserData({ ...userData, lastname: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date de naissance</Label>
            <Input
              id="date"
              type="date"
              value={userData.date}
              onChange={(e) =>
                setUserData({ ...userData, date: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={userData.phone}
              onChange={(e) =>
                setUserData({ ...userData, phone: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {isEditing ? "Nouveau mot de passe" : "Mot de passe"}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={
                isEditing ? "Laisser vide pour conserver l'actuel" : "••••••••"
              }
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              disabled={!isEditing}
            />
            {isEditing && (
              <p className="text-xs text-muted-foreground mt-1">
                Laissez vide pour conserver votre mot de passe actuel
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Textarea
              id="address"
              value={userData.address}
              onChange={(e) =>
                setUserData({ ...userData, address: e.target.value })
              }
              disabled={!isEditing}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={userData.bio}
              onChange={(e) =>
                setUserData({ ...userData, bio: e.target.value })
              }
              disabled={!isEditing}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}