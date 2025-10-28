import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface TournamentListProps {
  tournaments: Array<{
    id: string;
    name: string;
    startDate: Date | null;
    endDate: Date | null;
    status: "upcoming" | "live" | "completed";
    teamCount: number;
    matchCount: number;
  }>;
  onSelectTournament: (id: string) => void;
}

export default function TournamentList({ tournaments, onSelectTournament }: TournamentListProps) {
  const statusConfig = {
    upcoming: {
      bg: "bg-blue-500",
      text: "text-white",
      label: "In Arrivo",
      border: "border-blue-200 dark:border-blue-900/50"
    },
    live: {
      bg: "bg-red-500",
      text: "text-white",
      label: "Live",
      border: "border-red-200 dark:border-red-900/50"
    },
    completed: {
      bg: "bg-emerald-500",
      text: "text-white",
      label: "Completato",
      border: "border-emerald-200 dark:border-emerald-900/50"
    },
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Torneo
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Stato
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Squadre
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Partite
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {tournaments.map((tournament) => {
              const config = statusConfig[tournament.status];
              return (
                <tr
                  key={tournament.id}
                  onClick={() => onSelectTournament(tournament.id)}
                  className="cursor-pointer hover-elevate group"
                  data-testid={`row-tournament-${tournament.id}`}
                >
                  <td className="px-6 py-4" data-testid={`cell-tournament-${tournament.id}-name`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {tournament.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4" data-testid={`cell-tournament-${tournament.id}-status`}>
                    <Badge className={`${config.bg} ${config.text}`}>
                      {config.label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4" data-testid={`cell-tournament-${tournament.id}-dates`}>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(tournament.startDate || new Date(), "d MMM")} - {format(tournament.endDate || new Date(), "d MMM yyyy")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center" data-testid={`cell-tournament-${tournament.id}-teams`}>
                    <div className="flex items-center justify-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold text-foreground">{tournament.teamCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center" data-testid={`cell-tournament-${tournament.id}-matches`}>
                    <span className="font-semibold text-foreground">{tournament.matchCount}</span>
                  </td>
                  <td className="px-6 py-4 text-right" data-testid={`cell-tournament-${tournament.id}-action`}>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {tournaments.length === 0 && (
        <div className="py-12 text-center text-slate-500 dark:text-slate-400" data-testid="empty-state-tournaments">
          Nessun torneo disponibile
        </div>
      )}
    </div>
  );
}
