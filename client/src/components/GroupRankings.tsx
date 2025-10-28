import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

interface GroupRankingsProps {
  groups: { name: string; rankings: TeamRanking[] }[];
}

export default function GroupRankings({ groups }: GroupRankingsProps) {
  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <Card key={group.name} className="border-2 border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 p-4 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-white" />
            <h3 className="text-white font-black text-xl">{group.name}</h3>
          </div>
          <div className="overflow-x-auto p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Squadra</TableHead>
                  <TableHead className="text-center">G</TableHead>
                  <TableHead className="text-center">V</TableHead>
                  <TableHead className="text-center">P</TableHead>
                  <TableHead className="text-center">S</TableHead>
                  <TableHead className="text-center">GF</TableHead>
                  <TableHead className="text-center">GS</TableHead>
                  <TableHead className="text-center">DR</TableHead>
                  <TableHead className="text-center">Pti</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.rankings.map((team) => (
                  <TableRow key={team.position}>
                    <TableCell>{team.position}</TableCell>
                    <TableCell>{team.teamName}</TableCell>
                    <TableCell className="text-center">{team.played}</TableCell>
                    <TableCell className="text-center">{team.won}</TableCell>
                    <TableCell className="text-center">{team.drawn}</TableCell>
                    <TableCell className="text-center">{team.lost}</TableCell>
                    <TableCell className="text-center">{team.goalsFor}</TableCell>
                    <TableCell className="text-center">{team.goalsAgainst}</TableCell>
                    <TableCell className="text-center">{team.goalDifference}</TableCell>
                    <TableCell className="text-center">{team.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      ))}
    </div>
  );
}
