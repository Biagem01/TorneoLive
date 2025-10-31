import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ChevronRight, Edit2 } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";

interface MatchListProps {
  matches: Array<{
    id: string;
    teamAName: string;
    teamBName: string;
    scoreA: number | null;
    scoreB: number | null;
    status: "scheduled" | "live" | "final";
    matchDate: Date;
    onClick?: () => void;
    onEdit?: () => void;
  }>;
}

export default function MatchList({ matches }: MatchListProps) {
  const { user } = useAuth();

  const statusConfig = {
    scheduled: {
      bg: "bg-blue-500",
      text: "text-white",
      label: "Programmata",
      border: "border-blue-200 dark:border-blue-900/50"
    },
    live: {
      bg: "bg-red-500 animate-pulse",
      text: "text-white",
      label: "Live",
      border: "border-red-200 dark:border-red-900/50"
    },
    final: {
      bg: "bg-emerald-500",
      text: "text-white",
      label: "Finale",
      border: "border-emerald-200 dark:border-emerald-900/50"
    },
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-sans font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Data/Ora
              </th>
              <th className="px-6 py-3 text-left text-xs font-sans font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Partita
              </th>
              <th className="px-6 py-3 text-center text-xs font-sans font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Risultato
              </th>
              <th className="px-6 py-3 text-center text-xs font-sans font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Stato
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {matches.map((match) => {
              const config = statusConfig[match.status];
              return (
                <tr
                  key={match.id}
                  onClick={match.onClick}
                  className="cursor-pointer hover-elevate group"
                  data-testid={`row-match-${match.id}`}
                >
                  <td className="px-6 py-4" data-testid={`cell-match-${match.id}-date`}>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{format(new Date(match.matchDate), "d MMM yyyy")}</div>
                        <div className="text-xs">{format(new Date(match.matchDate), "HH:mm")}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4" data-testid={`cell-match-${match.id}-teams`}>
                    <div className="flex items-center gap-3">
                      <span className="font-serif font-bold text-foreground min-w-[120px] text-right">
                        {match.teamAName}
                      </span>
                      <span className="text-muted-foreground font-sans text-sm">vs</span>
                      <span className="font-serif font-bold text-foreground min-w-[120px]">
                        {match.teamBName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4" data-testid={`cell-match-${match.id}-score`}>
                    <div className="flex items-center justify-center gap-3">
                      <span className={`text-3xl font-display font-bold tabular-nums ${match.scoreA !== null ? "text-foreground" : "text-muted-foreground"}`}>
                        {match.scoreA ?? "-"}
                      </span>
                      <span className="text-xl font-bold text-muted-foreground">-</span>
                      <span className={`text-3xl font-display font-bold tabular-nums ${match.scoreB !== null ? "text-foreground" : "text-muted-foreground"}`}>
                        {match.scoreB ?? "-"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center" data-testid={`cell-match-${match.id}-status`}>
                    <Badge className={`${config.bg} ${config.text}`}>
                      {config.label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right" data-testid={`cell-match-${match.id}-actions`}>
                    <div className="flex items-center justify-end gap-2">
                      {match.status === "live" || match.status === "scheduled" && user?.role === "admin" && match.onEdit && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            match.onEdit?.();
                          }}
                          data-testid={`button-edit-match-${match.id}`}
                        >
                          <Edit2 className="w-3 h-3 mr-1" />
                          Modifica
                        </Button>
                      )}
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {matches.length === 0 && (
        <div className="py-12 text-center text-slate-500 dark:text-slate-400" data-testid="empty-state-matches">
          Nessuna partita disponibile
        </div>
      )}
    </div>
  );
}
