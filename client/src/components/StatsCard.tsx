import { Card } from "@/components/ui/card";
import { LucideIcon, TrendingUp } from "lucide-react";

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
      bg: "from-emerald-500/20 via-teal-500/10 to-transparent",
      shadow: "shadow-emerald-500/30",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
      iconColor: "text-white",
      border: "border-emerald-500/30"
    },
    "chart-2": {
      gradient: "from-blue-500 to-cyan-500",
      bg: "from-blue-500/20 via-cyan-500/10 to-transparent",
      shadow: "shadow-blue-500/30",
      iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
      iconColor: "text-white",
      border: "border-blue-500/30"
    },
    "chart-3": {
      gradient: "from-purple-500 to-pink-500",
      bg: "from-purple-500/20 via-pink-500/10 to-transparent",
      shadow: "shadow-purple-500/30",
      iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
      iconColor: "text-white",
      border: "border-purple-500/30"
    },
    "chart-4": {
      gradient: "from-orange-500 to-red-500",
      bg: "from-orange-500/20 via-red-500/10 to-transparent",
      shadow: "shadow-orange-500/30",
      iconBg: "bg-gradient-to-br from-orange-500 to-red-500",
      iconColor: "text-white",
      border: "border-orange-500/30"
    },
  };

  const config = colorConfig[accentColor];

  return (
    <Card 
      className={`group relative overflow-hidden border-2 ${config.border} bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 hover:border-opacity-70 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${config.shadow}`}
      data-testid={`card-stat-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Animated Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.bg} opacity-40 group-hover:opacity-70 transition-opacity duration-500`}></div>
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      <div className="relative p-6">
        {/* Icon */}
        <div className="flex items-start justify-between mb-6">
          <div className="relative">
            <div className={`absolute -inset-1 bg-gradient-to-br ${config.gradient} rounded-xl opacity-30 blur-sm group-hover:opacity-50 transition-opacity`}></div>
            <div className={`relative ${config.iconBg} p-3 rounded-xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
              <Icon className={`w-7 h-7 ${config.iconColor}`} data-testid="icon-stat" />
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <TrendingUp className={`w-5 h-5 bg-gradient-to-br ${config.gradient} bg-clip-text text-transparent`} />
          </div>
        </div>
        
        {/* Content */}
        <div>
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide" data-testid="text-stat-title">{title}</p>
          <p className={`text-5xl font-black bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent drop-shadow-sm`} data-testid="text-stat-value">
            {value}
          </p>
        </div>

        {/* Decorative corner */}
        <div className={`absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br ${config.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>
      </div>
    </Card>
  );
}
