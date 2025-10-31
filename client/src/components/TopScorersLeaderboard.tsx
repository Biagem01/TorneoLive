import { Target, Trophy, Medal, Award } from "lucide-react";

interface TopScorer {
  playerName: string;
  teamName: string;
  goals: number;
}

interface TopScorersLeaderboardProps {
  scorers: TopScorer[];
}

export default function TopScorersLeaderboard({ scorers }: TopScorersLeaderboardProps) {
  const getPositionStyle = (position: number) => {
    if (position === 1) return { bg: "bg-yellow-500", text: "text-white", icon: Trophy };
    if (position === 2) return { bg: "bg-slate-400", text: "text-white", icon: Award };
    if (position === 3) return { bg: "bg-amber-600", text: "text-white", icon: Medal };
    return { bg: "bg-muted", text: "text-muted-foreground", icon: null };
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden" data-testid="card-top-scorers">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-sans font-bold text-muted-foreground uppercase tracking-wider w-16">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-sans font-bold text-muted-foreground uppercase tracking-wider">
                Giocatore
              </th>
              <th className="px-4 py-3 text-left text-xs font-sans font-bold text-muted-foreground uppercase tracking-wider">
                Squadra
              </th>
              <th className="px-4 py-3 text-center text-xs font-sans font-bold text-foreground uppercase tracking-wider">
                Goal
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {scorers.map((scorer, index) => {
              const position = index + 1;
              const config = getPositionStyle(position);
              const Icon = config.icon;
              
              return (
                <tr
                  key={index}
                  className="hover-elevate"
                  data-testid={`row-scorer-${position}`}
                >
                  <td className="px-4 py-3" data-testid={`cell-scorer-${position}-position`}>
                    <div className={`w-8 h-8 rounded-md ${config.bg} ${config.text} flex items-center justify-center font-display font-bold text-sm`}>
                      {Icon ? <Icon className="w-4 h-4" /> : position}
                    </div>
                  </td>
                  <td className="px-4 py-3" data-testid={`cell-scorer-${position}-name`}>
                    <span className="font-serif font-bold text-foreground">{scorer.playerName}</span>
                  </td>
                  <td className="px-4 py-3" data-testid={`cell-scorer-${position}-team`}>
                    <span className="text-sm font-sans text-muted-foreground">{scorer.teamName}</span>
                  </td>
                  <td className="px-4 py-3 text-center" data-testid={`cell-scorer-${position}-goals`}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary text-primary-foreground font-display font-bold">
                      <Target className="w-4 h-4" />
                      <span className="text-lg tabular-nums">{scorer.goals}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {scorers.length === 0 && (
        <div className="py-12 text-center text-muted-foreground" data-testid="empty-state-scorers">
          Nessun marcatore disponibile
        </div>
      )}
    </div>
  );
}
