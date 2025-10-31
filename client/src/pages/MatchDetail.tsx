import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import Header from "@/components/Header";
import RankingsTable from "@/components/RankingsTable";
import TopScorersLeaderboard from "@/components/TopScorersLeaderboard";
import type { Match } from "@shared/schema";
import { Clock, Calendar, TrendingUp, Target } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface TopScorer {
  playerName: string;
  teamName: string;
  goals: number;
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
  const [topScorers, setTopScorers] = useState<TopScorer[]>([]);
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

    async function fetchTopScorers() {
      try {
        const res = await fetch(`/api/tournaments/${match!.tournamentId}/top-scorers`);
        if (!res.ok) throw new Error("Failed to fetch top scorers");
        const data = await res.json();
        setTopScorers(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchRankings();
    fetchTopScorers();
  }, [match?.tournamentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-muted-foreground">Loading match...</p>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-lg font-semibold text-destructive">{error || "Match not found"}</p>
        </div>
      </div>
    );
  }

  const statusConfig = {
    scheduled: { variant: "secondary" as const, label: "Scheduled" },
    live: { variant: "destructive" as const, label: "Live" },
    finished: { variant: "default" as const, label: "Finished" },
  };

  const status = statusConfig[match.status as keyof typeof statusConfig] || statusConfig.scheduled;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Match Header */}
        <div className="text-center space-y-3">
          <Badge variant={status.variant} className="uppercase tracking-wide" data-testid="badge-match-status">
            {match.status === 'live' && <span className="w-1.5 h-1.5 bg-current rounded-full mr-1.5 animate-pulse"></span>}
            {status.label}
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-foreground tracking-tight uppercase" data-testid="text-match-title">
            {match.teamAName} <span className="text-muted-foreground font-sans normal-case font-normal text-2xl sm:text-3xl md:text-4xl">vs</span> {match.teamBName}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5" data-testid="text-match-date">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(match.matchDate), "PPP")}</span>
            </div>
            <div className="flex items-center gap-1.5" data-testid="text-match-time">
              <Clock className="w-4 h-4" />
              <span>{format(new Date(match.matchDate), "p")}</span>
            </div>
          </div>
        </div>

        {/* Score Card */}
        <Card className="overflow-hidden" data-testid="card-match-score">
          <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-3 gap-4 items-center">
              {/* Team A */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-primary/10 rounded-lg flex items-center justify-center" data-testid="team-a-avatar">
                  <span className="text-2xl sm:text-3xl font-display font-bold text-primary uppercase">
                    {match.teamAName?.charAt(0) || 'A'}
                  </span>
                </div>
                <p className="text-sm sm:text-base font-serif font-bold text-foreground" data-testid="text-team-a-name">
                  {match.teamAName}
                </p>
              </div>

              {/* Score */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-4">
                  <span className="text-6xl sm:text-7xl md:text-8xl font-display font-bold text-foreground tabular-nums" data-testid="text-score-a">
                    {match.scoreA ?? "0"}
                  </span>
                  <span className="text-3xl sm:text-4xl font-bold text-muted-foreground">-</span>
                  <span className="text-6xl sm:text-7xl md:text-8xl font-display font-bold text-foreground tabular-nums" data-testid="text-score-b">
                    {match.scoreB ?? "0"}
                  </span>
                </div>
              </div>

              {/* Team B */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-primary/10 rounded-lg flex items-center justify-center" data-testid="team-b-avatar">
                  <span className="text-2xl sm:text-3xl font-display font-bold text-primary uppercase">
                    {match.teamBName?.charAt(0) || 'B'}
                  </span>
                </div>
                <p className="text-sm sm:text-base font-serif font-bold text-foreground" data-testid="text-team-b-name">
                  {match.teamBName}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goal Scorers */}
        {((match.goalScorersA && match.goalScorersA.length > 0) ||
          (match.goalScorersB && match.goalScorersB.length > 0)) && (
          <div className="space-y-4" data-testid="section-goal-scorers">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground uppercase tracking-wide">Goal Scorers</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Team A Goals */}
              <Card data-testid="card-goals-team-a">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                      <span className="text-sm font-display font-bold text-primary uppercase">{match.teamAName?.charAt(0)}</span>
                    </div>
                    <h3 className="text-base font-serif font-bold text-foreground">
                      {match.teamAName}
                    </h3>
                  </div>
                  
                  {match.goalScorersA && match.goalScorersA.length > 0 ? (
                    <div className="space-y-2">
                      {match.goalScorersA.map((g, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-2 border-b last:border-0"
                          data-testid={`goal-scorer-a-${idx}`}
                        >
                          <span className="text-sm font-medium text-foreground">
                            {g.playerName}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {g.minute}'
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-2">No goals</p>
                  )}
                </CardContent>
              </Card>

              {/* Team B Goals */}
              <Card data-testid="card-goals-team-b">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                      <span className="text-sm font-display font-bold text-primary uppercase">{match.teamBName?.charAt(0)}</span>
                    </div>
                    <h3 className="text-base font-serif font-bold text-foreground">
                      {match.teamBName}
                    </h3>
                  </div>
                  
                  {match.goalScorersB && match.goalScorersB.length > 0 ? (
                    <div className="space-y-2">
                      {match.goalScorersB.map((g, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-2 border-b last:border-0"
                          data-testid={`goal-scorer-b-${idx}`}
                        >
                          <span className="text-sm font-medium text-foreground">
                            {g.playerName}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {g.minute}'
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-2">No goals</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Tournament Standings */}
        {rankings.length > 0 && (
          <div className="space-y-4" data-testid="section-standings">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground uppercase tracking-wide">Tournament Standings</h2>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <RankingsTable 
                  rankings={rankings} 
                  highlightTeams={[match.teamAName, match.teamBName]} 
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Top Scorers */}
        {topScorers.length > 0 && (
          <div className="space-y-4" data-testid="section-top-scorers">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground uppercase tracking-wide">Top Scorers</h2>
            </div>
            
            <TopScorersLeaderboard scorers={topScorers} />
          </div>
        )}
      </div>
    </div>
  );
}
