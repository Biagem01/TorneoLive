import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface TeamRanking {
  position: number;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

interface RankingsTableProps {
  rankings: TeamRanking[];
  highlightTeams?: (string | undefined)[]; // ← squadre da evidenziare
}

export default function RankingsTable({ rankings, highlightTeams = [] }: RankingsTableProps) {
  const getMedalColor = (position: number) => {
    if (position === 1) return "bg-yellow-500";
    if (position === 2) return "bg-gray-400";
    if (position === 3) return "bg-amber-600";
    return "bg-muted";
  };

  return (
    <Card className="p-6" data-testid="card-rankings">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Standings</h2>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-center">P</TableHead>
              <TableHead className="text-center">W</TableHead>
              <TableHead className="text-center">D</TableHead>
              <TableHead className="text-center">L</TableHead>
              <TableHead className="text-center">GF</TableHead>
              <TableHead className="text-center">GA</TableHead>
              <TableHead className="text-center">GD</TableHead>
              <TableHead className="text-center font-bold">Pts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankings.map((team) => {
              const isHighlighted = highlightTeams.includes(team.teamName);
              return (
                <TableRow
                  key={team.position}
                  className={`hover-elevate transition-colors ${
                    isHighlighted ? "bg-yellow-100 dark:bg-yellow-700 font-bold" : ""
                  }`}
                  data-testid={`row-team-${team.position}`}
                >
                  <TableCell>
                    <div
                      className={`w-8 h-8 rounded-full ${getMedalColor(team.position)} flex items-center justify-center font-bold text-sm`}
                      data-testid={`badge-position-${team.position}`}
                    >
                      {team.position}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold" data-testid={`text-team-${team.position}`}>
                    {team.teamName}
                  </TableCell>
                  <TableCell className="text-center font-mono" data-testid={`text-played-${team.position}`}>
                    {team.played}
                  </TableCell>
                  <TableCell className="text-center font-mono" data-testid={`text-won-${team.position}`}>
                    {team.won}
                  </TableCell>
                  <TableCell className="text-center font-mono" data-testid={`text-drawn-${team.position}`}>
                    {team.drawn}
                  </TableCell>
                  <TableCell className="text-center font-mono" data-testid={`text-lost-${team.position}`}>
                    {team.lost}
                  </TableCell>
                  <TableCell className="text-center font-mono" data-testid={`text-gf-${team.position}`}>
                    {team.goalsFor}
                  </TableCell>
                  <TableCell className="text-center font-mono" data-testid={`text-ga-${team.position}`}>
                    {team.goalsAgainst}
                  </TableCell>
                  <TableCell className="text-center font-mono" data-testid={`text-gd-${team.position}`}>
                    {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                  </TableCell>
                  <TableCell className="text-center font-mono font-bold text-primary" data-testid={`text-points-${team.position}`}>
                    {team.points}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
