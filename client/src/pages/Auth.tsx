import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Mail, Lock, CheckCircle } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="hidden lg:flex flex-col justify-center text-white space-y-6 p-8">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center">
              <Trophy className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold">TorneoLive</h1>
          </div>
          <h2 className="text-3xl font-semibold leading-tight">
            Gestisci i tuoi tornei di calcio in tempo reale
          </h2>
          <p className="text-lg text-slate-300">
            La piattaforma completa per creare, gestire e visualizzare tornei, squadre, giocatori e statistiche live.
          </p>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Classifiche in tempo reale
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Gestione partite e goal
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Statistiche marcatori
            </li>
          </ul>
        </div>

        {/* Auth Forms */}
        <Card className="w-full max-w-md mx-auto border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Benvenuto</CardTitle>
            <CardDescription className="text-slate-400">
              Accedi o registrati per continuare
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Accedi</TabsTrigger>
                <TabsTrigger value="register">Registrati</TabsTrigger>
              </TabsList>

              {/* Login */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-slate-200">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="tua@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10 bg-slate-900/50 border-slate-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-slate-200">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10 bg-slate-900/50 border-slate-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Accesso..." : "Accedi"}
                  </Button>
                  <p className="text-xs text-center text-slate-400 mt-4">
                    Admin? Usa: admin@torneolive.com / admin123
                  </p>
                </form>
              </TabsContent>

              {/* Register */}
              <TabsContent value="register">
                {registerSuccessEmail ? (
                  <div className="text-center space-y-6 p-4">
                    <CheckCircle className="mx-auto w-16 h-16 text-green-500" />
                    <h2 className="text-2xl font-bold text-green-500">Registrazione completata!</h2>
                    <p className="text-slate-300">
                      Abbiamo inviato una email di verifica a <span className="font-medium">{registerSuccessEmail}</span>.<br />
                      Controlla la tua casella di posta e clicca sul link per attivare il tuo account.
                    </p>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 w-full"
                      onClick={() => {
                        setRegisterSuccessEmail(null);
                        setLocation("/auth");
                      }}
                    >
                      Torna al login
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-slate-200">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="tua@email.com"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          className="pl-10 bg-slate-900/50 border-slate-600 text-white"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-slate-200">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="••••••••"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          className="pl-10 bg-slate-900/50 border-slate-600 text-white"
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700"
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
