import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Trophy, Edit2 } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth"; // <-- importa l'hook

interface GoalScorer {
  playerName: string;
  minute: number;
}

interface MatchCardProps {
  teamAName: string;
  teamBName: string;
  scoreA: number | null;
  scoreB: number | null;
  status: "scheduled" | "live" | "final";
  matchDate: Date;
  goalScorersA?: GoalScorer[];
  goalScorersB?: GoalScorer[];
  onClick?: () => void;
  onEdit?: () => void;
}

export default function MatchCard({
  teamAName,
  teamBName,
  scoreA,
  scoreB,
  status,
  matchDate,
  goalScorersA = [],
  goalScorersB = [],
  onClick,
  onEdit,
}: MatchCardProps) {
  const date = new Date(matchDate);
  const { user } = useAuth(); // <-- prendi l'utente corrente

  const statusConfig = {
    scheduled: { label: "Programmata", bg: "bg-gradient-to-r from-blue-500 to-blue-600", text: "text-white", glow: "shadow-blue-500/20", pulse: false, gradient: "from-blue-500/10 via-transparent to-transparent" },
    live: { label: "Live", bg: "bg-gradient-to-r from-red-500 to-pink-500", text: "text-white", glow: "shadow-red-500/30", pulse: true, gradient: "from-red-500/10 via-transparent to-transparent" },
    final: { label: "Finale", bg: "bg-gradient-to-r from-emerald-500 to-teal-500", text: "text-white", glow: "shadow-emerald-500/20", pulse: false, gradient: "from-emerald-500/10 via-transparent to-transparent" },
  };

  const config = statusConfig[status];

  const renderGoalScorers = (scorers: GoalScorer[], isLeft: boolean) => (
    <div className={`space-y-1 ${isLeft ? "pr-2 text-right" : "pl-2 text-left"}`}>
      {scorers.map((scorer, idx) => (
        <p key={idx} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 justify-end">
          {isLeft ? (
            <>
              <span>{scorer.playerName}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{scorer.minute}'</span>
            </>
          ) : (
            <>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{scorer.minute}'</span>
              <span>{scorer.playerName}</span>
            </>
          )}
        </p>
      ))}
    </div>
  );

  return (
    <Card
      className="group relative overflow-hidden border-slate-300 dark:border-slate-800 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 hover:border-slate-400 dark:hover:border-slate-700 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10"
      onClick={onClick}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-50 group-hover:opacity-100 transition-opacity`}></div>

      {/* Bottone Modifica solo per admin */}
      {status === "live" && user?.role === "admin" && onEdit && (
        <div className="absolute bottom-4 right-4 z-10">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white text-sm font-semibold rounded-lg hover:bg-yellow-600 transition"
          >
            <Edit2 className="w-3 h-3" />
            Modifica
          </button>
        </div>
      )}

      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{format(date, "d MMM, HH:mm")}</span>
          </div>
          <Badge className={`${config.bg} ${config.text} ${config.glow} shadow-lg ${config.pulse ? "animate-pulse" : ""}`}>
            {config.label}
          </Badge>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-center">
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 mb-3">
              <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{teamAName}</h3>
            </div>
            {goalScorersA.length > 0 && renderGoalScorers(goalScorersA, true)}
          </div>

          <div className="flex items-center gap-4 px-6 py-4 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
            <span className={`text-5xl font-black font-mono ${scoreA !== null ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-600"}`}>{scoreA ?? "-"}</span>
            <span className="text-3xl font-bold text-slate-400 dark:text-slate-600">:</span>
            <span className={`text-5xl font-black font-mono ${scoreB !== null ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-600"}`}>{scoreB ?? "-"}</span>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{teamBName}</h3>
              <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              </div>
            </div>
            {goalScorersB.length > 0 && renderGoalScorers(goalScorersB, false)}
          </div>
        </div>
      </div>

      {onClick && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-lg z-0">
          <span className="text-slate-900 dark:text-white text-lg font-bold px-6 py-3 bg-emerald-500/20 rounded-full border border-emerald-500/30 backdrop-blur-sm">
            Vedi dettagli
          </span>
        </div>
      )}
    </Card>
  );
}
