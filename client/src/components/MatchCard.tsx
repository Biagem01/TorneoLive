import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { format } from "date-fns";

interface GoalScorer {
  playerName: string;
  minute: number;
}

interface MatchCardProps {
  teamA: string;
  teamB: string;
  scoreA: number | null;
  scoreB: number | null;
  status: "scheduled" | "live" | "final";
  date: Date;
  goalScorersA?: GoalScorer[];
  goalScorersB?: GoalScorer[];
  onClick?: () => void; // funzione chiamata al click
}

export default function MatchCard({
  teamA,
  teamB,
  scoreA,
  scoreB,
  status,
  date,
  goalScorersA = [],
  goalScorersB = [],
  onClick,
}: MatchCardProps) {
  const statusConfig = {
    scheduled: { label: "Scheduled", color: "bg-muted text-muted-foreground" },
    live: { label: "Live", color: "bg-destructive text-destructive-foreground" },
    final: { label: "Final", color: "bg-chart-1 text-foreground" },
  };

  return (
    <div className="relative group cursor-pointer" onClick={onClick}>
      <Card className="p-6 transition-transform transform group-hover:scale-[1.02]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{format(date, "MMM d, h:mm a")}</span>
          </div>
          <Badge className={statusConfig[status].color}>
            {statusConfig[status].label}
          </Badge>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-center">
          <div className="text-right">
            <h3 className="text-lg font-semibold mb-2">{teamA}</h3>
            {goalScorersA.length > 0 && (
              <div className="space-y-1">
                {goalScorersA.map((scorer, idx) => (
                  <p key={idx} className="text-sm text-muted-foreground">
                    {scorer.playerName} {scorer.minute}'
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold font-mono text-primary">{scoreA ?? "-"}</span>
            <span className="text-2xl font-bold text-muted-foreground">:</span>
            <span className="text-4xl font-bold font-mono text-primary">{scoreB ?? "-"}</span>
          </div>

          <div className="text-left">
            <h3 className="text-lg font-semibold mb-2">{teamB}</h3>
            {goalScorersB.length > 0 && (
              <div className="space-y-1">
                {goalScorersB.map((scorer, idx) => (
                  <p key={idx} className="text-sm text-muted-foreground">
                    {scorer.playerName} {scorer.minute}'
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Overlay "Vedi dettagli" */}
      {onClick && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none">
          Vedi dettagli
        </div>
      )}
    </div>
  );
}
