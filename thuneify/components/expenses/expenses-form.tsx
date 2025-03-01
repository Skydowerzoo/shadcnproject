import * as React from "react";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar"; // Importer le composant Calendar
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"; // Importer Popover
import { format } from "date-fns"; // Pour formater la date
import { CalendarIcon } from "lucide-react"; // Icône pour le bouton du calendrier

interface ExpensesFormProps {
  onAddExpense: (expense: { date: string; perso: number; commun: number }) => void;
}

export function ExpensesForm({ onAddExpense }: ExpensesFormProps) {
  const [date, setDate] = useState<Date | undefined>(undefined); // Gérer la date avec le type Date
  const [perso, setPerso] = useState("");
  const [commun, setCommun] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Vérifier qu'au moins un des deux champs est rempli
    if (!perso && !commun) {
      alert("Veuillez remplir au moins un des comptes (Personnel ou Commun).");
      return;
    }

    // Vérifier qu'une date est sélectionnée
    if (!date) {
      alert("Veuillez sélectionner une date.");
      return;
    }

    // Créer un nouvel objet dépense
    const newExpense = {
      date: date.toISOString().split("T")[0], // Formater la date en 'YYYY-MM-DD'
      perso: perso ? parseFloat(perso) : 0,
      commun: commun ? parseFloat(commun) : 0,
    };

    // Appeler la fonction onAddExpense avec la nouvelle dépense
    onAddExpense(newExpense);

    // Réinitialiser les champs du formulaire
    setDate(undefined);
    setPerso("");
    setCommun("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Ajouter de nouvelles dépenses</h1>
      </div>

      {/* Champ date avec Calendar */}
      <div>
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              {date ? format(date, "PPP") : <span>Choisir une date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Champ Montant pour compte perso */}
      <div>
        <Label htmlFor="perso">Compte Personnel</Label>
        <Input
          type="number"
          id="perso"
          value={perso}
          onChange={(e) => setPerso(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Champ Montant pour compte commun */}
      <div>
        <Label htmlFor="commun">Compte Commun</Label>
        <Input
          type="number"
          id="commun"
          value={commun}
          onChange={(e) => setCommun(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Bouton de soumission */}
      <div>
        <Button type="submit" className="w-full">
          Ajouter une nouvelle information
        </Button>
      </div>
    </form>
  );
}