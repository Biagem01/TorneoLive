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
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group hover:opacity-90 transition-opacity" data-testid="link-home">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 transition-all duration-300">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl sm:text-3xl font-display font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              TorneoLive
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Link href="/" data-testid="link-tournaments">
              <Button 
                variant={location === "/" ? "default" : "ghost"}
                className={`font-semibold ${
                  location === "/" 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/30 text-white" 
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                Tornei
              </Button>
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin" data-testid="link-admin">
                <Button 
                  variant={location === "/admin" ? "default" : "ghost"}
                  className={`font-semibold ${
                    location === "/admin" 
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 text-white" 
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  Admin
                </Button>
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-2 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-200 border-0 font-semibold shadow-md">
                  <User className="w-3 h-3" />
                  <span className="font-sans">{user.email}</span>
                </Badge>
                {user.role === "admin" && (
                  <Badge className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white border-0 shadow-lg shadow-orange-500/40 font-display font-bold">
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
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-300"
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
                className="text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800 animate-slideDown">
            <nav className="flex flex-col gap-2">
              <Link href="/" data-testid="link-tournaments-mobile">
                <Button 
                  variant={location === "/" ? "default" : "ghost"}
                  className={`w-full justify-start font-semibold ${
                    location === "/" 
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md" 
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Tornei
                </Button>
              </Link>
              {user?.role === "admin" && (
                <Link href="/admin" data-testid="link-admin-mobile">
                  <Button 
                    variant={location === "/admin" ? "default" : "ghost"}
                    className={`w-full justify-start font-semibold ${
                      location === "/admin" 
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md" 
                        : "text-slate-700 dark:text-slate-300"
                    }`}
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
