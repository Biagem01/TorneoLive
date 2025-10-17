import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, LogOut, Moon, Sun, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function Header() {
  const [isDark, setIsDark] = useState(true);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
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
                Tornei
              </Button>
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin" data-testid="link-admin">
                <Button variant={location === "/admin" ? "default" : "ghost"}>
                  Admin
                </Button>
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {user.email}
                </Badge>
                {user.role === "admin" && (
                  <Badge className="bg-orange-500">Admin</Badge>
                )}
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-toggle-theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => logoutMutation.mutate()}
                data-testid="button-logout"
                title="Esci"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
