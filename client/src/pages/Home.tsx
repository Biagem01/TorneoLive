import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TournamentCard from "@/components/TournamentCard";
import MatchCard from "@/components/MatchCard";
import RankingsTable from "@/components/RankingsTable";
import TopScorersLeaderboard from "@/components/TopScorersLeaderboard";
import StatsCard from "@/components/StatsCard";
import { Trophy, Users, Calendar, Target } from "lucide-react";

export default function Home() {
  const mockTournaments = [
    {
      id: "1",
      name: "Summer League 2024",
      startDate: new Date("2024-06-01"),
      endDate: new Date("2024-07-15"),
      status: "live" as const,
      teamCount: 12,
      matchCount: 24,
    },
    {
      id: "2",
      name: "Champions Cup",
      startDate: new Date("2024-08-10"),
      endDate: new Date("2024-09-20"),
      status: "upcoming" as const,
      teamCount: 8,
      matchCount: 16,
    },
    {
      id: "3",
      name: "Spring Classic",
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-04-30"),
      status: "completed" as const,
      teamCount: 16,
      matchCount: 32,
    },
  ];

  const mockMatches = [
    {
      teamA: "FC Barcelona",
      teamB: "Real Madrid",
      scoreA: 3,
      scoreB: 2,
      status: "live" as const,
      date: new Date(),
      goalScorersA: [
        { playerName: "Messi", minute: 23 },
        { playerName: "Suarez", minute: 45 },
        { playerName: "Neymar", minute: 78 },
      ],
      goalScorersB: [
        { playerName: "Ronaldo", minute: 15 },
        { playerName: "Benzema", minute: 89 },
      ],
    },
    {
      teamA: "Manchester United",
      teamB: "Liverpool",
      scoreA: null,
      scoreB: null,
      status: "scheduled" as const,
      date: new Date(Date.now() + 86400000 * 3),
    },
  ];

  const mockRankings = [
    {
      position: 1,
      teamName: "FC Barcelona",
      played: 10,
      won: 8,
      drawn: 1,
      lost: 1,
      goalsFor: 28,
      goalsAgainst: 10,
      goalDifference: 18,
      points: 25,
    },
    {
      position: 2,
      teamName: "Real Madrid",
      played: 10,
      won: 7,
      drawn: 2,
      lost: 1,
      goalsFor: 24,
      goalsAgainst: 12,
      goalDifference: 12,
      points: 23,
    },
    {
      position: 3,
      teamName: "Atletico Madrid",
      played: 10,
      won: 6,
      drawn: 3,
      lost: 1,
      goalsFor: 20,
      goalsAgainst: 10,
      goalDifference: 10,
      points: 21,
    },
    {
      position: 4,
      teamName: "Sevilla FC",
      played: 10,
      won: 5,
      drawn: 3,
      lost: 2,
      goalsFor: 18,
      goalsAgainst: 14,
      goalDifference: 4,
      points: 18,
    },
    {
      position: 5,
      teamName: "Valencia CF",
      played: 10,
      won: 4,
      drawn: 2,
      lost: 4,
      goalsFor: 15,
      goalsAgainst: 16,
      goalDifference: -1,
      points: 14,
    },
  ];

  const mockScorers = [
    { playerName: "Lionel Messi", teamName: "FC Barcelona", goals: 18 },
    { playerName: "Cristiano Ronaldo", teamName: "Real Madrid", goals: 16 },
    { playerName: "Luis Suarez", teamName: "FC Barcelona", goals: 14 },
    { playerName: "Karim Benzema", teamName: "Real Madrid", goals: 12 },
    { playerName: "Antoine Griezmann", teamName: "Atletico Madrid", goals: 11 },
    { playerName: "Sergio Aguero", teamName: "Sevilla FC", goals: 10 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        <section>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard title="Tornei" value={12} icon={Trophy} accentColor="primary" />
            <StatsCard title="Squadre" value={48} icon={Users} accentColor="chart-2" />
            <StatsCard title="Partite" value={156} icon={Calendar} accentColor="chart-3" />
            <StatsCard title="Goal Segnati" value={423} icon={Target} accentColor="chart-4" />
          </div>
        </section>

        <section>
          <div className="mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-3">
              Tornei Attivi
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Gestisci e monitora tutti i tuoi tornei in corso</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                {...tournament}
                onClick={() => console.log("Tournament clicked:", tournament.id)}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-3">
              Partite Recenti
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Risultati e match in programma</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockMatches.map((match, index) => (
              <MatchCard key={index} {...match} />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RankingsTable rankings={mockRankings} />
          <TopScorersLeaderboard scorers={mockScorers} />
        </div>
      </div>
    </div>
  );
}
