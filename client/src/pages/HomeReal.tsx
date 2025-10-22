import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TournamentCard from "@/components/TournamentCard";
import MatchCard from "@/components/MatchCard";
import MatchEditForm from "@/components/MatchEditForm";
import RankingsTable from "@/components/RankingsTable";
import TopScorersLeaderboard from "@/components/TopScorersLeaderboard";
import StatsCard from "@/components/StatsCard";
import { Trophy, Users, Calendar, Target } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Tournament, Match, Team } from "@shared/schema";
import type { Player } from "@/types"; // usa il tipo corretto dal tuo progetto

interface MatchWithDetails extends Match {
  teamAName?: string;
  teamBName?: string;
  onClick?: () => void;
  scorersA?: { playerName: string; minute: number }[];
  scorersB?: { playerName: string; minute: number }[];
}

export default function HomeReal() {
  const [selectedTournament, setSelectedTournament] = useState<string>("");
  const [, setLocation] = useLocation();
  const [editingMatch, setEditingMatch] = useState<MatchWithDetails | null>(null);
  const [scoreAInput, setScoreAInput] = useState<number>(0);
  const [scoreBInput, setScoreBInput] = useState<number>(0);
  const [statusInput, setStatusInput] = useState<string>("scheduled");
  const queryClient = useQueryClient();
  const [scorersA, setScorersA] = useState<{ playerName: string; minute: number }[]>([]);
  const [scorersB, setScorersB] = useState<{ playerName: string; minute: number }[]>([]);
  const [playersA, setPlayersA] = useState<Player[]>([]);
  const [playersB, setPlayersB] = useState<Player[]>([]);

  // --- FETCH TORNEI ---
  const { data: tournamentsRaw = [] } = useQuery<any[]>({
    queryKey: ["tournaments"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5001/api/tournaments");
      if (!res.ok) throw new Error("Failed to fetch tournaments");
      return res.json();
    },
  });

  const tournaments: Tournament[] = tournamentsRaw.map(t => ({
    id: String(t.id),
    name: String(t.name),
    startDate: t.start_date ? new Date(t.start_date) : new Date(),
    endDate: t.end_date ? new Date(t.end_date) : new Date(),
    status: String(t.status || "upcoming"),
  }));

  // --- FETCH SQUADRE ---
  const { data: teamsRaw = [] } = useQuery<any[]>({
    queryKey: ["teams", selectedTournament],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5001/api/tournaments/${selectedTournament}/teams`);
      if (!res.ok) throw new Error("Failed to fetch teams");
      return res.json();
    },
    enabled: !!selectedTournament,
  });

  const { data: allTeamsRaw = [] } = useQuery({
    queryKey: ["allTeams"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5001/api/teams");
      if (!res.ok) throw new Error("Failed to fetch teams");
      return res.json();
    },
  });

  const mapTeams = (arr: any[]): Team[] =>
    arr.map(t => ({
      id: String(t.id),
      name: String(t.name),
      tournamentId: String(t.tournament_id),
    }));

  const teams: Team[] = mapTeams(teamsRaw);
  const allTeams: Team[] = mapTeams(allTeamsRaw);

  // --- FETCH PARTITE ---
  const { data: matchesRaw = [] } = useQuery<any[]>({
    queryKey: ["matches", selectedTournament],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5001/api/matches/tournament/${selectedTournament}`);
      if (!res.ok) throw new Error("Failed to fetch matches");
      return res.json();
    },
    enabled: !!selectedTournament,
  });

 const matches: MatchWithDetails[] = matchesRaw.map(m => ({
    id: String(m.id),
    tournamentId: String(m.tournament_id ?? m.tournamentId ?? ""), // fallback se cambia il nome
    teamAId: String(m.teamAId ?? m.team1_id ?? ""), // controlla i due possibili nomi
    teamBId: String(m.teamBId ?? m.team2_id ?? ""),
    scoreA: Number(m.scoreA ?? m.score_team1 ?? 0),
    scoreB: Number(m.scoreB ?? m.score_team2 ?? 0),
    status: m.status ?? "scheduled",
    matchDate: m.match_date ? new Date(m.match_date) : new Date(),
    teamAName: m.teamAName ?? "Team A",
    teamBName: m.teamBName ?? "Team B",
}));

  // --- FETCH RANKINGS ---
  const { data: rankingsRaw = [] } = useQuery<any[]>({
    queryKey: ["rankings", selectedTournament],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5001/api/tournaments/${selectedTournament}/rankings`);
      if (!res.ok) throw new Error("Failed to fetch rankings");
      return res.json();
    },
    enabled: !!selectedTournament,
  });

  const rankings = rankingsRaw.map(r => ({
    ...r,
    points: r.points ?? 0,
    goalsFor: r.goalsFor ?? 0,
    goalsAgainst: r.goalsAgainst ?? 0,
  }));

  // --- FETCH TOP SCORERS ---
  const { data: topScorersRaw = [] } = useQuery<any[]>({
    queryKey: ["topScorers", selectedTournament],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5001/api/tournaments/${selectedTournament}/top-scorers`);
      if (!res.ok) throw new Error("Failed to fetch top scorers");
      return res.json();
    },
    enabled: !!selectedTournament,
  });

  const topScorers = topScorersRaw.map(s => ({
    ...s,
    goals: s.goals ?? 0,
  }));

  // --- ARRICCHISCE LE PARTITE ---
  // --- ARRICCHISCE LE PARTITE CON LOG ---
const enrichedMatches: MatchWithDetails[] = matches.map(match => {
  console.log("Raw match:", match); // log del match originale

  const teamA = allTeams.find(t => t.id === match.teamAId && t.tournamentId === match.tournamentId);
  const teamB = allTeams.find(t => t.id === match.teamBId && t.tournamentId === match.tournamentId);

  if (!teamA) console.warn(`Team A non trovato per match ${match.id}:`, match.teamAId);
  if (!teamB) console.warn(`Team B non trovato per match ${match.id}:`, match.teamBId);

  const enriched = {
    ...match,
    teamAId: match.teamAId || "",
    teamBId: match.teamBId || "",
    teamAName: teamA?.name ?? match.teamAName ?? "Team A",
    teamBName: teamB?.name ?? match.teamBName ?? "Team B",
    onClick: () => setLocation(`/matches/${match.id}`),
  };

  console.log("Enriched match:", enriched);
  return enriched;
});

  const totalMatches = matches.length;
  const totalGoals = matches.reduce((acc, m) => acc + (m.scoreA ?? 0) + (m.scoreB ?? 0), 0);
  const activeTournament = tournaments.find(t => t.id === selectedTournament);

  // --- CARICA GIOCATORI E MARCATORI QUANDO APRO IL MODAL ---
  useEffect(() => {
  if (!editingMatch) return;

  console.log("Apro modal per match:", editingMatch);

  const fetchPlayersAndScorers = async () => {
    try {
      // squadra A
      console.log(`Fetch giocatori squadra A: ${editingMatch.teamAId}`);
      const resA = await fetch(`http://localhost:5001/api/teams/${editingMatch.teamAId}/players`);
      const dataA: Player[] = resA.ok ? await resA.json() : [];
      console.log("Players A:", dataA);
      setPlayersA(dataA.map(p => ({ ...p, team_id: p.team_id })));

      // squadra B
      console.log(`Fetch giocatori squadra B: ${editingMatch.teamBId}`);
      const resB = await fetch(`http://localhost:5001/api/teams/${editingMatch.teamBId}/players`);
      const dataB: Player[] = resB.ok ? await resB.json() : [];
      console.log("Players B:", dataB);
      setPlayersB(dataB.map(p => ({ ...p, team_id: p.team_id })));

      // marcatori già salvati
      console.log("Marcatori iniziali:", editingMatch.scorersA, editingMatch.scorersB);
      setScorersA(editingMatch.scorersA || []);
      setScorersB(editingMatch.scorersB || []);
    } catch (error) {
      console.error("Errore nel fetch giocatori/marcatori:", error);
      setPlayersA([]);
      setPlayersB([]);
      setScorersA([]);
      setScorersB([]);
    }
  };

  fetchPlayersAndScorers();
}, [editingMatch]);

const addScorerFromList = (team: "A" | "B", player: Player) => {
  if (!editingMatch) return;

  const minute = new Date().getMinutes(); // oppure lascia un input dinamico se vuoi inserire manualmente
  if (team === "A") {
    setScorersA(prev => [...prev, { playerName: player.name, minute }]);
    setScoreAInput(prev => prev + 1); // incrementa punteggio automaticamente
  } else {
    setScorersB(prev => [...prev, { playerName: player.name, minute }]);
    setScoreBInput(prev => prev + 1);
  }
};

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* STATISTICHE */}
        <section>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Tournaments" value={tournaments.length} icon={Trophy} accentColor="primary" />
            <StatsCard title="Teams" value={allTeams.length} icon={Users} accentColor="chart-2" />
            <StatsCard title="Matches" value={totalMatches} icon={Calendar} accentColor="chart-3" />
            <StatsCard title="Goals Scored" value={totalGoals} icon={Target} accentColor="chart-4" />
          </div>
        </section>

        {/* TORNEI */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Tournaments</h2>
            <Select value={selectedTournament} onValueChange={setSelectedTournament}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select a tournament" />
              </SelectTrigger>
              <SelectContent>
                {tournaments.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.slice(0, 6).map(tournament => (
              <TournamentCard
                key={tournament.id}
                id={tournament.id}
                name={tournament.name}
                startDate={tournament.startDate}
                endDate={tournament.endDate}
                status={tournament.status as any}
                teamCount={allTeams.filter(t => t.tournamentId === tournament.id).length}
                matchCount={matches.filter(m => m.tournamentId === tournament.id).length}
                onClick={() => setSelectedTournament(tournament.id)}
              />
            ))}
          </div>
        </section>

        {/* DETTAGLI TORNEO SELEZIONATO */}
        {selectedTournament && activeTournament && (
          <>
            <section>
              <h2 className="text-3xl font-bold mb-6">Matches - {activeTournament.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrichedMatches.map(match => (
                  <MatchCard
                    key={match.id}
                    teamAName={match.teamAName || "Team A"}
                    teamBName={match.teamBName || "Team B"}
                    scoreA={match.scoreA}
                    scoreB={match.scoreB}
                    status={match.status as any}
                    matchDate={match.matchDate}
                    onClick={match.onClick}
                    onEdit={() => {
                    console.log("Editing match selezionato:", match);
                    console.log("teamAId:", match.teamAId, "teamBId:", match.teamBId);

                    if (!match.teamAId || !match.teamBId) {
                      console.error("Match non valido, squadre mancanti!");
                      return;
                    }

                    setEditingMatch(match);
                    setScoreAInput(match.scoreA ?? 0);
                    setScoreBInput(match.scoreB ?? 0);
                    setStatusInput(match.status);
                  }}
                  />
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {rankings.length > 0 && <RankingsTable rankings={rankings} />}
              {topScorers.length > 0 && <TopScorersLeaderboard scorers={topScorers} />}
            </div>
          </>
        )}

        {/* MODAL */}
        {editingMatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl p-6 w-[420px] max-h-[90vh] overflow-y-auto">
              <MatchEditForm
                match={{
                  id: editingMatch.id,
                  teamAId: editingMatch.teamAId,
                  teamBId: editingMatch.teamBId,  
                  teamAName: editingMatch.teamAName || "Team A",
                  teamBName: editingMatch.teamBName || "Team B",
                  scoreA: scoreAInput,
                  scoreB: scoreBInput,
                  status: statusInput,
                  matchDate: editingMatch.matchDate,
                  scorersA,
                  scorersB,
                }}

                onSave={async updated => {
                  await fetch(`http://localhost:5001/api/matches/${editingMatch.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      scoreTeam1: updated.scoreA,
                      scoreTeam2: updated.scoreB,
                      status: updated.status,
                      match_date: updated.matchDate,
                      scorersA: updated.scorersA,
                      scorersB: updated.scorersB,
                    }),
                  });
                  queryClient.invalidateQueries({ queryKey: ["matches", selectedTournament] });
                  setEditingMatch(null);
                }}
                onClose={() => setEditingMatch(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
