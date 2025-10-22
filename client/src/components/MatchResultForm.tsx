import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Calendar, Trophy, Target, Sparkles, Save, Users } from "lucide-react";
import type { Tournament, Team, Match, Player } from "@shared/schema";

interface GoalScorer {
  player: string;
  minute: string;
}

interface MatchResultFormProps {
  existingMatch?: Match | null;
  onClose?: () => void;
}

export default function MatchResultForm() {
  const { toast } = useToast();
  const [selectedTournament, setSelectedTournament] = useState("");
  const [teamAId, setTeamAId] = useState("");
  const [teamBId, setTeamBId] = useState("");
  const [scoreA, setScoreA] = useState("");
  const [scoreB, setScoreB] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [status, setStatus] = useState("scheduled");
  const [scorersA, setScorersA] = useState<GoalScorer[]>([]);
  const [scorersB, setScorersB] = useState<GoalScorer[]>([]);

  const { data: tournaments = [] } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ["/api/tournaments", selectedTournament, "teams"],
    enabled: !!selectedTournament,
  });

  const { data: playersA = [] } = useQuery<Player[]>({
    queryKey: ["/api/teams", teamAId, "players"],
    enabled: !!teamAId,
  });

  const { data: playersB = [] } = useQuery<Player[]>({
    queryKey: ["/api/teams", teamBId, "players"],
    enabled: !!teamBId,
  });

  const createMatchMutation = useMutation({
    mutationFn: async (data: any) => {
      const matchResponse = await apiRequest("POST", "/api/matches", data);
      return matchResponse.json();
    },
    onSuccess: async (match: Match) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments", selectedTournament, "matches"] });

      for (const scorer of scorersA) {
        if (scorer.player && scorer.minute) {
          await apiRequest("POST", "/api/goals", {
            matchId: match.id,
            playerId: scorer.player,
            minute: parseInt(scorer.minute),
          });
        }
      }

      for (const scorer of scorersB) {
        if (scorer.player && scorer.minute) {
          await apiRequest("POST", "/api/goals", {
            matchId: match.id,
            playerId: scorer.player,
            minute: parseInt(scorer.minute),
          });
        }
      }

      queryClient.invalidateQueries({ queryKey: ["/api/tournaments", selectedTournament, "rankings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments", selectedTournament, "top-scorers"] });

      resetForm();
      toast({
        title: "Partita salvata con successo",
        description: "Classifica e capocannonieri aggiornati.",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Impossibile salvare il risultato. Riprova.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setTeamAId("");
    setTeamBId("");
    setScoreA("");
    setScoreB("");
    setMatchDate("");
    setStatus("scheduled");
    setScorersA([]);
    setScorersB([]);
  };

  const addScorer = (team: "A" | "B") => {
    const setter = team === "A" ? setScorersA : setScorersB;
    const scorers = team === "A" ? scorersA : scorersB;
    setter([...scorers, { player: "", minute: "" }]);
  };

  const removeScorer = (team: "A" | "B", index: number) => {
    const setter = team === "A" ? setScorersA : setScorersB;
    const scorers = team === "A" ? scorersA : scorersB;
    setter(scorers.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTournament || !teamAId || !teamBId || !matchDate) {
      toast({
        title: "Errore di validazione",
        description: "Compila tutti i campi obbligatori.",
        variant: "destructive",
      });
      return;
    }

    const formattedDate = new Date(matchDate)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    createMatchMutation.mutate({
      tournament_id: selectedTournament,
      team1_id: teamAId,
      team2_id: teamBId,
      scoreTeam1: Number(scoreA) || 0,
      scoreTeam2: Number(scoreB) || 0,
      match_date: formattedDate,
      status,
      scorersA: scorersA.map((s) => ({ ...s, minute: Number(s.minute) || 0 })),
      scorersB: scorersB.map((s) => ({ ...s, minute: Number(s.minute) || 0 })),
    });
  };

  const teamAName = teams.find(t => String(t.id) === teamAId)?.name || "Team A";
  const teamBName = teams.find(t => String(t.id) === teamBId)?.name || "Team B";

  const statusConfig = {
    scheduled: { bg: "from-blue-500 to-cyan-500", label: "Programmata" },
    live: { bg: "from-red-500 to-pink-500", label: "Live" },
    final: { bg: "from-emerald-500 to-teal-500", label: "Terminata" },
  };

  return (
    <Card className="group relative overflow-hidden p-0 max-w-5xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 shadow-xl" data-testid="card-match-result-form">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-white/30 rounded-xl blur-sm"></div>
            <div className="relative w-14 h-14 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl flex items-center justify-center shadow-xl">
              <Trophy className="w-7 h-7 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white mb-1">Registra Partita</h2>
            <p className="text-orange-100 text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Inserisci il risultato e i marcatori della partita
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Tournament Selection */}
        <div className="space-y-2">
          <Label className="text-slate-700 dark:text-slate-200 font-bold text-sm flex items-center gap-2">
            <Trophy className="w-4 h-4 text-orange-500" />
            Seleziona Torneo
          </Label>
          <Select value={selectedTournament} onValueChange={setSelectedTournament}>
            <SelectTrigger data-testid="select-tournament-match" className="bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-12 font-semibold hover:border-orange-500 transition-colors">
              <SelectValue placeholder="Scegli un torneo" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800">
              {tournaments.map((t) => (
                <SelectItem key={t.id} value={String(t.id)} className="font-semibold">
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedTournament && (
          <>
            {/* Teams Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 shadow-lg">
                <Label className="text-blue-700 dark:text-blue-300 font-black text-sm flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4" />
                  Team A (Casa)
                </Label>
                <Select value={teamAId} onValueChange={setTeamAId}>
                  <SelectTrigger data-testid="select-team-a" className="bg-white dark:bg-slate-950 border-2 border-blue-300 dark:border-blue-700 text-slate-900 dark:text-white h-12 font-semibold hover:border-blue-500 transition-colors">
                    <SelectValue placeholder="Seleziona squadra A" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800">
                    {teams.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)} className="font-semibold">
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Card>

              <Card className="p-6 border-2 border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/50 dark:to-pink-950/50 shadow-lg">
                <Label className="text-red-700 dark:text-red-300 font-black text-sm flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4" />
                  Team B (Trasferta)
                </Label>
                <Select value={teamBId} onValueChange={setTeamBId}>
                  <SelectTrigger data-testid="select-team-b" className="bg-white dark:bg-slate-950 border-2 border-red-300 dark:border-red-700 text-slate-900 dark:text-white h-12 font-semibold hover:border-red-500 transition-colors">
                    <SelectValue placeholder="Seleziona squadra B" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800">
                    {teams
                      .filter((t) => String(t.id) !== teamAId)
                      .map((t) => (
                        <SelectItem key={t.id} value={String(t.id)} className="font-semibold">
                          {t.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </Card>
            </div>

            {/* Date & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-200 font-bold text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  Data e Ora Partita
                </Label>
                <Input
                  type="datetime-local"
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                  data-testid="input-match-date"
                  className="bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-12 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-semibold"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-200 font-bold text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  Stato Partita
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger data-testid="select-match-status" className="bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-12 font-semibold hover:border-emerald-500 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800">
                    {Object.entries(statusConfig).map(([value, config]) => (
                      <SelectItem key={value} value={value} className="font-semibold">
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Scores & Scorers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team A */}
              <Card className="p-6 border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 shadow-lg" data-testid="card-team-a-score">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-lg text-blue-700 dark:text-blue-300" data-testid="text-team-a-name">{teamAName}</h3>
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-blue-500/30">
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={scoreA}
                      onChange={(e) => setScoreA(e.target.value)}
                      data-testid="input-score-a"
                      className="w-full h-full text-center text-3xl font-black bg-transparent border-0 text-white placeholder:text-white/50 focus-visible:ring-0"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-blue-700 dark:text-blue-300 font-black text-sm flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Marcatori
                    </Label>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addScorer("A")}
                      disabled={!teamAId}
                      data-testid="button-add-scorer-a"
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/30 font-bold"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Aggiungi
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {scorersA.map((scorer, index) => (
                      <div key={index} className="flex gap-2" data-testid={`row-scorer-a-${index}`}>
                        <Select
                          value={scorer.player}
                          onValueChange={(value) => {
                            const newScorers = [...scorersA];
                            newScorers[index].player = value;
                            setScorersA(newScorers);
                          }}
                        >
                          <SelectTrigger className="bg-white dark:bg-slate-950 border-2 border-blue-300 dark:border-blue-700 font-semibold" data-testid={`select-scorer-a-${index}`}>
                            <SelectValue placeholder="Giocatore" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-slate-900">
                            {playersA.map((p) => (
                              <SelectItem key={p.id} value={String(p.id)} className="font-semibold">
                                {p.name} {p.jerseyNumber && `(#${p.jerseyNumber})`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="Min"
                          className="w-20 bg-white dark:bg-slate-950 border-2 border-blue-300 dark:border-blue-700 font-bold text-center"
                          value={scorer.minute}
                          onChange={(e) => {
                            const newScorers = [...scorersA];
                            newScorers[index].minute = e.target.value;
                            setScorersA(newScorers);
                          }}
                          data-testid={`input-minute-a-${index}`}
                        />
                        <Button type="button" size="icon" variant="ghost" onClick={() => removeScorer("A", index)} className="hover:bg-red-100 dark:hover:bg-red-500/10 hover:text-red-500" data-testid={`button-remove-scorer-a-${index}`}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Team B */}
              <Card className="p-6 border-2 border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/50 dark:to-pink-950/50 shadow-lg" data-testid="card-team-b-score">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-lg text-red-700 dark:text-red-300" data-testid="text-team-b-name">{teamBName}</h3>
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-xl shadow-red-500/30">
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={scoreB}
                      onChange={(e) => setScoreB(e.target.value)}
                      data-testid="input-score-b"
                      className="w-full h-full text-center text-3xl font-black bg-transparent border-0 text-white placeholder:text-white/50 focus-visible:ring-0"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-red-700 dark:text-red-300 font-black text-sm flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Marcatori
                    </Label>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addScorer("B")}
                      disabled={!teamBId}
                      data-testid="button-add-scorer-b"
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg shadow-red-500/30 font-bold"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Aggiungi
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {scorersB.map((scorer, index) => (
                      <div key={index} className="flex gap-2" data-testid={`row-scorer-b-${index}`}>
                        <Select
                          value={scorer.player}
                          onValueChange={(value) => {
                            const newScorers = [...scorersB];
                            newScorers[index].player = value;
                            setScorersB(newScorers);
                          }}
                        >
                          <SelectTrigger className="bg-white dark:bg-slate-950 border-2 border-red-300 dark:border-red-700 font-semibold" data-testid={`select-scorer-b-${index}`}>
                            <SelectValue placeholder="Giocatore" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-slate-900">
                            {playersB.map((p) => (
                              <SelectItem key={p.id} value={String(p.id)} className="font-semibold">
                                {p.name} {p.jerseyNumber && `(#${p.jerseyNumber})`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="Min"
                          className="w-20 bg-white dark:bg-slate-950 border-2 border-red-300 dark:border-red-700 font-bold text-center"
                          value={scorer.minute}
                          onChange={(e) => {
                            const newScorers = [...scorersB];
                            newScorers[index].minute = e.target.value;
                            setScorersB(newScorers);
                          }}
                          data-testid={`input-minute-b-${index}`}
                        />
                        <Button type="button" size="icon" variant="ghost" onClick={() => removeScorer("B", index)} className="hover:bg-red-100 dark:hover:bg-red-500/10 hover:text-red-500" data-testid={`button-remove-scorer-b-${index}`}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-6 border-t-2 border-slate-200 dark:border-slate-800">
          <Button 
            type="button" 
            variant="outline" 
            onClick={resetForm}
            className="border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 h-12 px-6 font-bold hover:scale-105 transition-all"
          >
            <X className="w-4 h-4 mr-2" />
            Annulla
          </Button>
          <Button 
            type="submit" 
            disabled={createMatchMutation.isPending}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 h-12 px-8 shadow-xl shadow-orange-500/30 font-black hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMatchMutation.isPending ? (
              <>
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                Salvataggio...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Salva Partita
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
