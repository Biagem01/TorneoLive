import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface TournamentCardProps {
  id: string;
  name: string;
  startDate: Date | null;
  endDate: Date | null;
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
  const statusConfig = {
    upcoming: {
      bg: "bg-gradient-to-r from-blue-500 to-blue-600",
      text: "text-white",
      label: "In Arrivo",
      glow: "shadow-blue-500/20",
      gradient: "from-blue-500/10 via-transparent to-transparent",
      pulse: false
    },
    live: {
      bg: "bg-gradient-to-r from-red-500 to-pink-500",
      text: "text-white",
      label: "Live",
      glow: "shadow-red-500/30",
      gradient: "from-red-500/10 via-transparent to-transparent",
      pulse: true
    },
    completed: {
      bg: "bg-gradient-to-r from-emerald-500 to-teal-500",
      text: "text-white",
      label: "Completato",
      glow: "shadow-emerald-500/20",
      gradient: "from-emerald-500/10 via-transparent to-transparent",
      pulse: false
    },
  };

  const config = statusConfig[status];

  return (
    <Card
      className="group relative overflow-hidden border-slate-300 dark:border-slate-800 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 hover:border-slate-400 dark:hover:border-slate-700 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10"
      onClick={onClick}
      data-testid={`card-tournament-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
      
      <div className="relative p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center backdrop-blur-sm">
                <Trophy className="w-6 h-6 text-emerald-400" />
              </div>
              <Badge className={`${config.bg} ${config.text} ${config.glow} shadow-lg ${config.pulse ? 'animate-pulse' : ''}`} data-testid="badge-tournament-status">
                {config.label}
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" data-testid="text-tournament-name">
              {name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Calendar className="w-4 h-4" />
              <span data-testid="text-tournament-dates">
              {format(startDate || new Date(), "d MMM")} - {format(endDate || new Date(), "d MMM yyyy")}
            </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Users className="w-4 h-4" />
              <span data-testid="text-team-count" className="font-medium">{teamCount} Squadre</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Trophy className="w-4 h-4" />
              <span data-testid="text-match-count" className="font-medium">{matchCount} Partite</span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 dark:text-slate-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Card>
  );
}
