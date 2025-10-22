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
import { Plus, Trash2, Trophy, Users, Target, Calendar } from "lucide-react";
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
        <div className="mb-10">
          <h1 className="text-5xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-emerald-100 dark:to-emerald-200 bg-clip-text text-transparent mb-3">
            Pannello Admin
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Gestisci tornei, squadre, giocatori e partite</p>
        </div>

        <Tabs defaultValue="tournaments" className="space-y-8">
          <TabsList data-testid="tabs-admin" className="bg-slate-200 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800 p-1 backdrop-blur-sm">
            <TabsTrigger 
              value="tournaments" 
              data-testid="tab-tournaments"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Tornei
            </TabsTrigger>
            <TabsTrigger 
              value="teams" 
              data-testid="tab-teams"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Squadre
            </TabsTrigger>
            <TabsTrigger 
              value="players" 
              data-testid="tab-players"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
            >
              <Target className="w-4 h-4 mr-2" />
              Giocatori
            </TabsTrigger>
            <TabsTrigger 
              value="matches" 
              data-testid="tab-matches"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Partite
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tournaments" className="space-y-6">
            <TournamentForm />
            
            <Card className="p-6 border-slate-300 dark:border-slate-800 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Tornei Esistenti</h3>
              <div className="space-y-3">
                {tournaments.map((tournament) => (
                  <div
                    key={tournament.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
                    data-testid={`tournament-item-${tournament.id}`}
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-lg">{tournament.name}</p>
                      <p className="text-sm text-slate-400 mt-1">
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
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            <Card className="p-6 border-slate-300 dark:border-slate-800 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Aggiungi Squadra</h3>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-slate-700 dark:text-slate-200 font-medium">Seleziona Torneo</Label>
                  <Select value={selectedTournament} onValueChange={setSelectedTournament}>
                    <SelectTrigger data-testid="select-tournament-teams" className="bg-slate-50 dark:bg-slate-950/50 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-12">
                      <SelectValue placeholder="Scegli un torneo" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800">
                      {tournaments.map((t) => (
                        <SelectItem key={t.id} value={t.id} className="text-slate-900 dark:text-white">{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 dark:text-slate-200 font-medium">Nome Squadra</Label>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Inserisci il nome della squadra"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      data-testid="input-team-name"
                      className="bg-slate-50 dark:bg-slate-950/50 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-12"
                    />
                    <Button
                      onClick={handleCreateTeam}
                      disabled={!teamName || !selectedTournament || createTeamMutation.isPending}
                      data-testid="button-add-team"
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 h-12 px-6 shadow-lg shadow-emerald-500/25"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Aggiungi
                    </Button>
                  </div>
                </div>
              </div>

              {selectedTournament && (
                <div className="mt-8">
                  <h4 className="font-semibold text-slate-900 dark:text-white text-lg mb-4">Squadre nel Torneo</h4>
                  <div className="space-y-2">
                    {teams.map((team) => (
                      <div
                        key={team.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 transition-all group"
                        data-testid={`team-item-${team.id}`}
                      >
                        <span className="font-medium text-slate-900 dark:text-white">{team.name}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteTeamMutation.mutate(team.id)}
                          data-testid={`button-delete-team-${team.id}`}
                          className="text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="players" className="space-y-6">
            <Card className="p-6 border-slate-300 dark:border-slate-800 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Aggiungi Giocatore</h3>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-slate-700 dark:text-slate-200 font-medium">Seleziona Torneo</Label>
                  <Select value={selectedTournament} onValueChange={setSelectedTournament}>
                    <SelectTrigger data-testid="select-tournament-players" className="bg-slate-50 dark:bg-slate-950/50 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-12">
                      <SelectValue placeholder="Scegli un torneo" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800">
                      {tournaments.map((t) => (
                        <SelectItem key={t.id} value={t.id} className="text-slate-900 dark:text-white">{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTournament && (
                  <div className="space-y-2">
                    <Label className="text-slate-700 dark:text-slate-200 font-medium">Seleziona Squadra</Label>
                    <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                      <SelectTrigger data-testid="select-team-players" className="bg-slate-50 dark:bg-slate-950/50 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-12">
                        <SelectValue placeholder="Scegli una squadra" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800">
                        {teams.map((t) => (
                          <SelectItem key={t.id} value={t.id} className="text-slate-900 dark:text-white">{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedTeam && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 dark:text-slate-200 font-medium">Nome Giocatore</Label>
                      <Input
                        placeholder="Inserisci il nome del giocatore"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        data-testid="input-player-name"
                        className="bg-slate-50 dark:bg-slate-950/50 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 dark:text-slate-200 font-medium">Numero Maglia</Label>
                      <div className="flex gap-3">
                        <Input
                          type="number"
                          placeholder="10"
                          value={jerseyNumber}
                          onChange={(e) => setJerseyNumber(e.target.value)}
                          data-testid="input-jersey-number"
                          className="bg-slate-50 dark:bg-slate-950/50 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-12"
                        />
                        <Button
                          onClick={handleCreatePlayer}
                          disabled={!playerName || createPlayerMutation.isPending}
                          data-testid="button-add-player"
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 h-12 px-6 shadow-lg shadow-emerald-500/25"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Aggiungi
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {selectedTeam && (
                <div className="mt-8">
                  <h4 className="font-semibold text-slate-900 dark:text-white text-lg mb-4">Giocatori nella Squadra</h4>
                  <div className="space-y-2">
                    {players.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 transition-all"
                        data-testid={`player-item-${player.id}`}
                      >
                        <div>
                          <span className="font-medium text-slate-900 dark:text-white">{player.name}</span>
                          {player.jerseyNumber && (
                            <span className="ml-3 px-2 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-md">
                              #{player.jerseyNumber}
                            </span>
                          )}
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deletePlayerMutation.mutate(player.id)}
                          data-testid={`button-delete-player-${player.id}`}
                          className="text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
