import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import TournamentForm from "@/components/TournamentForm";
import MatchResultForm from "@/components/MatchResultForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Trophy, Users, Target, Calendar, Sparkles, Shield } from "lucide-react";
import type { Tournament, Team, Player } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();
  const [selectedTournament, setSelectedTournament] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  
  const [teamName, setTeamName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [jerseyNumber, setJerseyNumber] = useState("");

  const { data: tournaments = [] } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ["/api/tournaments", selectedTournament, "teams"],
    enabled: !!selectedTournament,
  });

  const { data: players = [] } = useQuery<Player[]>({
    queryKey: ["/api/teams", selectedTeam, "players"],
    enabled: !!selectedTeam,
  });

  const createTeamMutation = useMutation({
    mutationFn: async (data: { tournament_id: string; name: string }) => {
      return await apiRequest("POST", "/api/teams", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments", selectedTournament, "teams"] });
      setTeamName("");
      toast({ title: "Squadra creata con successo" });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/teams/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments", selectedTournament, "teams"] });
      toast({ title: "Squadra eliminata con successo" });
    },
  });

  const createPlayerMutation = useMutation({
    mutationFn: async (data: { teamId: string; name: string; jerseyNumber: number | null }) => {
      return await apiRequest("POST", "/api/players", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams", selectedTeam, "players"] });
      setPlayerName("");
      setJerseyNumber("");
      toast({ title: "Giocatore aggiunto con successo" });
    },
  });

  const deletePlayerMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/players/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams", selectedTeam, "players"] });
      toast({ title: "Giocatore eliminato con successo" });
    },
  });

  const handleCreateTeam = () => {
    if (!teamName || !selectedTournament) return;
    createTeamMutation.mutate({
      tournament_id: selectedTournament,
      name: teamName,
    });
  };

  const handleCreatePlayer = () => {
    if (!playerName || !selectedTeam) return;
    createPlayerMutation.mutate({
      teamId: selectedTeam,
      name: playerName,
      jerseyNumber: jerseyNumber ? parseInt(jerseyNumber) : null,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Header */}
        <div className="relative mb-12 overflow-hidden" data-testid="section-admin-header">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gradient-to-br from-slate-900 to-emerald-950 dark:from-slate-800 dark:to-emerald-900 rounded-2xl p-8 border-2 border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl opacity-50 blur-sm"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-black text-white mb-2" data-testid="text-admin-title">
                  Pannello Admin
                </h1>
                <p className="text-emerald-200 text-lg font-medium flex items-center gap-2" data-testid="text-admin-subtitle">
                  <Sparkles className="w-4 h-4" />
                  Gestisci tornei, squadre, giocatori e partite
                </p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="tournaments" className="space-y-8">
          {/* Professional Tabs */}
          <TabsList data-testid="tabs-admin" className="grid grid-cols-4 gap-2 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-2 rounded-xl shadow-lg h-auto">
            <TabsTrigger 
              value="tournaments" 
              data-testid="tab-tournaments"
              className="relative flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-emerald-500/30 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Trophy className="w-5 h-5" />
              <span className="hidden sm:inline">Tornei</span>
            </TabsTrigger>
            <TabsTrigger 
              value="teams" 
              data-testid="tab-teams"
              className="relative flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-blue-500/30 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Users className="w-5 h-5" />
              <span className="hidden sm:inline">Squadre</span>
            </TabsTrigger>
            <TabsTrigger 
              value="players" 
              data-testid="tab-players"
              className="relative flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-purple-500/30 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Target className="w-5 h-5" />
              <span className="hidden sm:inline">Giocatori</span>
            </TabsTrigger>
            <TabsTrigger 
              value="matches" 
              data-testid="tab-matches"
              className="relative flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-orange-500/30 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Calendar className="w-5 h-5" />
              <span className="hidden sm:inline">Partite</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tournaments" className="space-y-6">
            <TournamentForm />
            
            <Card className="group relative overflow-hidden p-0 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 shadow-xl" data-testid="card-existing-tournaments">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Tornei Esistenti</h3>
                    <p className="text-emerald-100 text-sm font-medium" data-testid="text-tournament-count">{tournaments.length} tornei nel sistema</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {tournaments.map((tournament) => (
                    <div
                      key={tournament.id}
                      className="group/item relative overflow-hidden flex items-center justify-between p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10"
                      data-testid={`tournament-item-${tournament.id}`}
                    >
                      <div className="absolute inset-0 -translate-x-full group-hover/item:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-black text-lg text-slate-900 dark:text-white">{tournament.name}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1 flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {tournament.startDate
                              ? new Date(tournament.startDate).toLocaleDateString("it-IT")
                              : "Data inizio non disponibile"}{" "}
                            -{" "}
                            {tournament.endDate
                              ? new Date(tournament.endDate).toLocaleDateString("it-IT")
                              : "Data fine non disponibile"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            <Card className="group relative overflow-hidden p-0 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 shadow-xl" data-testid="card-add-team">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Aggiungi Squadra</h3>
                    <p className="text-blue-100 text-sm font-medium">Crea una nuova squadra nel torneo</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-slate-700 dark:text-slate-200 font-bold text-sm">Seleziona Torneo</Label>
                    <Select value={selectedTournament} onValueChange={setSelectedTournament}>
                      <SelectTrigger data-testid="select-tournament-teams" className="bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-12 font-semibold hover:border-blue-500 transition-colors">
                        <SelectValue placeholder="Scegli un torneo" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800">
                        {tournaments.map((t) => (
                          <SelectItem key={t.id} value={t.id} className="text-slate-900 dark:text-white font-semibold">{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 dark:text-slate-200 font-bold text-sm">Nome Squadra</Label>
                    <div className="flex gap-3">
                      <Input
                        placeholder="Inserisci il nome della squadra"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        data-testid="input-team-name"
                        className="bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-12 font-semibold focus:border-blue-500 transition-colors"
                      />
                      <Button
                        onClick={handleCreateTeam}
                        disabled={!teamName || !selectedTournament || createTeamMutation.isPending}
                        data-testid="button-add-team"
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 h-12 px-6 shadow-lg shadow-blue-500/30 font-bold hover:scale-105 transition-all"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Aggiungi
                      </Button>
                    </div>
                  </div>
                </div>

                {selectedTournament && (
                  <div className="mt-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-blue-500" />
                      <h4 className="font-black text-slate-900 dark:text-white text-lg">Squadre nel Torneo</h4>
                    </div>
                    <div className="space-y-2">
                      {teams.map((team) => (
                        <div
                          key={team.id}
                          className="group/team relative overflow-hidden flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10"
                          data-testid={`team-item-${team.id}`}
                        >
                          <div className="absolute inset-0 -translate-x-full group-hover/team:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                              <Users className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-black text-slate-900 dark:text-white">{team.name}</span>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteTeamMutation.mutate(team.id)}
                            data-testid={`button-delete-team-${team.id}`}
                            className="text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10 hover:scale-110 transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="players" className="space-y-6">
            <Card className="group relative overflow-hidden p-0 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 shadow-xl" data-testid="card-add-player">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Aggiungi Giocatore</h3>
                    <p className="text-purple-100 text-sm font-medium">Aggiungi un nuovo giocatore alla squadra</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-slate-700 dark:text-slate-200 font-bold text-sm">Seleziona Torneo</Label>
                    <Select value={selectedTournament} onValueChange={setSelectedTournament}>
                      <SelectTrigger data-testid="select-tournament-players" className="bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-12 font-semibold hover:border-purple-500 transition-colors">
                        <SelectValue placeholder="Scegli un torneo" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800">
                        {tournaments.map((t) => (
                          <SelectItem key={t.id} value={t.id} className="text-slate-900 dark:text-white font-semibold">{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedTournament && (
                    <div className="space-y-2">
                      <Label className="text-slate-700 dark:text-slate-200 font-bold text-sm">Seleziona Squadra</Label>
                      <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                        <SelectTrigger data-testid="select-team-players" className="bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-12 font-semibold hover:border-purple-500 transition-colors">
                          <SelectValue placeholder="Scegli una squadra" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800">
                          {teams.map((t) => (
                            <SelectItem key={t.id} value={t.id} className="text-slate-900 dark:text-white font-semibold">{t.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {selectedTeam && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-700 dark:text-slate-200 font-bold text-sm">Nome Giocatore</Label>
                        <Input
                          placeholder="Inserisci il nome del giocatore"
                          value={playerName}
                          onChange={(e) => setPlayerName(e.target.value)}
                          data-testid="input-player-name"
                          className="bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-12 font-semibold focus:border-purple-500 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 dark:text-slate-200 font-bold text-sm">Numero Maglia</Label>
                        <div className="flex gap-3">
                          <Input
                            type="number"
                            placeholder="10"
                            value={jerseyNumber}
                            onChange={(e) => setJerseyNumber(e.target.value)}
                            data-testid="input-jersey-number"
                            className="bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-12 font-semibold focus:border-purple-500 transition-colors"
                          />
                          <Button
                            onClick={handleCreatePlayer}
                            disabled={!playerName || createPlayerMutation.isPending}
                            data-testid="button-add-player"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-12 px-6 shadow-lg shadow-purple-500/30 font-bold hover:scale-105 transition-all"
                          >
                            <Plus className="w-5 h-5 mr-2" />
                            Aggiungi
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {selectedTeam && (
                  <div className="mt-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5 text-purple-500" />
                      <h4 className="font-black text-slate-900 dark:text-white text-lg">Giocatori nella Squadra</h4>
                    </div>
                    <div className="space-y-2">
                      {players.map((player) => (
                        <div
                          key={player.id}
                          className="group/player relative overflow-hidden flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10"
                          data-testid={`player-item-${player.id}`}
                        >
                          <div className="absolute inset-0 -translate-x-full group-hover/player:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 font-black text-white text-sm" data-testid={`badge-jersey-${player.id}`}>
                              {player.jerseyNumber || <Target className="w-5 h-5" />}
                            </div>
                            <div>
                              <span className="font-black text-slate-900 dark:text-white" data-testid={`text-player-name-${player.id}`}>{player.name}</span>
                              {player.jerseyNumber && (
                                <span className="ml-3 px-3 py-1 text-xs font-black bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 dark:text-purple-400 rounded-lg border border-purple-500/30" data-testid={`badge-jersey-number-${player.id}`}>
                                  #{player.jerseyNumber}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deletePlayerMutation.mutate(player.id)}
                            data-testid={`button-delete-player-${player.id}`}
                            className="text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10 hover:scale-110 transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="matches">
            <MatchResultForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
