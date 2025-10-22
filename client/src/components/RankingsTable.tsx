import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Trophy, TrendingUp } from "lucide-react";

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
    if (position === 1) return { bg: "bg-gradient-to-br from-yellow-400 to-yellow-600", text: "text-yellow-600 dark:text-yellow-500", glow: "shadow-yellow-500/30" };
    if (position === 2) return { bg: "bg-gradient-to-br from-slate-300 to-slate-500", text: "text-slate-500 dark:text-slate-400", glow: "shadow-slate-500/30" };
    if (position === 3) return { bg: "bg-gradient-to-br from-amber-600 to-amber-800", text: "text-amber-600 dark:text-amber-500", glow: "shadow-amber-500/30" };
    return { bg: "bg-slate-200 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400", glow: "" };
  };

  return (
    <Card className="p-6 border-slate-300 dark:border-slate-800 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950" data-testid="card-rankings">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
          <Trophy className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Classifica</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Posizioni e statistiche</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 dark:border-slate-800 hover:bg-transparent">
              <TableHead className="w-12 text-slate-600 dark:text-slate-400">#</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Squadra</TableHead>
              <TableHead className="text-center text-slate-600 dark:text-slate-400">G</TableHead>
              <TableHead className="text-center text-slate-600 dark:text-slate-400">V</TableHead>
              <TableHead className="text-center text-slate-600 dark:text-slate-400">P</TableHead>
              <TableHead className="text-center text-slate-600 dark:text-slate-400">S</TableHead>
              <TableHead className="text-center text-slate-600 dark:text-slate-400">GF</TableHead>
              <TableHead className="text-center text-slate-600 dark:text-slate-400">GS</TableHead>
              <TableHead className="text-center text-slate-600 dark:text-slate-400">DR</TableHead>
              <TableHead className="text-center font-bold text-emerald-600 dark:text-emerald-400">Pti</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankings.map((team) => {
              const isHighlighted = highlightTeams.includes(team.teamName);
              const medalConfig = getMedalConfig(team.position);
              return (
                <TableRow
                  key={team.position}
                  className={`border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors ${
                    isHighlighted ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/50" : ""
                  }`}
                  data-testid={`row-team-${team.position}`}
                >
                  <TableCell>
                    <div
                      className={`w-10 h-10 rounded-xl ${medalConfig.bg} flex items-center justify-center font-bold text-sm text-white shadow-lg ${medalConfig.glow}`}
                      data-testid={`badge-position-${team.position}`}
                    >
                      {team.position}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900 dark:text-white" data-testid={`text-team-${team.position}`}>
                    <div className="flex items-center gap-2">
                      {team.position <= 3 && <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                      {team.teamName}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-mono text-slate-700 dark:text-slate-300" data-testid={`text-played-${team.position}`}>
                    {team.played}
                  </TableCell>
                  <TableCell className="text-center font-mono text-emerald-600 dark:text-emerald-400" data-testid={`text-won-${team.position}`}>
                    {team.won}
                  </TableCell>
                  <TableCell className="text-center font-mono text-slate-600 dark:text-slate-400" data-testid={`text-drawn-${team.position}`}>
                    {team.drawn}
                  </TableCell>
                  <TableCell className="text-center font-mono text-red-600 dark:text-red-400" data-testid={`text-lost-${team.position}`}>
                    {team.lost}
                  </TableCell>
                  <TableCell className="text-center font-mono text-slate-700 dark:text-slate-300" data-testid={`text-gf-${team.position}`}>
                    {team.goalsFor}
                  </TableCell>
                  <TableCell className="text-center font-mono text-slate-700 dark:text-slate-300" data-testid={`text-ga-${team.position}`}>
                    {team.goalsAgainst}
                  </TableCell>
                  <TableCell className={`text-center font-mono font-bold ${team.goalDifference > 0 ? 'text-emerald-600 dark:text-emerald-400' : team.goalDifference < 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`} data-testid={`text-gd-${team.position}`}>
                    {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                  </TableCell>
                  <TableCell className="text-center font-mono font-bold text-xl text-emerald-600 dark:text-emerald-400" data-testid={`text-points-${team.position}`}>
                    {team.points}
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
