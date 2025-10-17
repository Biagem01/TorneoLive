import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter"; // ← hook corretto per Wouter
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TournamentCard from "@/components/TournamentCard";
import MatchCard from "@/components/MatchCard";
import RankingsTable from "@/components/RankingsTable";
import TopScorersLeaderboard from "@/components/TopScorersLeaderboard";
import StatsCard from "@/components/StatsCard";
import { Trophy, Users, Calendar, Target } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Tournament, Match, Team } from "@shared/schema";

interface MatchWithDetails extends Match {
  teamAName?: string;
  teamBName?: string;
  onClick?: () => void;
}

export default function HomeReal() {
  const [selectedTournament, setSelectedTournament] = useState<string>("");
  const [, setLocation] = useLocation(); // ← hook Wouter

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

  const allTeams: Team[] = (allTeamsRaw as any[]).map(t => ({
    id: String(t.id),
    name: String(t.name),
    tournamentId: String(t.tournament_id),
  }));

  const teams: Team[] = teamsRaw.map(t => ({
    id: String(t.id),
    name: String(t.name),
    tournamentId: String(t.tournament_id),
  }));

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
    tournamentId: String(m.tournament_id),
    teamAId: String(m.team1_id),
    teamBId: String(m.team2_id),
    scoreA: Number(m.scoreA ?? m.score_team1) || 0,
    scoreB: Number(m.scoreB ?? m.score_team2) || 0,
    status: "scheduled",
    matchDate: m.match_date ? new Date(m.match_date) : new Date(),
    teamAName: m.teamAName,
    teamBName: m.teamBName,
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
  const enrichedMatches: MatchWithDetails[] = matches.map(match => {
    const teamA = allTeams.find(
      t => t.id === match.teamAId && t.tournamentId === match.tournamentId
    );
    const teamB = allTeams.find(
      t => t.id === match.teamBId && t.tournamentId === match.tournamentId
    );

    return {
      ...match,
      teamAName: teamA?.name ?? match.teamAName ?? "Team A",
      teamBName: teamB?.name ?? match.teamBName ?? "Team B",
      onClick: () => setLocation(`/matches/${match.id}`), // ← Wouter corretto
    };
  });

  const totalMatches = matches.length;
  const totalGoals = matches.reduce((acc, m) => acc + (m.scoreA ?? 0) + (m.scoreB ?? 0), 0);
  const activeTournament = tournaments.find(t => t.id === selectedTournament);

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        <section>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Tournaments" value={tournaments.length} icon={Trophy} accentColor="primary" />
            <StatsCard title="Teams" value={allTeams.length} icon={Users} accentColor="chart-2" />
            <StatsCard title="Matches" value={totalMatches} icon={Calendar} accentColor="chart-3" />
            <StatsCard title="Goals Scored" value={totalGoals} icon={Target} accentColor="chart-4" />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Tournaments</h2>
            <Select value={selectedTournament} onValueChange={setSelectedTournament}>
              <SelectTrigger className="w-64" data-testid="select-tournament">
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

        {selectedTournament && activeTournament && (
          <>
            <section>
              <h2 className="text-3xl font-bold mb-6">Matches - {activeTournament.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrichedMatches.map(match => (
                  <MatchCard
                    key={match.id}
                    teamA={match.teamAName || "Team A"}
                    teamB={match.teamBName || "Team B"}
                    scoreA={match.scoreA}
                    scoreB={match.scoreB}
                    status={match.status as any}
                    date={match.matchDate}
                    onClick={match.onClick} // ← ora sicuro
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
      </div>
    </div>
  );
}
