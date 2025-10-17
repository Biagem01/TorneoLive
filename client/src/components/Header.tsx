import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Settings, Moon, Sun } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [location] = useLocation();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
    console.log("Theme toggled:", !isDark ? "dark" : "light");
  };

  const toggleAdmin = () => {
    setIsAdmin(!isAdmin);
    console.log("Admin mode:", !isAdmin);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 hover-elevate px-3 py-2 rounded-lg" data-testid="link-home">
            <Trophy className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold font-display">TorneoLive</span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Link href="/" data-testid="link-tournaments">
              <Button variant={location === "/" ? "default" : "ghost"}>
                Tournaments
              </Button>
            </Link>
            <Link href="/admin" data-testid="link-admin">
              <Button variant={location === "/admin" ? "default" : "ghost"}>
                Admin
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Badge className="bg-chart-3 text-foreground" data-testid="badge-admin-mode">
                Admin Mode
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleAdmin}
              data-testid="button-toggle-admin"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-toggle-theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
