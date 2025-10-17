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
import { Plus, Trash2 } from "lucide-react";
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
      toast({ title: "Team created successfully" });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/teams/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments", selectedTournament, "teams"] });
      toast({ title: "Team deleted successfully" });
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
      toast({ title: "Player added successfully" });
    },
  });

  const deletePlayerMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/players/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams", selectedTeam, "players"] });
      toast({ title: "Player deleted successfully" });
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
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>

        <Tabs defaultValue="tournaments" className="space-y-6">
          <TabsList data-testid="tabs-admin">
            <TabsTrigger value="tournaments" data-testid="tab-tournaments">Tournaments</TabsTrigger>
            <TabsTrigger value="teams" data-testid="tab-teams">Teams</TabsTrigger>
            <TabsTrigger value="players" data-testid="tab-players">Players</TabsTrigger>
            <TabsTrigger value="matches" data-testid="tab-matches">Matches</TabsTrigger>
          </TabsList>

          <TabsContent value="tournaments">
            <TournamentForm />
            
            <Card className="p-6 mt-6">
              <h3 className="text-xl font-bold mb-4">Existing Tournaments</h3>
              <div className="space-y-2">
                {tournaments.map((tournament) => (
                  <div
                    key={tournament.id}
                    className="flex items-center justify-between p-3 rounded-lg hover-elevate"
                    data-testid={`tournament-item-${tournament.id}`}
                  >
                    <div>
                      <p className="font-semibold">{tournament.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="teams">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Add Team</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Tournament</Label>
                  <Select value={selectedTournament} onValueChange={setSelectedTournament}>
                    <SelectTrigger data-testid="select-tournament-teams">
                      <SelectValue placeholder="Choose tournament" />
                    </SelectTrigger>
                    <SelectContent>
                      {tournaments.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Team Name</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter team name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      data-testid="input-team-name"
                    />
                    <Button
                      onClick={handleCreateTeam}
                      disabled={!teamName || !selectedTournament || createTeamMutation.isPending}
                      data-testid="button-add-team"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              {selectedTournament && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Teams in Tournament</h4>
                  <div className="space-y-2">
                    {teams.map((team) => (
                      <div
                        key={team.id}
                        className="flex items-center justify-between p-3 rounded-lg hover-elevate"
                        data-testid={`team-item-${team.id}`}
                      >
                        <span className="font-medium">{team.name}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteTeamMutation.mutate(team.id)}
                          data-testid={`button-delete-team-${team.id}`}
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

          <TabsContent value="players">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Add Player</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Tournament</Label>
                  <Select value={selectedTournament} onValueChange={setSelectedTournament}>
                    <SelectTrigger data-testid="select-tournament-players">
                      <SelectValue placeholder="Choose tournament" />
                    </SelectTrigger>
                    <SelectContent>
                      {tournaments.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTournament && (
                  <div className="space-y-2">
                    <Label>Select Team</Label>
                    <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                      <SelectTrigger data-testid="select-team-players">
                        <SelectValue placeholder="Choose team" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((t) => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedTeam && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Player Name</Label>
                      <Input
                        placeholder="Enter player name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        data-testid="input-player-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Jersey Number</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="10"
                          value={jerseyNumber}
                          onChange={(e) => setJerseyNumber(e.target.value)}
                          data-testid="input-jersey-number"
                        />
                        <Button
                          onClick={handleCreatePlayer}
                          disabled={!playerName || createPlayerMutation.isPending}
                          data-testid="button-add-player"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {selectedTeam && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Players in Team</h4>
                  <div className="space-y-2">
                    {players.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-3 rounded-lg hover-elevate"
                        data-testid={`player-item-${player.id}`}
                      >
                        <div>
                          <span className="font-medium">{player.name}</span>
                          {player.jerseyNumber && (
                            <span className="ml-2 text-sm text-muted-foreground">
                              #{player.jerseyNumber}
                            </span>
                          )}
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deletePlayerMutation.mutate(player.id)}
                          data-testid={`button-delete-player-${player.id}`}
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
