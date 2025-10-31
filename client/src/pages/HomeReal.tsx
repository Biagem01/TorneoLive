import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TournamentList from "@/components/TournamentList";
import StatsCard from "@/components/StatsCard";
import { Trophy, Users } from "lucide-react";
import type { Tournament, Team } from "@shared/schema";




export default function HomeReal() {
  const [, setLocation] = useLocation();

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
    type: String(t.type || "league"),
  }));

  // --- FETCH SQUADRE ---
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


  return (
    <div className="min-h-screen">
      <Header />
      <Hero />

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* STATISTICHE */}
        <section>
          <div className="grid grid-cols-2 gap-4">
            <StatsCard title="Tournaments" value={tournaments.length} icon={Trophy} accentColor="primary" />
            <StatsCard title="Teams" value={allTeams.length} icon={Users} accentColor="chart-2" />
          </div>
        </section>

        {/* TORNEI */}
        <section>
          <h2 className="text-4xl font-display font-bold mb-6 uppercase tracking-tight" data-testid="heading-tournaments">Tournaments</h2>
          <TournamentList
            tournaments={tournaments.map(tournament => ({
              id: tournament.id,
              name: tournament.name,
              startDate: tournament.startDate,
              endDate: tournament.endDate,
              status: tournament.status as any,
              teamCount: allTeams.filter(t => t.tournamentId === tournament.id).length,
              matchCount: 0,
            }))}
            onSelectTournament={(id) => setLocation(`/tournaments/${id}`)}
          />
        </section>
      </div>
    </div>
  );
}
