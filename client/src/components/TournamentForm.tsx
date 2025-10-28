import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Trophy, Sparkles, Award, X } from "lucide-react";

interface TournamentFormData {
  name: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "live" | "completed";
  type: "league" | "groupKnockout"; // nuovo campo tipo torneo
  totalTeams?: number;               // numero squadre (solo gironi)
  groupSize?: number;                // dimensione girone (solo gironi)
  knockoutRounds?: number;           // round KO (solo gironi)
}

export default function TournamentForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TournamentFormData>({
    name: "",
    startDate: "",
    endDate: "",
    status: "upcoming",
    type: "league",
  });

  const createTournamentMutation = useMutation({
    mutationFn: async (data: TournamentFormData) => {
      return await apiRequest("POST", "/api/tournaments", {
        name: data.name,
        start_date: data.startDate || null,
        end_date: data.endDate || null,
        status: data.status,
        type: data.type,
        total_teams: data.totalTeams || null,
        group_size: data.groupSize || null,
        knockout_rounds: data.knockoutRounds || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      setFormData({ name: "", startDate: "", endDate: "", status: "upcoming", type: "league" });
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
      toast({ title: "Errore di validazione", description: "Compila tutti i campi.", variant: "destructive" });
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast({ title: "Errore di validazione", description: "La data di fine non può essere precedente alla data di inizio.", variant: "destructive" });
      return;
    }

    if (formData.type === "groupKnockout" && (!formData.totalTeams || !formData.groupSize || !formData.knockoutRounds)) {
      toast({ title: "Errore di validazione", description: "Compila tutti i campi per il torneo a gironi + KO.", variant: "destructive" });
      return;
    }

    createTournamentMutation.mutate(formData);
  };

  const isFormIncomplete =
    !formData.name || !formData.startDate || !formData.endDate || (formData.type === "groupKnockout" && (!formData.totalTeams || !formData.groupSize || !formData.knockoutRounds));

  const statusConfig = {
    upcoming: { bg: "from-blue-500 to-blue-600", label: "In Arrivo" },
    live: { bg: "from-red-500 to-pink-500", label: "Live" },
    completed: { bg: "from-emerald-500 to-teal-500", label: "Completato" },
  };

  return (
    <Card className="group relative overflow-hidden p-0 max-w-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 shadow-xl" data-testid="card-tournament-form">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 p-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-white/30 rounded-xl blur-sm"></div>
            <div className="relative w-14 h-14 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl flex items-center justify-center shadow-xl">
              <Trophy className="w-7 h-7 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white mb-1">Crea Nuovo Torneo</h2>
            <p className="text-emerald-100 text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Aggiungi un nuovo torneo al sistema
            </p>
          </div>
        </div>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Nome Torneo */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-700 dark:text-slate-200 font-bold text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-500" />
            Nome Torneo
          </Label>
          <Input
            id="name"
            placeholder="Es: Campionato Estivo 2024"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            data-testid="input-tournament-name"
            className="bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-12 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-semibold"
          />
        </div>

        {/* Tipo Torneo */}
        <div className="space-y-2">
          <Label htmlFor="type" className="text-slate-700 dark:text-slate-200 font-bold text-sm flex items-center gap-2">
            Tipo Torneo
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value as TournamentFormData["type"] })}
          >
            <SelectTrigger className="bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-12 font-semibold hover:border-emerald-500 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800">
              <SelectItem value="league">Campionato</SelectItem>
              <SelectItem value="groupKnockout">Fase a gironi + Eliminazione diretta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Parametri gironi + KO */}
        {formData.type === "groupKnockout" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Numero squadre</Label>
              <Input
                type="number"
                value={formData.totalTeams || ""}
                onChange={(e) => setFormData({ ...formData, totalTeams: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Squadre per girone</Label>
              <Input
                type="number"
                value={formData.groupSize || ""}
                onChange={(e) => setFormData({ ...formData, groupSize: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Fasi Eliminazione Diretta</Label>
              <Select
                value={formData.knockoutRounds?.toString() || "1"}
                onValueChange={(value) => setFormData({ ...formData, knockoutRounds: Number(value) })}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Finale</SelectItem>
                  <SelectItem value="2">Semifinale + Finale</SelectItem>
                  <SelectItem value="3">Quarti + Semifinale + Finale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Stato */}
        <div className="space-y-2">
          <Label htmlFor="status" className="text-slate-700 dark:text-slate-200 font-bold text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            Stato del Torneo
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData({ ...formData, status: value as TournamentFormData["status"] })
            }
          >
            <SelectTrigger data-testid="select-status" className="bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-12 font-semibold hover:border-emerald-500 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800">
              {Object.entries(statusConfig).map(([value, config]) => (
                <SelectItem key={value} value={value} className="text-slate-900 dark:text-white font-semibold">
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-slate-700 dark:text-slate-200 font-bold text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              Data Inizio
            </Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-slate-700 dark:text-slate-200 font-bold text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              Data Fine
            </Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end pt-6 border-t-2 border-slate-200 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={() => setFormData({ name: "", startDate: "", endDate: "", status: "upcoming", type: "league" })}
            className="border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 h-12 px-6 font-bold hover:scale-105 transition-all"
          >
            <X className="w-4 h-4 mr-2" />
            Annulla
          </Button>
          <Button
            type="submit"
            disabled={isFormIncomplete || createTournamentMutation.isPending}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 h-12 px-8 shadow-xl shadow-emerald-500/30 font-black hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createTournamentMutation.isPending ? (
              <>
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                Creazione...
              </>
            ) : (
              <>
                <Trophy className="w-5 h-5 mr-2" />
                Crea Torneo
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
