import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import Header from "@/components/Header";
import MatchList from "@/components/MatchList";
import MatchEditForm from "@/components/MatchEditForm";
import RankingsTable from "@/components/RankingsTable";
import TopScorersLeaderboard from "@/components/TopScorersLeaderboard";
import StatsCard from "@/components/StatsCard";
import { Trophy, ArrowLeft, Users, Calendar, Target, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Match, Team } from "@shared/schema";
import type { Player } from "@/types";

interface MatchWithDetails extends Match {
  teamAName?: string;
  teamBName?: string;
  onClick?: () => void;
  scorersA?: { playerName: string; minute: number }[];
  scorersB?: { playerName: string; minute: number }[];
}

interface GroupRanking {
  name: string;
  rankings: {
    position: number;
    teamName: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
  }[];
}

export default function TournamentDetail() {
  const [, params] = useRoute("/tournaments/:id");
  const tournamentId = params?.id || "";
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
  const [statusFilter, setStatusFilter] = useState<"final" | "live" | "scheduled" | "all">("final");
  const [teamSearch, setTeamSearch] = useState<string>("");

  // Fetch torneo
  const { data: tournamentRaw } = useQuery({
    queryKey: ["tournament", tournamentId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5001/api/tournaments/${tournamentId}`);
      if (!res.ok) throw new Error("Failed to fetch tournament");
      return res.json();
    },
    enabled: !!tournamentId,
  });

  const tournament = tournamentRaw ? {
    id: String(tournamentRaw.id),
    name: String(tournamentRaw.name),
    startDate: tournamentRaw.start_date ? new Date(tournamentRaw.start_date) : new Date(),
    endDate: tournamentRaw.end_date ? new Date(tournamentRaw.end_date) : new Date(),
    status: String(tournamentRaw.status || "upcoming"),
    type: String(tournamentRaw.type || "league"),
  } : null;

  // Fetch teams
  const { data: allTeamsRaw = [] } = useQuery({
    queryKey: ["allTeams"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5001/api/teams");
      if (!res.ok) throw new Error("Failed to fetch teams");
      return res.json();
    },
  });

  const allTeams: Team[] = allTeamsRaw.map((t: any) => ({
    id: String(t.id),
    name: String(t.name),
    tournamentId: String(t.tournament_id),
  }));

  const teams = allTeams.filter(t => t.tournamentId === tournamentId);

  // Fetch partite
  const { data: matchesRaw = [] } = useQuery<any[]>({
    queryKey: ["matches", tournamentId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5001/api/matches/tournament/${tournamentId}`);
      if (!res.ok) throw new Error("Failed to fetch matches");
      return res.json();
    },
    enabled: !!tournamentId,
  });

  const matches: MatchWithDetails[] = matchesRaw.map(m => ({
    id: String(m.id),
    tournamentId: String(m.tournament_id ?? m.tournamentId ?? ""),
    teamAId: String(m.teamAId ?? m.team1_id ?? ""),
    teamBId: String(m.teamBId ?? m.team2_id ?? ""),
    scoreA: Number(m.scoreA ?? m.score_team1 ?? 0),
    scoreB: Number(m.scoreB ?? m.score_team2 ?? 0),
    status: m.status ?? "scheduled",
    matchDate: m.match_date ? new Date(m.match_date) : new Date(),
    teamAName: m.teamAName ?? "Team A",
    teamBName: m.teamBName ?? "Team B",
  }));

  // Fetch rankings
  const { data: rankingsRaw = [] } = useQuery<any[]>({
    queryKey: ["rankings", tournamentId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5001/api/tournaments/${tournamentId}/rankings`);
      if (!res.ok) throw new Error("Failed to fetch rankings");
      return res.json();
    },
    enabled: !!tournamentId,
  });

  const rankings = rankingsRaw.map(r => ({
    ...r,
    points: r.points ?? 0,
    goalsFor: r.goalsFor ?? 0,
    goalsAgainst: r.goalsAgainst ?? 0,
  }));

   const { data: structure } = useQuery({
    queryKey: ["structure", tournamentId],
    queryFn: async () => {
      if (!tournamentId) return null;
      const res = await fetch(`http://localhost:5001/api/tournaments/${tournamentId}/structure`);
      if (!res.ok) throw new Error("Errore nel caricamento struttura torneo");
      return res.json();
    },
    enabled: !!tournamentId,
  });

  // 🧩 Calcolo ranking dei gruppi lato frontend
  // 🧩 Calcolo ranking dei gruppi lato frontend
const groupRankings: GroupRanking[] = useMemo(() => {
  if (!structure?.groups || matches.length === 0) return [];

  return structure.groups.map((group: any) => {
    // Inizializza le squadre del gruppo
    const teamsObj: Record<string, any> = {};
    group.teams.forEach((team: any) => {
      teamsObj[team.id] = {
        teamName: team.name,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
      };
    });

    // Aggiorna statistiche match per match solo se non scheduled
    matches.forEach((m) => {
      if (m.status === "scheduled") return; // IGNORA match non giocati

      const t1 = teamsObj[m.teamAId];
      const t2 = teamsObj[m.teamBId];
      if (!t1 || !t2) return;

      const score1 = m.scoreA ?? 0;
      const score2 = m.scoreB ?? 0;

      t1.played += 1;
      t2.played += 1;
      t1.goalsFor += score1;
      t1.goalsAgainst += score2;
      t2.goalsFor += score2;
      t2.goalsAgainst += score1;

      if (score1 > score2) {
        t1.won += 1;
        t1.points += 3;
        t2.lost += 1;
      } else if (score1 < score2) {
        t2.won += 1;
        t2.points += 3;
        t1.lost += 1;
      } else {
        t1.drawn += 1;
        t1.points += 1;
        t2.drawn += 1;
        t2.points += 1;
      }
    });

    // Converte in array ordinato come backend
    const rankings = Object.values(teamsObj)
      .map(t => ({ ...t, goalDifference: t.goalsFor - t.goalsAgainst }))
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
      })
      .map((t, idx) => ({ position: idx + 1, ...t }));

    return { name: group.name, rankings };
  });
}, [structure, matches]);


  // Fetch top scorers
  const { data: topScorersRaw = [] } = useQuery<any[]>({
    queryKey: ["topScorers", tournamentId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5001/api/tournaments/${tournamentId}/top-scorers`);
      if (!res.ok) throw new Error("Failed to fetch top scorers");
      return res.json();
    },
    enabled: !!tournamentId,
  });

  const topScorers = topScorersRaw.map(s => ({
    ...s,
    goals: s.goals ?? 0,
  }));

  

  // Arricchisce le partite
  const enrichedMatches: MatchWithDetails[] = matches.map(match => {
    const teamA = allTeams.find(t => t.id === match.teamAId && t.tournamentId === match.tournamentId);
    const teamB = allTeams.find(t => t.id === match.teamBId && t.tournamentId === match.tournamentId);

    return {
      ...match,
      teamAId: match.teamAId || "",
      teamBId: match.teamBId || "",
      teamAName: teamA?.name ?? match.teamAName ?? "Team A",
      teamBName: teamB?.name ?? match.teamBName ?? "Team B",
      onClick: () => setLocation(`/matches/${match.id}`),
    };
  });

  // Filtra i match in base a status e ricerca squadra
  const filteredMatches = useMemo(() => {
    let filtered = enrichedMatches;

    // Filtro per status
    if (statusFilter !== "all") {
      filtered = filtered.filter(m => m.status === statusFilter);
    }

    // Filtro per ricerca squadra
    if (teamSearch.trim()) {
      const searchLower = teamSearch.toLowerCase().trim();
      filtered = filtered.filter(m => 
        m.teamAName?.toLowerCase().includes(searchLower) ||
        m.teamBName?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [enrichedMatches, statusFilter, teamSearch]);

  const totalMatches = matches.length;
  const totalGoals = matches.reduce((acc, m) => acc + (m.scoreA ?? 0) + (m.scoreB ?? 0), 0);

  // Carica giocatori e marcatori quando apro il modal
  useEffect(() => {
    if (!editingMatch) return;

    const fetchPlayersAndScorers = async () => {
      try {
        const resA = await fetch(`http://localhost:5001/api/teams/${editingMatch.teamAId}/players`);
        const dataA: Player[] = resA.ok ? await resA.json() : [];
        setPlayersA(dataA.map(p => ({ ...p, team_id: p.team_id })));

        const resB = await fetch(`http://localhost:5001/api/teams/${editingMatch.teamBId}/players`);
        const dataB: Player[] = resB.ok ? await resB.json() : [];
        setPlayersB(dataB.map(p => ({ ...p, team_id: p.team_id })));

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

  if (!tournament) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-center text-muted-foreground">Caricamento torneo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero del torneo */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
            className="mb-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna ai tornei
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-5xl font-display font-bold uppercase tracking-tight" data-testid="text-tournament-name">
                {tournament.name}
              </h1>
              <p className="text-white/80 font-sans text-lg mt-2">
                {tournament.startDate.toLocaleDateString()} - {tournament.endDate.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Statistiche */}
        <section>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatsCard title="Squadre" value={teams.length} icon={Users} accentColor="chart-2" />
            <StatsCard title="Partite" value={totalMatches} icon={Calendar} accentColor="chart-3" />
            <StatsCard title="Goal Segnati" value={totalGoals} icon={Target} accentColor="chart-4" />
          </div>
        </section>

        {/* Partite */}
        <section>
          <h2 className="text-4xl font-display font-bold mb-6 uppercase tracking-tight" data-testid="heading-matches">Partite</h2>

          {/* Filtri e Ricerca */}
          <div className="mb-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            {/* Ricerca squadra */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Cerca Squadra
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Digita il nome della squadra..."
                  value={teamSearch}
                  onChange={(e) => setTeamSearch(e.target.value)}
                  className="pl-12 h-12 text-base bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-emerald-500"
                  data-testid="input-team-search"
                />
              </div>
            </div>

            {/* Filtri status */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Filtra per Stato
              </label>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    statusFilter === "all"
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                  data-testid="button-filter-all"
                >
                  Tutte
                </button>
                <button
                  onClick={() => setStatusFilter("final")}
                  className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    statusFilter === "final"
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                  data-testid="button-filter-final"
                >
                  Finale
                </button>
                <button
                  onClick={() => setStatusFilter("live")}
                  className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    statusFilter === "live"
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                  data-testid="button-filter-live"
                >
                  Live
                </button>
                <button
                  onClick={() => setStatusFilter("scheduled")}
                  className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    statusFilter === "scheduled"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                  data-testid="button-filter-scheduled"
                >
                  Programmata
                </button>
              </div>
            </div>
          </div>

          {tournament?.type === "groupKnockout" && (
            <button
              onClick={async () => {
                if (!tournamentId) return;
                const confirmGen = confirm("Vuoi generare i gironi per questo torneo?");
                if (!confirmGen) return;

                try {
                  const res = await fetch(
                    `http://localhost:5001/api/tournaments/${tournamentId}/generate-structure`,
                    { method: "POST" }
                  );
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error || "Errore durante la generazione");
                  alert("Gironi generati con successo!");

                  queryClient.invalidateQueries({ queryKey: ["matches", tournamentId] });
                  queryClient.invalidateQueries({ queryKey: ["rankings", tournamentId] });
                  queryClient.invalidateQueries({ queryKey: ["structure", tournamentId] });
                } catch (err) {
                  console.error("❌ Errore generazione gironi:", err);
                  alert("Errore durante la generazione dei gironi");
                }
              }}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              data-testid="button-generate-groups"
            >
              Genera Gironi
            </button>
          )}

          <MatchList
            matches={filteredMatches.map(match => ({
              id: match.id,
              teamAName: match.teamAName || "Team A",
              teamBName: match.teamBName || "Team B",
              scoreA: match.scoreA,
              scoreB: match.scoreB,
              status: match.status as any,
              matchDate: match.matchDate,
              onClick: match.onClick,
              onEdit: () => {
                if (!match.teamAId || !match.teamBId) return;
                setEditingMatch(match);
                setScoreAInput(match.scoreA ?? 0);
                setScoreBInput(match.scoreB ?? 0);
                setStatusInput(match.status);
              },
            }))}
          />
        </section>

        {/* Classifiche e Statistiche - Layout Orizzontale per League */}
        {tournament?.type === "league" && (rankings.length > 0 || topScorers.length > 0) && (
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Classifica */}
              {rankings.length > 0 && (
                <div data-testid="heading-rankings">
                  <RankingsTable rankings={rankings} />
                </div>
              )}

              {/* Capocannonieri */}
              {topScorers.length > 0 && (
                <div data-testid="heading-top-scorers">
                  <TopScorersLeaderboard scorers={topScorers} />
                </div>
              )}
            </div>
          </section>
        )}

        {/* 🧩 Classifiche Gironi */}
        {tournament?.type === "groupKnockout" && groupRankings?.length > 0 && (
          <section>
            <h2 className="text-4xl font-display font-bold mb-6 uppercase tracking-tight">Classifiche Gironi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {groupRankings.map((group) => (
                <div key={group.name} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="bg-slate-900 dark:bg-slate-100 px-6 py-4">
                    <h3 className="text-white dark:text-slate-900 font-sans font-bold text-lg text-center">
                      {group.name}
                    </h3>
                  </div>
                  <div className="p-5">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800">
                          <th className="text-left text-xs font-semibold text-slate-600 dark:text-slate-400 pb-3 pr-2">#</th>
                          <th className="text-left text-xs font-semibold text-slate-600 dark:text-slate-400 pb-3">Squadra</th>
                          <th className="text-center text-xs font-semibold text-slate-600 dark:text-slate-400 pb-3 px-1">G</th>
                          <th className="text-center text-xs font-semibold text-slate-600 dark:text-slate-400 pb-3 px-1">V</th>
                          <th className="text-center text-xs font-semibold text-slate-600 dark:text-slate-400 pb-3 px-1">P</th>
                          <th className="text-center text-xs font-semibold text-slate-600 dark:text-slate-400 pb-3 px-1">S</th>
                          <th className="text-center text-xs font-semibold text-slate-600 dark:text-slate-400 pb-3 pl-1">Pti</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.rankings.map((team, idx) => (
                          <tr 
                            key={idx}
                            className={`border-b border-slate-100 dark:border-slate-800/50 last:border-0 ${
                              idx === 0 ? "bg-emerald-50/50 dark:bg-emerald-900/10" : ""
                            }`}
                          >
                            <td className="py-3 pr-2">
                              <span className={`font-bold text-sm ${
                                idx === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-500"
                              }`}>
                                {team.position}
                              </span>
                            </td>
                            <td className="py-3">
                              <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                                {team.teamName}
                              </span>
                            </td>
                            <td className="text-center py-3 px-1 text-sm text-slate-700 dark:text-slate-300">{team.played}</td>
                            <td className="text-center py-3 px-1 text-sm text-slate-700 dark:text-slate-300">{team.won}</td>
                            <td className="text-center py-3 px-1 text-sm text-slate-700 dark:text-slate-300">{team.drawn}</td>
                            <td className="text-center py-3 px-1 text-sm text-slate-700 dark:text-slate-300">{team.lost}</td>
                            <td className="text-center py-3 pl-1">
                              <span className="inline-flex items-center justify-center min-w-[32px] h-7 px-2 bg-emerald-600 text-white font-bold text-sm rounded-md">
                                {team.points}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Capocannonieri per Tornei a Gironi */}
        {tournament?.type === "groupKnockout" && topScorers.length > 0 && (
          <section data-testid="heading-top-scorers">
            <TopScorersLeaderboard scorers={topScorers} />
          </section>
        )}

        {/* Modal */}
        {editingMatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 w-full max-w-xl max-h-[95vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
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
                    await queryClient.invalidateQueries({ queryKey: ["matches", tournamentId] });
                    await queryClient.invalidateQueries({ queryKey: ["rankings", tournamentId] });
                    await queryClient.invalidateQueries({ queryKey: ["structure", tournamentId] });
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
