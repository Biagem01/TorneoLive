import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import Header from "@/components/Header";
import RankingsTable from "@/components/RankingsTable";
import type { Match } from "@shared/schema";
import { Clock } from "lucide-react";
import { format } from "date-fns";

interface GoalScorer {
  playerName: string;
  minute: number;
}

interface TeamRanking {
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
}

export default function MatchDetail() {
  const [match, setMatch] = useState<
    (Match & {
      teamAName?: string;
      teamBName?: string;
      goalScorersA?: GoalScorer[];
      goalScorersB?: GoalScorer[];
      tournamentId?: string;
    }) | null
  >(null);
  const [rankings, setRankings] = useState<TeamRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isMatch, params] = useRoute("/matches/:id");
  const matchId = params?.id;

  // --- Fetch match ---
  useEffect(() => {
    if (!matchId) return;

    async function fetchMatch() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5001/api/matches/${matchId}`);
        if (!res.ok) throw new Error("Failed to fetch match");
        const data = await res.json();

        setMatch({
          ...data,
          matchDate: data.matchDate ? new Date(data.matchDate) : new Date(),
        });
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch match");
      } finally {
        setLoading(false);
      }
    }

    fetchMatch();
  }, [matchId]);

  // --- Fetch rankings ---
  useEffect(() => {
    if (!match?.tournamentId) return;

    async function fetchRankings() {
      try {
        const res = await fetch(`http://localhost:5001/api/tournaments/${match!.tournamentId}/rankings`);
        if (!res.ok) throw new Error("Failed to fetch rankings");
        const data = await res.json();
        setRankings(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchRankings();
  }, [match?.tournamentId]);

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!match) return <p className="text-center mt-10 text-lg">Match not found</p>;

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-background-dark dark:text-foreground-dark transition-colors">
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        <h1 className="text-4xl font-bold text-center">{match.teamAName} vs {match.teamBName}</h1>

        {/* Score Card */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-card p-6 rounded-xl shadow-md dark:bg-card-dark">
          <div className="text-lg font-semibold">{match.teamAName}</div>
          <div className="text-3xl font-extrabold px-8 py-3 my-4 md:my-0 bg-score rounded-full dark:bg-score-dark">
            {match.scoreA ?? "-"} : {match.scoreB ?? "-"}
          </div>
          <div className="text-lg font-semibold">{match.teamBName}</div>
        </div>

        {/* Match Date */}
        <div className="flex items-center gap-2 text-sm text-muted justify-center mb-8">
          <Clock className="w-4 h-4" />
          <span>{format(new Date(match.matchDate), "PPP, p")}</span>
        </div>

        {/* Goal Scorers */}
        {((match.goalScorersA && match.goalScorersA.length > 0) ||
          (match.goalScorersB && match.goalScorersB.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Team A */}
            <div className="bg-card p-6 rounded-xl shadow-sm dark:bg-card-dark">
              <h2 className="font-semibold text-xl mb-4 text-center text-blue-600 dark:text-blue-400">{match.teamAName} Goals</h2>
              {match.goalScorersA?.map((g, idx) => (
                <p
                  key={idx}
                  className="flex justify-between px-3 py-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition mb-1"
                >
                  <span>{g.playerName}</span>
                  <span className="font-bold text-blue-500 dark:text-blue-400">{g.minute}'</span>
                </p>
              ))}
            </div>

            {/* Team B */}
            <div className="bg-card p-6 rounded-xl shadow-sm dark:bg-card-dark">
              <h2 className="font-semibold text-xl mb-4 text-center text-red-600 dark:text-red-400">{match.teamBName} Goals</h2>
              {match.goalScorersB?.map((g, idx) => (
                <p
                  key={idx}
                  className="flex justify-between px-3 py-2 rounded hover:bg-red-50 dark:hover:bg-red-900 transition mb-1"
                >
                  <span>{g.playerName}</span>
                  <span className="font-bold text-red-500 dark:text-red-400">{g.minute}'</span>
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Rankings Table */}
        {rankings.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4 text-center">Tournament Standings</h2>
            <RankingsTable 
              rankings={rankings} 
              highlightTeams={[match.teamAName, match.teamBName]} 
            />
            
          </div>
        )}
      </div>
    </div>
  );
}
