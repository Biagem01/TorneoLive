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
  const colorConfig = {
    primary: {
      gradient: "from-emerald-500 to-teal-500",
      bg: "from-emerald-500/10 to-teal-500/10",
      shadow: "shadow-emerald-500/20",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-600 dark:text-emerald-400"
    },
    "chart-2": {
      gradient: "from-blue-500 to-cyan-500",
      bg: "from-blue-500/10 to-cyan-500/10",
      shadow: "shadow-blue-500/20",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    "chart-3": {
      gradient: "from-purple-500 to-pink-500",
      bg: "from-purple-500/10 to-pink-500/10",
      shadow: "shadow-purple-500/20",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-600 dark:text-purple-400"
    },
    "chart-4": {
      gradient: "from-orange-500 to-red-500",
      bg: "from-orange-500/10 to-red-500/10",
      shadow: "shadow-orange-500/20",
      iconBg: "bg-orange-500/20",
      iconColor: "text-orange-600 dark:text-orange-400"
    },
  };

  const config = colorConfig[accentColor];

  return (
    <Card 
      className={`group relative overflow-hidden border-slate-300 dark:border-slate-800 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 hover:border-slate-400 dark:hover:border-slate-700 transition-all duration-300 hover:scale-105 hover:shadow-xl ${config.shadow}`}
      data-testid={`card-stat-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${config.bg} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
      
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${config.iconBg} border border-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform`}>
            <Icon className={`w-6 h-6 ${config.iconColor}`} data-testid="icon-stat" />
          </div>
        </div>
        
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 font-medium" data-testid="text-stat-title">{title}</p>
          <p className={`text-4xl font-bold font-mono bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`} data-testid="text-stat-value">
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}
