import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import Header from "@/components/Header";
import RankingsTable from "@/components/RankingsTable";
import type { Match } from "@shared/schema";
import { Clock, MapPin, Trophy, TrendingUp, Calendar } from "lucide-react";
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

  useEffect(() => {
    if (!matchId) return;

    async function fetchMatch() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/matches/${matchId}`);
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

  useEffect(() => {
    if (!match?.tournamentId) return;

    async function fetchRankings() {
      try {
        const res = await fetch(`/api/tournaments/${match!.tournamentId}/rankings`);
        if (!res.ok) throw new Error("Failed to fetch rankings");
        const data = await res.json();
        setRankings(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchRankings();
  }, [match?.tournamentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg font-display font-semibold text-slate-700 dark:text-slate-300">Loading match...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <Trophy className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-xl font-display font-semibold text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Trophy className="w-10 h-10 text-slate-600 dark:text-slate-400" />
          </div>
          <p className="text-xl font-display font-semibold text-slate-700 dark:text-slate-300">Match not found</p>
        </div>
      </div>
    );
  }

  const statusColors = {
    scheduled: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    live: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 animate-pulse",
    finished: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  };

  const statusColor = statusColors[match.status as keyof typeof statusColors] || statusColors.scheduled;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Status Badge */}
        <div className="flex justify-center animate-fadeIn">
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold font-display uppercase tracking-wider ${statusColor}`}>
            {match.status === 'live' && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
            {match.status}
          </span>
        </div>

        {/* Match Header - Teams vs Teams */}
        <div className="text-center space-y-4 animate-slideDown">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
            {match.teamAName} <span className="text-slate-400 dark:text-slate-600">vs</span> {match.teamBName}
          </h1>
        </div>

        {/* Score Card - Main Feature */}
        <div className="relative animate-scaleIn">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl blur-xl opacity-20"></div>
          <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-blue-200 dark:border-blue-800 rounded-3xl shadow-2xl overflow-hidden">
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative grid grid-cols-3 gap-4 p-8 sm:p-12">
              {/* Team A */}
              <div className="text-center space-y-4">
                <div className="w-20 h-20 sm:w-28 sm:h-28 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300">
                  <span className="text-3xl sm:text-5xl font-display font-bold text-white">
                    {match.teamAName?.charAt(0) || 'A'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-800 dark:text-slate-100">
                  {match.teamAName}
                </h2>
              </div>

              {/* Score */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl px-6 sm:px-10 py-4 sm:py-6 shadow-inner">
                  <div className="flex items-center gap-3 sm:gap-6">
                    <span className="text-5xl sm:text-7xl font-display font-extrabold bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                      {match.scoreA ?? "0"}
                    </span>
                    <span className="text-3xl sm:text-5xl font-bold text-slate-400 dark:text-slate-600">:</span>
                    <span className="text-5xl sm:text-7xl font-display font-extrabold bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                      {match.scoreB ?? "0"}
                    </span>
                  </div>
                </div>
                <Trophy className="w-6 h-6 text-amber-500" />
              </div>

              {/* Team B */}
              <div className="text-center space-y-4">
                <div className="w-20 h-20 sm:w-28 sm:h-28 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300">
                  <span className="text-3xl sm:text-5xl font-display font-bold text-white">
                    {match.teamBName?.charAt(0) || 'B'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-800 dark:text-slate-100">
                  {match.teamBName}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Match Info */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm sm:text-base animate-fadeIn">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl shadow-lg">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {format(new Date(match.matchDate), "PPP")}
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl shadow-lg">
            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {format(new Date(match.matchDate), "p")}
            </span>
          </div>
        </div>

        {/* Goal Scorers */}
        {((match.goalScorersA && match.goalScorersA.length > 0) ||
          (match.goalScorersB && match.goalScorersB.length > 0)) && (
          <div className="space-y-6 animate-slideUp">
            <h2 className="text-3xl font-display font-bold text-center bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              Goal Scorers
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Team A Goals */}
              <div className="group">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-xl font-display font-bold text-white">{match.teamAName?.charAt(0)}</span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-blue-900 dark:text-blue-100">
                      {match.teamAName}
                    </h3>
                  </div>
                  
                  {match.goalScorersA && match.goalScorersA.length > 0 ? (
                    <div className="space-y-3">
                      {match.goalScorersA.map((g, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between px-4 py-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200 group/item shadow-md"
                        >
                          <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                            {g.playerName}
                          </span>
                          <span className="text-sm font-bold px-3 py-1 bg-blue-500 text-white rounded-full shadow-sm">
                            {g.minute}'
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-center py-4 italic">No goals scored</p>
                  )}
                </div>
              </div>

              {/* Team B Goals */}
              <div className="group">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 backdrop-blur-sm border-2 border-purple-200 dark:border-purple-800 rounded-2xl p-6 shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-xl font-display font-bold text-white">{match.teamBName?.charAt(0)}</span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-purple-900 dark:text-purple-100">
                      {match.teamBName}
                    </h3>
                  </div>
                  
                  {match.goalScorersB && match.goalScorersB.length > 0 ? (
                    <div className="space-y-3">
                      {match.goalScorersB.map((g, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between px-4 py-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all duration-200 group/item shadow-md"
                        >
                          <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover/item:text-purple-600 dark:group-hover/item:text-purple-400 transition-colors">
                            {g.playerName}
                          </span>
                          <span className="text-sm font-bold px-3 py-1 bg-purple-500 text-white rounded-full shadow-sm">
                            {g.minute}'
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-center py-4 italic">No goals scored</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tournament Standings */}
        {rankings.length > 0 && (
          <div className="space-y-6 animate-slideUp">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-3">
                <TrendingUp className="w-8 h-8 text-amber-500" />
                <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                  Tournament Standings
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Current league position</p>
            </div>
            
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800">
              <RankingsTable 
                rankings={rankings} 
                highlightTeams={[match.teamAName, match.teamBName]} 
              />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.8s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
