import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Mail, Lock, CheckCircle, Shield, Sparkles } from "lucide-react";

export default function Auth() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerSuccessEmail, setRegisterSuccessEmail] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  if (user) return <Redirect to="/" />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email: loginEmail, password: loginPassword });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(
      { email: registerEmail, password: registerPassword, role: "user" },
      {
        onSuccess: () => setRegisterSuccessEmail(registerEmail),
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent"></div>
      
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="hidden lg:flex flex-col justify-center text-slate-900 dark:text-white space-y-8 p-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-2">
                <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Piattaforma Professionale</span>
              </div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                TorneoLive
              </h1>
            </div>
          </div>
          
          <div>
            <h2 className="text-4xl font-bold leading-tight mb-4 text-slate-900 dark:text-white">
              Gestisci i tuoi tornei di calcio in tempo reale
            </h2>
            <p className="text-xl text-slate-700 dark:text-slate-300">
              La piattaforma completa per creare, gestire e visualizzare tornei, squadre, giocatori e statistiche live.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Trophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-slate-900 dark:text-white">Classifiche in tempo reale</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Aggiornamenti istantanei dopo ogni partita</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-slate-900 dark:text-white">Gestione partite e goal</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Traccia ogni dettaglio delle tue partite</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-slate-900 dark:text-white">Statistiche marcatori</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Monitora i migliori giocatori del torneo</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="w-full max-w-md mx-auto border-slate-300 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-3xl text-slate-900 dark:text-white font-bold">Benvenuto</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400 text-base">
              Accedi o registrati per continuare
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-200 dark:bg-slate-800 p-1">
                <TabsTrigger value="login" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                  Accedi
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                  Registrati
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-slate-700 dark:text-slate-200 text-sm font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="tua@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-11 h-12 bg-slate-50 dark:bg-slate-950/50 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-slate-700 dark:text-slate-200 text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-11 h-12 bg-slate-50 dark:bg-slate-950/50 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02]"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Accesso in corso..." : "Accedi"}
                  </Button>
                  <div className="p-3 bg-emerald-100 dark:bg-slate-800/50 rounded-lg border border-emerald-200 dark:border-slate-700/50">
                    <p className="text-xs text-center text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-slate-900 dark:text-slate-300">Account Admin:</span><br />
                      admin@torneolive.com / admin123
                    </p>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="register">
                {registerSuccessEmail ? (
                  <div className="text-center space-y-6 p-6">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-3">Registrazione completata!</h2>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        Abbiamo inviato una email di verifica a<br />
                        <span className="font-semibold text-slate-900 dark:text-white">{registerSuccessEmail}</span>
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mt-3">
                        Controlla la tua casella di posta e clicca sul link per attivare il tuo account.
                      </p>
                    </div>
                    <Button
                      className="bg-emerald-500 hover:bg-emerald-600 w-full h-12 font-semibold"
                      onClick={() => {
                        setRegisterSuccessEmail(null);
                        setLocation("/auth");
                      }}
                    >
                      Torna al login
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-slate-700 dark:text-slate-200 text-sm font-medium">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="tua@email.com"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          className="pl-11 h-12 bg-slate-50 dark:bg-slate-950/50 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-slate-700 dark:text-slate-200 text-sm font-medium">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="••••••••"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          className="pl-11 h-12 bg-slate-50 dark:bg-slate-950/50 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02]"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Registrazione..." : "Registrati"}
                    </Button>
                  </form>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
