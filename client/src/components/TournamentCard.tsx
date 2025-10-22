import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar, ArrowRight, Sparkles } from "lucide-react";
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
      glow: "shadow-blue-500/30",
      gradient: "from-blue-500/20 via-blue-400/10 to-transparent",
      pulse: false,
      border: "border-blue-500/30"
    },
    live: {
      bg: "bg-gradient-to-r from-red-500 to-pink-500",
      text: "text-white",
      label: "Live",
      glow: "shadow-red-500/40",
      gradient: "from-red-500/20 via-pink-400/10 to-transparent",
      pulse: true,
      border: "border-red-500/40"
    },
    completed: {
      bg: "bg-gradient-to-r from-emerald-500 to-teal-500",
      text: "text-white",
      label: "Completato",
      glow: "shadow-emerald-500/30",
      gradient: "from-emerald-500/20 via-teal-400/10 to-transparent",
      pulse: false,
      border: "border-emerald-500/30"
    },
  };

  const config = statusConfig[status];

  return (
    <Card
      className={`group relative overflow-hidden border-2 ${config.border} bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 hover:border-opacity-70 cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl ${config.glow}`}
      onClick={onClick}
      data-testid={`card-tournament-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Animated Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-40 group-hover:opacity-70 transition-opacity duration-500`}></div>
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl opacity-30 blur-sm group-hover:opacity-50 transition-opacity"></div>
                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 border-2 border-white dark:border-slate-800 flex items-center justify-center shadow-xl shadow-emerald-500/30">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
              </div>
              <Badge className={`${config.bg} ${config.text} shadow-xl ${config.glow} px-4 py-1.5 text-sm font-bold ${config.pulse ? 'animate-pulse' : ''}`} data-testid={`badge-tournament-status-${status}`}>
                {config.label}
              </Badge>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-teal-500 group-hover:bg-clip-text transition-all duration-300" data-testid="text-tournament-name">
              {name}
            </h3>
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-lg backdrop-blur-sm">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300" data-testid="text-tournament-dates">
                {format(startDate || new Date(), "d MMM")} - {format(endDate || new Date(), "d MMM yyyy")}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Squadre</p>
                <p className="text-lg font-black text-slate-900 dark:text-white" data-testid="text-team-count">{teamCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Partite</p>
                <p className="text-lg font-black text-slate-900 dark:text-white" data-testid="text-match-count">{matchCount}</p>
              </div>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
            <ArrowRight className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </Card>
  );
}
