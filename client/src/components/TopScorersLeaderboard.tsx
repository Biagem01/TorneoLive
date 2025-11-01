import { Target, Trophy } from "lucide-react";

interface TopScorer {
  playerName: string;
  teamName: string;
  goals: number;
}

interface TopScorersLeaderboardProps {
  scorers: TopScorer[];
}

export default function TopScorersLeaderboard({ scorers }: TopScorersLeaderboardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden" data-testid="card-top-scorers">
      <div className="bg-slate-900 dark:bg-slate-100 px-6 py-4">
        <h3 className="text-white dark:text-slate-900 font-sans font-bold text-lg text-center">
          Capocannonieri
        </h3>
      </div>
      <div className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="text-left text-xs font-semibold text-slate-600 dark:text-slate-400 pb-3 pr-2">#</th>
                <th className="text-left text-xs font-semibold text-slate-600 dark:text-slate-400 pb-3">Giocatore</th>
                <th className="text-left text-xs font-semibold text-slate-600 dark:text-slate-400 pb-3">Squadra</th>
                <th className="text-center text-xs font-semibold text-slate-600 dark:text-slate-400 pb-3 pl-1">Goal</th>
              </tr>
            </thead>
            <tbody>
              {scorers.map((scorer, index) => {
                const position = index + 1;
                
                return (
                  <tr
                    key={index}
                    className={`border-b border-slate-100 dark:border-slate-800/50 last:border-0 ${
                      index === 0 ? "bg-yellow-50/50 dark:bg-yellow-900/10" : ""
                    }`}
                    data-testid={`row-scorer-${position}`}
                  >
                    <td className="py-3 pr-2" data-testid={`cell-scorer-${position}-position`}>
                      <span className={`font-bold text-sm ${
                        index === 0 
                          ? "text-yellow-600 dark:text-yellow-400" 
                          : index === 1 
                          ? "text-slate-500 dark:text-slate-400"
                          : index === 2
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-slate-500 dark:text-slate-500"
                      }`}>
                        {position}
                      </span>
                    </td>
                    <td className="py-3" data-testid={`cell-scorer-${position}-name`}>
                      <div className="flex items-center gap-2">
                        {index <= 2 && (
                          <Trophy className={`w-4 h-4 ${
                            index === 0 ? "text-yellow-600 dark:text-yellow-400" : 
                            index === 1 ? "text-slate-500 dark:text-slate-400" :
                            "text-amber-600 dark:text-amber-400"
                          }`} />
                        )}
                        <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                          {scorer.playerName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3" data-testid={`cell-scorer-${position}-team`}>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{scorer.teamName}</span>
                    </td>
                    <td className="text-center py-3 pl-1" data-testid={`cell-scorer-${position}-goals`}>
                      <div className="inline-flex items-center gap-1.5 min-w-[48px] h-7 px-2 bg-orange-600 text-white font-bold text-sm rounded-md">
                        <Target className="w-3.5 h-3.5" />
                        <span className="tabular-nums">{scorer.goals}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {scorers.length === 0 && (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400" data-testid="empty-state-scorers">
            Nessun marcatore disponibile
          </div>
        )}
      </div>
    </div>
  );
}
