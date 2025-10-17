import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Calendar } from "lucide-react";
import type { Tournament, Team, Match, Player } from "@shared/schema";

interface GoalScorer {
  player: string;
  minute: string;
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
        title: "Match result saved successfully",
        description: "Rankings and top scorers have been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save match result. Please try again.",
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
        title: "Validation Error",
        description: "Please fill in all required fields.",
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
      scorersA: scorersA.map((s) => ({ ...s, minute: Number(s.minute) || 0 })),
      scorersB: scorersB.map((s) => ({ ...s, minute: Number(s.minute) || 0 })),
    });
  };

  return (
    <Card className="p-6 max-w-4xl" data-testid="card-match-result-form">
      <h2 className="text-2xl font-bold mb-6">Record Match</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tournament */}
        <div className="space-y-2">
          <Label>Select Tournament</Label>
          <Select value={selectedTournament} onValueChange={setSelectedTournament}>
            <SelectTrigger data-testid="select-tournament-match">
              <SelectValue placeholder="Choose a tournament" />
            </SelectTrigger>
            <SelectContent>
              {tournaments.map((t) => (
                <SelectItem key={t.id} value={String(t.id)}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedTournament && (
          <>
            {/* Teams */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Team A</Label>
                <Select value={teamAId} onValueChange={setTeamAId}>
                  <SelectTrigger data-testid="select-team-a">
                    <SelectValue placeholder="Select team A" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Team B</Label>
                <Select value={teamBId} onValueChange={setTeamBId}>
                  <SelectTrigger data-testid="select-team-b">
                    <SelectValue placeholder="Select team B" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams
                      .filter((t) => String(t.id) !== teamAId)
                      .map((t) => (
                        <SelectItem key={t.id} value={String(t.id)}>
                          {t.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date & Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Match Date</Label>
                <div className="relative">
                  <Input
                    type="datetime-local"
                    value={matchDate}
                    onChange={(e) => setMatchDate(e.target.value)}
                    data-testid="input-match-date"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger data-testid="select-match-status">
                    <SelectValue>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="final">Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team A */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Team A Score</h3>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={scoreA}
                  onChange={(e) => setScoreA(e.target.value)}
                />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>Goal Scorers</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addScorer("A")}
                      disabled={!teamAId}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {scorersA.map((scorer, index) => (
                      <div key={index} className="flex gap-2">
                        <Select
                          value={scorer.player}
                          onValueChange={(value) => {
                            const newScorers = [...scorersA];
                            newScorers[index].player = value;
                            setScorersA(newScorers);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select player" />
                          </SelectTrigger>
                          <SelectContent>
                            {playersA.map((p) => (
                              <SelectItem key={p.id} value={String(p.id)}>
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="Min"
                          className="w-20"
                          value={scorer.minute}
                          onChange={(e) => {
                            const newScorers = [...scorersA];
                            newScorers[index].minute = e.target.value;
                            setScorersA(newScorers);
                          }}
                        />
                        <Button type="button" size="icon" variant="ghost" onClick={() => removeScorer("A", index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Team B */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Team B Score</h3>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={scoreB}
                  onChange={(e) => setScoreB(e.target.value)}
                />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>Goal Scorers</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addScorer("B")}
                      disabled={!teamBId}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {scorersB.map((scorer, index) => (
                      <div key={index} className="flex gap-2">
                        <Select
                          value={scorer.player}
                          onValueChange={(value) => {
                            const newScorers = [...scorersB];
                            newScorers[index].player = value;
                            setScorersB(newScorers);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select player" />
                          </SelectTrigger>
                          <SelectContent>
                            {playersB.map((p) => (
                              <SelectItem key={p.id} value={String(p.id)}>
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="Min"
                          className="w-20"
                          value={scorer.minute}
                          onChange={(e) => {
                            const newScorers = [...scorersB];
                            newScorers[index].minute = e.target.value;
                            setScorersB(newScorers);
                          }}
                        />
                        <Button type="button" size="icon" variant="ghost" onClick={() => removeScorer("B", index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={resetForm}>
            Cancel
          </Button>
          <Button type="submit" disabled={createMatchMutation.isPending}>
            {createMatchMutation.isPending ? "Saving..." : "Save Match"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
