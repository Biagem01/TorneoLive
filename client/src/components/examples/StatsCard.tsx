import StatsCard from "../StatsCard";
import { Trophy, Users, Calendar, Target } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      <StatsCard title="Tournaments" value={12} icon={Trophy} accentColor="primary" />
      <StatsCard title="Teams" value={48} icon={Users} accentColor="chart-2" />
      <StatsCard title="Matches" value={156} icon={Calendar} accentColor="chart-3" />
      <StatsCard title="Goals Scored" value={423} icon={Target} accentColor="chart-4" />
    </div>
  );
}
