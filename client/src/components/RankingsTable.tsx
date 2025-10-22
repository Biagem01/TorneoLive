import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Trophy, TrendingUp, Award, Medal } from "lucide-react";

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

interface RankingsTableProps {
  rankings: TeamRanking[];
  highlightTeams?: (string | undefined)[];
}

export default function RankingsTable({ rankings, highlightTeams = [] }: RankingsTableProps) {
  const getMedalConfig = (position: number) => {
    if (position === 1) return { 
      bg: "bg-gradient-to-br from-yellow-400 to-yellow-600", 
      text: "text-yellow-600 dark:text-yellow-400", 
      glow: "shadow-yellow-500/40",
      icon: <Trophy className="w-4 h-4 text-white" />
    };
    if (position === 2) return { 
      bg: "bg-gradient-to-br from-slate-300 to-slate-500", 
      text: "text-slate-500 dark:text-slate-400", 
      glow: "shadow-slate-500/40",
      icon: <Award className="w-4 h-4 text-white" />
    };
    if (position === 3) return { 
      bg: "bg-gradient-to-br from-amber-600 to-amber-800", 
      text: "text-amber-600 dark:text-amber-400", 
      glow: "shadow-amber-500/40",
      icon: <Medal className="w-4 h-4 text-white" />
    };
    return { 
      bg: "bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-800", 
      text: "text-slate-600 dark:text-slate-400", 
      glow: "",
      icon: null
    };
  };

  return (
    <Card className="p-0 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 shadow-xl overflow-hidden" data-testid="card-rankings">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-xl">
            <Trophy className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Classifica</h2>
            <p className="text-emerald-100 text-sm font-medium">Posizioni e statistiche delle squadre</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900/50">
              <TableHead className="w-16 font-bold text-slate-700 dark:text-slate-300">#</TableHead>
              <TableHead className="font-bold text-slate-700 dark:text-slate-300">Squadra</TableHead>
              <TableHead className="text-center font-bold text-slate-700 dark:text-slate-300">G</TableHead>
              <TableHead className="text-center font-bold text-slate-700 dark:text-slate-300">V</TableHead>
              <TableHead className="text-center font-bold text-slate-700 dark:text-slate-300">P</TableHead>
              <TableHead className="text-center font-bold text-slate-700 dark:text-slate-300">S</TableHead>
              <TableHead className="text-center font-bold text-slate-700 dark:text-slate-300">GF</TableHead>
              <TableHead className="text-center font-bold text-slate-700 dark:text-slate-300">GS</TableHead>
              <TableHead className="text-center font-bold text-slate-700 dark:text-slate-300">DR</TableHead>
              <TableHead className="text-center font-black text-lg text-emerald-600 dark:text-emerald-400">Pti</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankings.map((team) => {
              const isHighlighted = highlightTeams.includes(team.teamName);
              const medalConfig = getMedalConfig(team.position);
              const isTopThree = team.position <= 3;
              
              return (
                <TableRow
                  key={team.position}
                  className={`border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all duration-300 ${
                    isHighlighted ? "bg-emerald-50 dark:bg-emerald-500/10 border-l-4 border-l-emerald-500" : ""
                  } ${isTopThree ? "bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/50" : ""}`}
                  data-testid={`row-team-${team.position}`}
                >
                  <TableCell className="py-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${medalConfig.bg} flex items-center justify-center font-black text-sm text-white shadow-xl ${medalConfig.glow} transition-transform hover:scale-110`}
                      data-testid={`badge-position-${team.position}`}
                    >
                      {medalConfig.icon || team.position}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-slate-900 dark:text-white" data-testid={`text-team-${team.position}`}>
                    <div className="flex items-center gap-3">
                      {isTopThree && (
                        <TrendingUp className={`w-5 h-5 ${medalConfig.text}`} />
                      )}
                      <span className={isTopThree ? medalConfig.text : ""}>{team.teamName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-mono font-semibold text-slate-700 dark:text-slate-300" data-testid={`text-played-${team.position}`}>
                    {team.played}
                  </TableCell>
                  <TableCell className="text-center font-mono font-bold text-emerald-600 dark:text-emerald-400" data-testid={`text-won-${team.position}`}>
                    {team.won}
                  </TableCell>
                  <TableCell className="text-center font-mono font-semibold text-slate-600 dark:text-slate-400" data-testid={`text-drawn-${team.position}`}>
                    {team.drawn}
                  </TableCell>
                  <TableCell className="text-center font-mono font-bold text-red-600 dark:text-red-400" data-testid={`text-lost-${team.position}`}>
                    {team.lost}
                  </TableCell>
                  <TableCell className="text-center font-mono font-semibold text-slate-700 dark:text-slate-300" data-testid={`text-gf-${team.position}`}>
                    {team.goalsFor}
                  </TableCell>
                  <TableCell className="text-center font-mono font-semibold text-slate-700 dark:text-slate-300" data-testid={`text-ga-${team.position}`}>
                    {team.goalsAgainst}
                  </TableCell>
                  <TableCell className={`text-center font-mono font-black ${team.goalDifference > 0 ? 'text-emerald-600 dark:text-emerald-400' : team.goalDifference < 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`} data-testid={`text-gd-${team.position}`}>
                    {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                  </TableCell>
                  <TableCell className="text-center" data-testid={`text-points-${team.position}`}>
                    <div className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-lg shadow-lg shadow-emerald-500/30">
                      {team.points}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
