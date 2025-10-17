import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Target } from "lucide-react";

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

  return (
    <Card className="p-6" data-testid="card-top-scorers">
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Top Scorers</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {top3.map((scorer, index) => {
          const position = index + 1;
          const bgColors = ["bg-yellow-500/10", "bg-gray-400/10", "bg-amber-600/10"];
          const textColors = ["text-yellow-500", "text-gray-400", "text-amber-600"];

          return (
            <Card
              key={index}
              className={`p-4 ${bgColors[index]} border-0`}
              data-testid={`card-scorer-${position}`}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className={textColors[index]}>
                    {scorer.playerName.split(" ").map(n => n[0]).join("").substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg" data-testid={`text-scorer-name-${position}`}>
                    {scorer.playerName}
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid={`text-scorer-team-${position}`}>
                    {scorer.teamName}
                  </p>
                </div>
                <div className="text-3xl font-bold font-mono text-primary" data-testid={`text-scorer-goals-${position}`}>
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
                className="flex items-center justify-between p-3 rounded-lg hover-elevate"
                data-testid={`row-scorer-${position}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground w-6" data-testid={`text-position-${position}`}>
                    {position}
                  </span>
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      {scorer.playerName.split(" ").map(n => n[0]).join("").substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold" data-testid={`text-player-${position}`}>{scorer.playerName}</p>
                    <p className="text-sm text-muted-foreground" data-testid={`text-team-${position}`}>{scorer.teamName}</p>
                  </div>
                </div>
                <span className="text-2xl font-bold font-mono text-primary" data-testid={`text-goals-${position}`}>
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
