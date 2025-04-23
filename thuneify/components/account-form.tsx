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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import axios from "axios";
import {
  Calendar,
  Camera,
  Check,
  FileText,
  Home,
  Loader2,
  Lock,
  Mail,
  PencilIcon,
  Phone,
  SaveIcon,
  User as UserIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AccountForm() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
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

  // Fonction pour formater la date en YYYY-MM-DD
  const formatDateForInput = (dateString: string | undefined): string => {
    if (!dateString) return "";

    try {
      console.log("Date reçue:", dateString);

      // Si c'est déjà le bon format
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }

      // Méthode simple: extraire la date de façon locale
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";

      // Utiliser les méthodes locales (pas UTC)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Erreur de format de date:", error);
      return "";
    }
  };

  // Fonction pour formater la date pour l'affichage
  const formatDateForDisplay = (dateString: string | undefined): string => {
    if (!dateString) return "Non renseigné";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Format invalide";

      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      return "Format invalide";
    }
  };

  // Préparation de la date pour l'API
  const prepareForApiDate = (inputDate: string): string => {
    if (!inputDate) return "";
    return inputDate; // Format YYYY-MM-DD
  };

  // Initialisation avec les données utilisateur
  useEffect(() => {
    if (user) {
      setUserData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        date: formatDateForInput(user.date),
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        address: user.address || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  // Sauvegarde des modifications
  const handleSave = async () => {
    if (!user || !user.id) return;

    try {
      setIsLoading(true);

      const dataToSubmit = {
        ...userData,
        date: prepareForApiDate(userData.date),
        password: userData.password ? userData.password : undefined,
      };

      console.log("Date envoyée à l'API:", dataToSubmit.date);

      const response = await axios.put(
        `http://localhost:5000/api/users/${user.id}`,
        dataToSubmit
      );

      console.log("Réponse:", response.data);

      // Mise à jour du contexte utilisateur
      if (response.data && typeof updateUser === "function") {
        updateUser(response.data);

        // Notification avec sonner
        toast.success("Profil mis à jour", {
          description: "Vos informations ont été enregistrées avec succès.",
        });
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast.error("Erreur", {
        description:
          "Impossible de mettre à jour votre profil. Veuillez réessayer.",
      });
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
        date: formatDateForInput(user.date),
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar avec info profil */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2 bg-primary/10">
              <CardTitle className="text-xl">Votre profil</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4 pt-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.avatar || ""} alt={user?.firstname} />
                  <AvatarFallback className="text-2xl">
                    {user?.firstname?.charAt(0)}
                    {user?.lastname?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Badge
                  variant="outline"
                  className="absolute -bottom-1 -right-1 p-1 rounded-full bg-background"
                >
                  <Camera className="h-4 w-4" />
                </Badge>
              </div>
              <div className="text-center w-full">
                {isEditing ? (
                  <div className="grid grid-cols-1 gap-2">
                    <Input
                      value={userData.firstname}
                      onChange={(e) =>
                        setUserData({ ...userData, firstname: e.target.value })
                      }
                      placeholder="Prénom"
                      className="text-center"
                    />
                    <Input
                      value={userData.lastname}
                      onChange={(e) =>
                        setUserData({ ...userData, lastname: e.target.value })
                      }
                      placeholder="Nom"
                      className="text-center"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold mt-2">
                      {user?.firstname} {user?.lastname}
                    </h2>
                  </>
                )}
                <p className="text-muted-foreground text-sm mt-1">
                  {isEditing ? (
                    <Input
                      value={userData.email}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                      placeholder="Email"
                      className="text-center"
                    />
                  ) : (
                    user?.email
                  )}
                </p>
              </div>
              <Separator />
              <div className="w-full">
                <div className="flex items-center mb-2">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Date de naissance</span>
                </div>
                {isEditing ? (
                  <Input
                    type="date"
                    value={userData.date}
                    onChange={(e) =>
                      setUserData({ ...userData, date: e.target.value })
                    }
                    className="pl-6"
                  />
                ) : (
                  <p className="text-sm font-medium pl-6">
                    {formatDateForDisplay(user?.date)}
                  </p>
                )}
              </div>
              <div className="w-full">
                <div className="flex items-center mb-2">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Téléphone</span>
                </div>
                {isEditing ? (
                  <Input
                    value={userData.phone}
                    onChange={(e) =>
                      setUserData({ ...userData, phone: e.target.value })
                    }
                    className="pl-6"
                    placeholder="Téléphone"
                  />
                ) : (
                  <p className="text-sm font-medium pl-6">
                    {user?.phone || "Non renseigné"}
                  </p>
                )}
              </div>
              <div className="w-full">
                <div className="flex items-center mb-2">
                  <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Adresse</span>
                </div>
                {isEditing ? (
                  <Input
                    value={userData.address}
                    onChange={(e) =>
                      setUserData({ ...userData, address: e.target.value })
                    }
                    className="pl-6"
                    placeholder="Adresse"
                  />
                ) : (
                  <p className="text-sm font-medium pl-6">
                    {user?.address || "Non renseignée"}
                  </p>
                )}
              </div>
              <Separator />
              <div className="w-full flex gap-2 mt-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      Annuler
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleSave}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <SaveIcon className="h-4 w-4 mr-2" />
                      )}
                      Sauvegarder
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsEditing(true)}
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulaire principal */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-secondary/10">
              <CardTitle className="text-xl">Paramètres du compte</CardTitle>
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
            <CardContent className="pt-4">
              <Tabs
                defaultValue="profile"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="profile">Profil</TabsTrigger>
                  <TabsTrigger value="security">Sécurité</TabsTrigger>
                  <TabsTrigger value="details">Bio & Infos</TabsTrigger>
                </TabsList>

                {/* Onglet Profil */}
                <TabsContent value="profile" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstname"
                        className="flex items-center gap-2"
                      >
                        <UserIcon className="h-4 w-4" /> Prénom
                      </Label>
                      <Input
                        id="firstname"
                        value={userData.firstname}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            firstname: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="lastname"
                        className="flex items-center gap-2"
                      >
                        <UserIcon className="h-4 w-4" /> Nom
                      </Label>
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
                    <Label htmlFor="date" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Date de naissance
                    </Label>
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
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Téléphone
                    </Label>
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
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </Label>
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
                </TabsContent>

                {/* Onglet Sécurité */}
                <TabsContent value="security" className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      {isEditing ? "Nouveau mot de passe" : "Mot de passe"}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder={
                        isEditing
                          ? "Laisser vide pour conserver l'actuel"
                          : "••••••••"
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

                  <div className="mt-6 space-y-6">
                    <div className="flex items-center justify-between py-3 border-b">
                      <div>
                        <h3 className="text-sm font-medium">
                          Authentification à deux facteurs
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Ajouter une couche de sécurité supplémentaire
                        </p>
                      </div>
                      <Button variant="outline" disabled={true} size="sm">
                        Configurer
                      </Button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b">
                      <div>
                        <h3 className="text-sm font-medium">
                          Sessions actives
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Gérez vos connexions sur différents appareils
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Gérer
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Onglet Bio & Infos */}
                <TabsContent value="details" className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="flex items-center gap-2"
                    >
                      <Home className="h-4 w-4" /> Adresse
                    </Label>
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
                    <Label htmlFor="bio" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={userData.bio}
                      onChange={(e) =>
                        setUserData({ ...userData, bio: e.target.value })
                      }
                      disabled={!isEditing}
                      rows={4}
                      placeholder={
                        isEditing ? "Parlez-nous un peu de vous..." : ""
                      }
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="flex justify-between border-t pt-4 pb-4">
              <p className="text-xs text-muted-foreground">
                Dernière mise à jour: {new Date().toLocaleDateString()}
              </p>
              {isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setActiveTab(
                      activeTab === "profile"
                        ? "security"
                        : activeTab === "security"
                        ? "details"
                        : "profile"
                    )
                  }
                >
                  {activeTab === "details" ? "Terminer" : "Suivant"}{" "}
                  <Check className="ml-1 h-3 w-3" />
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
