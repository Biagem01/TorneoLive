import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, LogOut, Moon, Sun, User, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 dark:border-slate-800 bg-white dark:bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" data-testid="link-home">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              TorneoLive
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Link href="/" data-testid="link-tournaments">
              <Button 
                variant={location === "/" ? "default" : "ghost"}
                className={location === "/" ? "bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 text-white" : "text-slate-700 dark:text-slate-300"}
              >
                Tornei
              </Button>
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin" data-testid="link-admin">
                <Button 
                  variant={location === "/admin" ? "default" : "ghost"}
                  className={location === "/admin" ? "bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 text-white" : "text-slate-700 dark:text-slate-300"}
                >
                  Admin
                </Button>
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700">
                  <User className="w-3 h-3" />
                  {user.email}
                </Badge>
                {user.role === "admin" && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg shadow-orange-500/20">
                    Admin
                  </Badge>
                )}
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-toggle-theme"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => logoutMutation.mutate()}
                data-testid="button-logout"
                title="Esci"
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800">
            <nav className="flex flex-col gap-2">
              <Link href="/" data-testid="link-tournaments-mobile">
                <Button 
                  variant={location === "/" ? "default" : "ghost"}
                  className={`w-full justify-start ${location === "/" ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "text-slate-700 dark:text-slate-300"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Tornei
                </Button>
              </Link>
              {user?.role === "admin" && (
                <Link href="/admin" data-testid="link-admin-mobile">
                  <Button 
                    variant={location === "/admin" ? "default" : "ghost"}
                    className={`w-full justify-start ${location === "/admin" ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "text-slate-700 dark:text-slate-300"}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
