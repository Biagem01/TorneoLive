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
  const getPositionStyle = (position: number) => {
    if (position === 1) return "bg-yellow-500 text-white";
    if (position === 2) return "bg-slate-400 text-white";
    if (position === 3) return "bg-amber-600 text-white";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden" data-testid="card-rankings">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-sans font-bold text-muted-foreground uppercase tracking-wider w-16">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-sans font-bold text-muted-foreground uppercase tracking-wider">
                Squadra
              </th>
              <th className="px-4 py-3 text-center text-xs font-sans font-bold text-muted-foreground uppercase tracking-wider">
                G
              </th>
              <th className="px-4 py-3 text-center text-xs font-sans font-bold text-muted-foreground uppercase tracking-wider">
                V
              </th>
              <th className="px-4 py-3 text-center text-xs font-sans font-bold text-muted-foreground uppercase tracking-wider">
                P
              </th>
              <th className="px-4 py-3 text-center text-xs font-sans font-bold text-muted-foreground uppercase tracking-wider">
                S
              </th>
              <th className="px-4 py-3 text-center text-xs font-sans font-bold text-muted-foreground uppercase tracking-wider">
                GF
              </th>
              <th className="px-4 py-3 text-center text-xs font-sans font-bold text-muted-foreground uppercase tracking-wider">
                GS
              </th>
              <th className="px-4 py-3 text-center text-xs font-sans font-bold text-muted-foreground uppercase tracking-wider">
                DR
              </th>
              <th className="px-4 py-3 text-center text-xs font-sans font-bold text-foreground uppercase tracking-wider">
                Pti
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rankings.map((team) => {
              const isHighlighted = highlightTeams.includes(team.teamName);
              const isTopThree = team.position <= 3;
              
              return (
                <tr
                  key={team.position}
                  className={`hover-elevate ${
                    isHighlighted ? "bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-l-emerald-500" : ""
                  }`}
                  data-testid={`row-team-${team.position}`}
                >
                  <td className="px-4 py-3" data-testid={`cell-position-${team.position}`}>
                    <div
                      className={`w-8 h-8 rounded-md ${getPositionStyle(team.position)} flex items-center justify-center font-display font-bold text-sm`}
                    >
                      {team.position}
                    </div>
                  </td>
                  <td className="px-4 py-3" data-testid={`cell-team-${team.position}`}>
                    <div className="flex items-center gap-2">
                      {isTopThree && (
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                      )}
                      <span className="font-serif font-bold text-foreground">{team.teamName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-sans text-sm text-muted-foreground tabular-nums" data-testid={`cell-played-${team.position}`}>
                    {team.played}
                  </td>
                  <td className="px-4 py-3 text-center font-sans text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums" data-testid={`cell-won-${team.position}`}>
                    {team.won}
                  </td>
                  <td className="px-4 py-3 text-center font-sans text-sm text-muted-foreground tabular-nums" data-testid={`cell-drawn-${team.position}`}>
                    {team.drawn}
                  </td>
                  <td className="px-4 py-3 text-center font-sans text-sm font-semibold text-red-600 dark:text-red-400 tabular-nums" data-testid={`cell-lost-${team.position}`}>
                    {team.lost}
                  </td>
                  <td className="px-4 py-3 text-center font-sans text-sm text-muted-foreground tabular-nums" data-testid={`cell-gf-${team.position}`}>
                    {team.goalsFor}
                  </td>
                  <td className="px-4 py-3 text-center font-sans text-sm text-muted-foreground tabular-nums" data-testid={`cell-ga-${team.position}`}>
                    {team.goalsAgainst}
                  </td>
                  <td className={`px-4 py-3 text-center font-sans text-sm font-semibold tabular-nums ${
                    team.goalDifference > 0 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : team.goalDifference < 0 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-muted-foreground'
                  }`} data-testid={`cell-gd-${team.position}`}>
                    {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                  </td>
                  <td className="px-4 py-3 text-center" data-testid={`cell-points-${team.position}`}>
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-primary text-primary-foreground font-display font-bold text-lg tabular-nums">
                      {team.points}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {rankings.length === 0 && (
        <div className="py-12 text-center text-muted-foreground" data-testid="empty-state-rankings">
          Nessuna classifica disponibile
        </div>
      )}
    </div>
  );
}
