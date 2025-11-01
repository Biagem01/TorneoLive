import { Trophy } from "lucide-react";

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
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden" data-testid="card-rankings">
      <div className="bg-slate-900 dark:bg-slate-100 px-6 py-4">
        <h3 className="text-white dark:text-slate-900 font-sans font-bold text-lg text-center">
          Classifica Generale
        </h3>
      </div>
      <div className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="text-left text-xs font-semibold text-slate-600 dark:text-slate-400 pb-3 pr-2">#</th>
                <th className="text-left text-xs font-semibold text-slate-600 dark:text-slate-400 pb-3">Squadra</th>
                <th className="text-center text-xs font-semibold text-slate-600 dark:text-slate-400 pb-3 px-1">G</th>
                <th className="text-center text-xs font-semibold text-slate-600 dark:text-slate-400 pb-3 px-1">V</th>
                <th className="text-center text-xs font-semibold text-slate-600 dark:text-slate-400 pb-3 px-1">P</th>
                <th className="text-center text-xs font-semibold text-slate-600 dark:text-slate-400 pb-3 px-1">S</th>
                <th className="text-center text-xs font-semibold text-slate-600 dark:text-slate-400 pb-3 px-1">GF</th>
                <th className="text-center text-xs font-semibold text-slate-600 dark:text-slate-400 pb-3 px-1">GS</th>
                <th className="text-center text-xs font-semibold text-slate-600 dark:text-slate-400 pb-3 px-1">DR</th>
                <th className="text-center text-xs font-semibold text-slate-600 dark:text-slate-400 pb-3 pl-1">Pti</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((team, idx) => {
                const isHighlighted = highlightTeams.includes(team.teamName);
                
                return (
                  <tr
                    key={team.position}
                    className={`border-b border-slate-100 dark:border-slate-800/50 last:border-0 ${
                      isHighlighted ? "bg-emerald-50/50 dark:bg-emerald-900/10" : ""
                    } ${idx === 0 ? "bg-yellow-50/50 dark:bg-yellow-900/10" : ""}`}
                    data-testid={`row-team-${team.position}`}
                  >
                    <td className="py-3 pr-2" data-testid={`cell-position-${team.position}`}>
                      <span className={`font-bold text-sm ${
                        idx === 0 
                          ? "text-yellow-600 dark:text-yellow-400" 
                          : idx === 1 
                          ? "text-slate-500 dark:text-slate-400"
                          : idx === 2
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-slate-500 dark:text-slate-500"
                      }`}>
                        {team.position}
                      </span>
                    </td>
                    <td className="py-3" data-testid={`cell-team-${team.position}`}>
                      <div className="flex items-center gap-2">
                        {idx <= 2 && (
                          <Trophy className={`w-4 h-4 ${
                            idx === 0 ? "text-yellow-600 dark:text-yellow-400" : 
                            idx === 1 ? "text-slate-500 dark:text-slate-400" :
                            "text-amber-600 dark:text-amber-400"
                          }`} />
                        )}
                        <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                          {team.teamName}
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-1 text-sm text-slate-700 dark:text-slate-300 tabular-nums" data-testid={`cell-played-${team.position}`}>
                      {team.played}
                    </td>
                    <td className="text-center py-3 px-1 text-sm text-slate-700 dark:text-slate-300 tabular-nums" data-testid={`cell-won-${team.position}`}>
                      {team.won}
                    </td>
                    <td className="text-center py-3 px-1 text-sm text-slate-700 dark:text-slate-300 tabular-nums" data-testid={`cell-drawn-${team.position}`}>
                      {team.drawn}
                    </td>
                    <td className="text-center py-3 px-1 text-sm text-slate-700 dark:text-slate-300 tabular-nums" data-testid={`cell-lost-${team.position}`}>
                      {team.lost}
                    </td>
                    <td className="text-center py-3 px-1 text-sm text-slate-700 dark:text-slate-300 tabular-nums" data-testid={`cell-gf-${team.position}`}>
                      {team.goalsFor}
                    </td>
                    <td className="text-center py-3 px-1 text-sm text-slate-700 dark:text-slate-300 tabular-nums" data-testid={`cell-ga-${team.position}`}>
                      {team.goalsAgainst}
                    </td>
                    <td className={`text-center py-3 px-1 text-sm font-semibold tabular-nums ${
                      team.goalDifference > 0 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : team.goalDifference < 0 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-slate-700 dark:text-slate-300'
                    }`} data-testid={`cell-gd-${team.position}`}>
                      {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                    </td>
                    <td className="text-center py-3 pl-1" data-testid={`cell-points-${team.position}`}>
                      <span className="inline-flex items-center justify-center min-w-[36px] h-7 px-2 bg-emerald-600 text-white font-bold text-sm rounded-md tabular-nums">
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
          <div className="py-12 text-center text-slate-500 dark:text-slate-400" data-testid="empty-state-rankings">
            Nessuna classifica disponibile
          </div>
        )}
      </div>
    </div>
  );
}
