import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  accentColor?: "primary" | "chart-2" | "chart-3" | "chart-4";
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  accentColor = "primary",
}: StatsCardProps) {
  const colorMap = {
    primary: "text-chart-1",
    "chart-2": "text-chart-2",
    "chart-3": "text-chart-3",
    "chart-4": "text-chart-4",
  };

  return (
    <Card className="p-6" data-testid={`card-stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1" data-testid="text-stat-title">{title}</p>
          <p className="text-3xl font-bold font-mono" data-testid="text-stat-value">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-muted ${colorMap[accentColor]}`}>
          <Icon className="w-6 h-6" data-testid="icon-stat" />
        </div>
      </div>
    </Card>
  );
}
