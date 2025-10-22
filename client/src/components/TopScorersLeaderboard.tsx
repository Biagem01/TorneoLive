import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Target, Trophy, Medal } from "lucide-react";

interface TopScorer {
  playerName: string;
  teamName: string;
  goals: number;
}

interface TopScorersLeaderboardProps {
  scorers: TopScorer[];
}

export default function TopScorersLeaderboard({ scorers }: TopScorersLeaderboardProps) {
  const top3 = scorers.slice(0, 3);
  const rest = scorers.slice(3);

  const getMedalConfig = (index: number) => {
    const configs = [
      { 
        bg: "from-yellow-400 to-yellow-600", 
        text: "text-yellow-600 dark:text-yellow-500", 
        icon: "bg-yellow-500/20",
        border: "border-yellow-500/30",
        glow: "shadow-yellow-500/20"
      },
      { 
        bg: "from-slate-300 to-slate-500", 
        text: "text-slate-400", 
        icon: "bg-slate-500/20",
        border: "border-slate-500/30",
        glow: "shadow-slate-500/20"
      },
      { 
        bg: "from-amber-600 to-amber-800", 
        text: "text-amber-600 dark:text-amber-500", 
        icon: "bg-amber-500/20",
        border: "border-amber-500/30",
        glow: "shadow-amber-500/20"
      },
    ];
    return configs[index];
  };

  return (
    <Card className="p-6 border-slate-300 dark:border-slate-800 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950" data-testid="card-top-scorers">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
          <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Capocannonieri</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">I migliori marcatori del torneo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {top3.map((scorer, index) => {
          const position = index + 1;
          const config = getMedalConfig(index);

          return (
            <Card
              key={index}
              className={`p-6 border-slate-300 dark:border-slate-800 bg-gradient-to-br ${config.icon} hover:scale-105 transition-transform shadow-lg ${config.glow}`}
              data-testid={`card-scorer-${position}`}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="relative">
                  <Avatar className={`w-20 h-20 border-2 ${config.border}`}>
                    <AvatarFallback className={`bg-gradient-to-br ${config.bg} text-white text-xl font-bold`}>
                      {scorer.playerName.split(" ").map(n => n[0]).join("").substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br ${config.bg} flex items-center justify-center shadow-lg`}>
                    {position === 1 ? <Trophy className="w-4 h-4 text-white" /> : <Medal className="w-4 h-4 text-white" />}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1" data-testid={`text-scorer-name-${position}`}>
                    {scorer.playerName}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400" data-testid={`text-scorer-team-${position}`}>
                    {scorer.teamName}
                  </p>
                </div>
                <div className={`text-4xl font-black font-mono bg-gradient-to-br ${config.bg} bg-clip-text text-transparent`} data-testid={`text-scorer-goals-${position}`}>
                  {scorer.goals}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {rest.length > 0 && (
        <div className="space-y-2">
          {rest.map((scorer, index) => {
            const position = index + 4;
            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
                data-testid={`row-scorer-${position}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-slate-500 dark:text-slate-500 w-8 text-center" data-testid={`text-position-${position}`}>
                    {position}
                  </span>
                  <Avatar className="w-12 h-12 border-2 border-slate-300 dark:border-slate-700">
                    <AvatarFallback className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                      {scorer.playerName.split(" ").map(n => n[0]).join("").substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white" data-testid={`text-player-${position}`}>{scorer.playerName}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400" data-testid={`text-team-${position}`}>{scorer.teamName}</p>
                  </div>
                </div>
                <span className="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400" data-testid={`text-goals-${position}`}>
                  {scorer.goals}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
