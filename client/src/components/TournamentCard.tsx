import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar } from "lucide-react";
import { format } from "date-fns";

interface TournamentCardProps {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: "upcoming" | "live" | "completed";
  teamCount: number;
  matchCount: number;
  onClick?: () => void;
}

export default function TournamentCard({
  name,
  startDate,
  endDate,
  status,
  teamCount,
  matchCount,
  onClick,
}: TournamentCardProps) {
  const statusColors = {
    upcoming: "bg-chart-4 text-foreground",
    live: "bg-destructive text-destructive-foreground",
    completed: "bg-chart-1 text-foreground",
  };

  const statusLabels = {
    upcoming: "Upcoming",
    live: "Live",
    completed: "Completed",
  };

  return (
    <Card
      className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-transform"
      onClick={onClick}
      data-testid={`card-tournament-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2" data-testid="text-tournament-name">{name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span data-testid="text-tournament-dates">
              {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
            </span>
          </div>
        </div>
        <Badge className={statusColors[status]} data-testid="badge-tournament-status">
          {statusLabels[status]}
        </Badge>
      </div>

      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span data-testid="text-team-count">{teamCount} Teams</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          <span data-testid="text-match-count">{matchCount} Matches</span>
        </div>
      </div>
    </Card>
  );
}
