import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Target, Trophy, Medal, Award, Sparkles } from "lucide-react";

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
        text: "text-yellow-600 dark:text-yellow-400", 
        icon: "bg-yellow-500/20",
        border: "border-yellow-500/40",
        glow: "shadow-yellow-500/40",
        iconComponent: Trophy
      },
      { 
        bg: "from-slate-300 to-slate-500", 
        text: "text-slate-500 dark:text-slate-400", 
        icon: "bg-slate-500/20",
        border: "border-slate-500/40",
        glow: "shadow-slate-500/40",
        iconComponent: Award
      },
      { 
        bg: "from-amber-600 to-amber-800", 
        text: "text-amber-600 dark:text-amber-500", 
        icon: "bg-amber-500/20",
        border: "border-amber-500/40",
        glow: "shadow-amber-500/40",
        iconComponent: Medal
      },
    ];
    return configs[index];
  };

  return (
    <Card className="p-0 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 shadow-xl overflow-hidden" data-testid="card-top-scorers">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-xl">
            <Target className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Capocannonieri</h2>
            <p className="text-orange-100 text-sm font-medium">I migliori marcatori del torneo</p>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="p-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {top3.map((scorer, index) => {
            const position = index + 1;
            const config = getMedalConfig(index);
            const IconComponent = config.iconComponent;

            return (
              <Card
                key={index}
                className={`group relative overflow-hidden p-6 border-2 ${config.border} bg-gradient-to-br ${config.icon} hover:scale-105 transition-all duration-300 shadow-xl ${config.glow}`}
                data-testid={`card-scorer-${position}`}
              >
                {/* Shimmer */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                
                <div className="relative flex flex-col items-center text-center gap-4">
                  <div className="relative">
                    <div className={`absolute -inset-2 bg-gradient-to-br ${config.bg} rounded-full opacity-30 blur-md group-hover:opacity-50 transition-opacity`}></div>
                    <Avatar className={`relative w-24 h-24 border-4 ${config.border} shadow-xl`}>
                      <AvatarFallback className={`bg-gradient-to-br ${config.bg} text-white text-2xl font-black`}>
                        {scorer.playerName.split(" ").map(n => n[0]).join("").substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br ${config.bg} flex items-center justify-center shadow-xl ${config.glow} group-hover:scale-125 transition-transform`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-slate-900 dark:text-white mb-1" data-testid={`text-scorer-name-${position}`}>
                      {scorer.playerName}
                    </h3>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1" data-testid={`text-scorer-team-${position}`}>
                      <Sparkles className="w-3 h-3" />
                      {scorer.teamName}
                    </p>
                  </div>
                  <div className="w-full">
                    <div className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br ${config.bg} shadow-xl ${config.glow}`}>
                      <Target className="w-5 h-5 text-white" />
                      <span className="text-4xl font-black text-white" data-testid={`text-scorer-goals-${position}`}>
                        {scorer.goals}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Rest of scorers */}
        {rest.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <Medal className="w-5 h-5 text-slate-500" />
              Altri Marcatori
            </h3>
            {rest.map((scorer, index) => {
              const position = index + 4;
              return (
                <div
                  key={index}
                  className="group flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all duration-300"
                  data-testid={`row-scorer-${position}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center font-black text-white shadow-lg">
                      {position}
                    </div>
                    <Avatar className="w-14 h-14 border-2 border-slate-300 dark:border-slate-600 shadow-lg group-hover:scale-110 transition-transform">
                      <AvatarFallback className="bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 text-slate-700 dark:text-slate-300 font-black text-lg">
                        {scorer.playerName.split(" ").map(n => n[0]).join("").substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-black text-lg text-slate-900 dark:text-white" data-testid={`text-player-${position}`}>{scorer.playerName}</p>
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400" data-testid={`text-team-${position}`}>{scorer.teamName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all">
                    <Target className="w-4 h-4 text-white" />
                    <span className="text-2xl font-black text-white" data-testid={`text-goals-${position}`}>
                      {scorer.goals}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
