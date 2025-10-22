import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Trophy, Sparkles } from "lucide-react";

interface TournamentFormData {
  name: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "live" | "completed";
}

export default function TournamentForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TournamentFormData>({
    name: "",
    startDate: "",
    endDate: "",
    status: "upcoming",
  });

const createTournamentMutation = useMutation({
  mutationFn: async (data: TournamentFormData) => {
    return await apiRequest("POST", "/api/tournaments", {
      name: data.name,
    start_date: data.startDate || null,
    end_date: data.endDate || null,
    status: data.status,
    });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
    setFormData({ name: "", startDate: "", endDate: "", status: "upcoming" });
    toast({
      title: "Torneo creato con successo",
      description: "Il torneo è stato aggiunto al sistema.",
    });
  },
  onError: () => {
    toast({
      title: "Errore",
      description: "Impossibile creare il torneo. Riprova.",
      variant: "destructive",
    });
  },
});



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast({
        title: "Errore di validazione",
        description: "Compila tutti i campi.",
        variant: "destructive",
      });
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast({
        title: "Errore di validazione",
        description: "La data di fine non può essere precedente alla data di inizio.",
        variant: "destructive",
      });
      return;
    }

    createTournamentMutation.mutate(formData);
  };

  const isFormIncomplete =
    !formData.name || !formData.startDate || !formData.endDate;

  return (
    <Card className="p-8 max-w-3xl border-slate-300 dark:border-slate-800 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950" data-testid="card-tournament-form">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
          <Trophy className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Crea Torneo</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Aggiungi un nuovo torneo al sistema</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-700 dark:text-slate-200 font-medium text-sm">Nome Torneo</Label>
          <Input
            id="name"
            placeholder="Es: Campionato Estivo 2024"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            data-testid="input-tournament-name"
            className="bg-slate-50 dark:bg-slate-950/50 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-12 placeholder:text-slate-500 focus:border-emerald-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-slate-700 dark:text-slate-200 font-medium text-sm">Stato</Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData({ ...formData, status: value as TournamentFormData["status"] })
            }
          >
            <SelectTrigger data-testid="select-status" className="bg-slate-50 dark:bg-slate-950/50 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800">
              <SelectItem value="upcoming" className="text-slate-900 dark:text-white">In Arrivo</SelectItem>
              <SelectItem value="live" className="text-slate-900 dark:text-white">Live</SelectItem>
              <SelectItem value="completed" className="text-slate-900 dark:text-white">Completato</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-slate-700 dark:text-slate-200 font-medium text-sm">Data Inizio</Label>
            <div className="relative">
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                data-testid="input-start-date"
                className="bg-slate-50 dark:bg-slate-950/50 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-12 focus:border-emerald-500"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-slate-700 dark:text-slate-200 font-medium text-sm">Data Fine</Label>
            <div className="relative">
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                data-testid="input-end-date"
                className="bg-slate-50 dark:bg-slate-950/50 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-12 focus:border-emerald-500"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setFormData({ name: "", startDate: "", endDate: "", status: "upcoming" })}
            data-testid="button-cancel"
            className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 h-11"
          >
            Annulla
          </Button>
          <Button
            type="submit"
            disabled={isFormIncomplete || createTournamentMutation.isPending}
            data-testid="button-create-tournament"
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 h-11 px-8 shadow-lg shadow-emerald-500/25"
          >
            {createTournamentMutation.isPending ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Creazione...
              </>
            ) : (
              <>
                <Trophy className="w-4 h-4 mr-2" />
                Crea Torneo
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
