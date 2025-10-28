import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, Clock, Plus, Trash2, Save, X, Target } from "lucide-react";
import type { Player, GoalScorer, MatchWithScorers } from "@/types";

interface MatchEditFormProps {
  match: MatchWithScorers;
  onSave: (updated: {
    scoreA: number;
    scoreB: number;
    status: string;
    matchDate: Date;
    scorersA: GoalScorer[];
    scorersB: GoalScorer[];
  }) => void;
  onClose: () => void;
}

// ✅ URL base per le API
const API_BASE = "http://localhost:5001/api";

export default function MatchEditForm({ match, onSave, onClose }: MatchEditFormProps) {
  const [scoreA, setScoreA] = useState(match.scoreA ?? 0);
  const [scoreB, setScoreB] = useState(match.scoreB ?? 0);
  const [status, setStatus] = useState(match.status ?? "scheduled");
  const [date, setDate] = useState(
    match.matchDate
      ? new Date(match.matchDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );

  const [playersA, setPlayersA] = useState<Player[]>([]);
  const [playersB, setPlayersB] = useState<Player[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);

  const [scorersA, setScorersA] = useState<GoalScorer[]>([]);
  const [scorersB, setScorersB] = useState<GoalScorer[]>([]);

  const [newScorerA, setNewScorerA] = useState({ playerId: "", minute: "" });
  const [newScorerB, setNewScorerB] = useState({ playerId: "", minute: "" });

  // ✅ Imposta i marcatori iniziali
 useEffect(() => {
  setScorersA(match.scorersA ?? []);
  setScorersB(match.scorersB ?? []);
}, [match]);

  // ✅ Caricamento giocatori con URL assoluti
  useEffect(() => {
    if (!match?.teamAId || !match?.teamBId) return;

    const fetchPlayers = async () => {
      setLoadingPlayers(true);
      try {
        const [resA, resB] = await Promise.all([
          fetch(`${API_BASE}/teams/${match.teamAId}/players`),
          fetch(`${API_BASE}/teams/${match.teamBId}/players`),
        ]);

        if (!resA.ok || !resB.ok) throw new Error("Errore nel caricamento giocatori");

        const [dataA, dataB] = await Promise.all([resA.json(), resB.json()]);
        setPlayersA(dataA);
        setPlayersB(dataB);
      } catch (err) {
        console.error("❌ Errore caricamento giocatori:", err);
        setPlayersA([]);
        setPlayersB([]);
      } finally {
        setLoadingPlayers(false);
      }
    };

    fetchPlayers();
  }, [match?.teamAId, match?.teamBId]);

  // ✅ Aggiungi marcatore team A
  const addScorerA = () => {
    if (!newScorerA.playerId || !newScorerA.minute) return;
    const player = playersA.find((p) => String(p.id) === newScorerA.playerId);
    if (!player) return;

    const updated = [
      ...scorersA,
      { playerId: player.id, playerName: player.name, minute: Number(newScorerA.minute) },
    ];
    updated.sort((a, b) => a.minute - b.minute);
    setScorersA(updated);
    setNewScorerA({ playerId: "", minute: "" });
  };

  // ✅ Aggiungi marcatore team B
  const addScorerB = () => {
    if (!newScorerB.playerId || !newScorerB.minute) return;
    const player = playersB.find((p) => String(p.id) === newScorerB.playerId);
    if (!player) return;

    const updated = [
      ...scorersB,
      { playerId: player.id, playerName: player.name, minute: Number(newScorerB.minute) },
    ];
    updated.sort((a, b) => a.minute - b.minute);
    setScorersB(updated);
    setNewScorerB({ playerId: "", minute: "" });
  };

  // ✅ Rimuovi marcatore
  const removeScorerA = (i: number) => setScorersA((prev) => prev.filter((_, idx) => idx !== i));
  const removeScorerB = (i: number) => setScorersB((prev) => prev.filter((_, idx) => idx !== i));

  // ✅ Salvataggio (PUT verso backend)
  // ✅ Salvataggio (PUT verso backend) con cookie
const handleSave = async () => {
  try {
    const response = await fetch(`${API_BASE}/matches/${match.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ← fondamentale per inviare il cookie
      body: JSON.stringify({
  scoreTeam1: scoreA,
  scoreTeam2: scoreB,
  status,
  match_date: new Date(date),
  scorersA,
  scorersB,
})
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Errore nel salvataggio della partita: ${text}`);
    }

    console.log("✅ Match aggiornato con successo");
    onSave({ scoreA, scoreB, status, matchDate: new Date(date), scorersA, scorersB });
  } catch (err) {
    console.error("❌ Errore durante il salvataggio:", err);
    alert(`Errore nel salvataggio. ${err}`);
  }
};


  // ✅ Configurazioni stato
  const statusConfig = {
    scheduled: { label: "Programmata", color: "bg-blue-500", icon: "📅" },
    live: { label: "Live", color: "bg-red-500 animate-pulse", icon: "🔴" },
    final: { label: "Finale", color: "bg-emerald-500", icon: "✅" },
  };

  return (
    <div className="space-y-5" data-testid="match-edit-form">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Modifica Partita</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Aggiorna risultati e marcatori</p>
          </div>
        </div>
        <Badge className={`${statusConfig[status as keyof typeof statusConfig].color} text-white px-3 py-1`}>
          {statusConfig[status as keyof typeof statusConfig].icon}{" "}
          {statusConfig[status as keyof typeof statusConfig].label}
        </Badge>
      </div>

      {/* Score Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-500" />
          Risultato
        </h3>
        
        {/* Team A Score */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            {match.teamAName}
          </label>
          <Input
            type="number"
            value={scoreA}
            onChange={(e) => setScoreA(Number(e.target.value))}
            className="text-center text-3xl font-black h-16 bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl"
            min="0"
            data-testid="input-score-team-a"
          />
        </div>

        {/* Team B Score */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            {match.teamBName}
          </label>
          <Input
            type="number"
            value={scoreB}
            onChange={(e) => setScoreB(Number(e.target.value))}
            className="text-center text-3xl font-black h-16 bg-red-50 dark:bg-red-950/30 border-2 border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-500 rounded-xl"
            min="0"
            data-testid="input-score-team-b"
          />
        </div>
      </div>

      {/* Match Details */}
      <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-500" />
          Dettagli
        </h3>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1 mb-2">
              <Clock className="w-3 h-3" />
              Stato
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-10 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600" data-testid="select-status">
                <SelectValue placeholder="Seleziona stato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">📅 Programmata</SelectItem>
                <SelectItem value="live">🔴 Live</SelectItem>
                <SelectItem value="final">✅ Finale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1 mb-2">
              <Calendar className="w-3 h-3" />
              Data
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-10 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600"
              data-testid="input-date"
            />
          </div>
        </div>
      </div>

      {/* Team A Scorers */}
      <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          {match.teamAName} - Marcatori
        </h3>
        
        <div className="space-y-2">
          <Select
            value={newScorerA.playerId}
            onValueChange={(val) => setNewScorerA({ ...newScorerA, playerId: val })}
          >
            <SelectTrigger className="h-10 text-sm bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800" data-testid="select-player-team-a">
              <SelectValue placeholder={loadingPlayers ? "Caricamento..." : "Giocatore"} />
            </SelectTrigger>
            <SelectContent>
              {playersA.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={newScorerA.minute}
              onChange={(e) => setNewScorerA({ ...newScorerA, minute: e.target.value })}
              className="w-20 h-10 text-sm bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
              min="1"
              max="120"
              data-testid="input-minute-team-a"
            />
            <Button
              onClick={addScorerA}
              size="sm"
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
              data-testid="button-add-scorer-team-a"
            >
              <Plus className="w-4 h-4 mr-1" />
              Aggiungi
            </Button>
          </div>
        </div>

        <div className="space-y-1.5 max-h-32 overflow-y-auto">
          {scorersA.length === 0 ? (
            <p className="text-xs text-center py-4 text-slate-400 dark:text-slate-600">Nessun marcatore</p>
          ) : (
            scorersA.map((s, i) => (
              <div
                key={i}
                className="group flex items-center justify-between bg-blue-50 dark:bg-blue-950/20 p-2.5 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-all"
                data-testid={`scorer-team-a-${i}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                    {s.minute}'
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{s.playerName}</span>
                </div>
                <button
                  onClick={() => removeScorerA(i)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md bg-red-500 hover:bg-red-600 text-white transition-all"
                  data-testid={`button-remove-scorer-team-a-${i}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Team B Scorers */}
      <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          {match.teamBName} - Marcatori
        </h3>
        
        <div className="space-y-2">
          <Select
            value={newScorerB.playerId}
            onValueChange={(val) => setNewScorerB({ ...newScorerB, playerId: val })}
          >
            <SelectTrigger className="h-10 text-sm bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800" data-testid="select-player-team-b">
              <SelectValue placeholder={loadingPlayers ? "Caricamento..." : "Giocatore"} />
            </SelectTrigger>
            <SelectContent>
              {playersB.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={newScorerB.minute}
              onChange={(e) => setNewScorerB({ ...newScorerB, minute: e.target.value })}
              className="w-20 h-10 text-sm bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
              min="1"
              max="120"
              data-testid="input-minute-team-b"
            />
            <Button
              onClick={addScorerB}
              size="sm"
              className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
              data-testid="button-add-scorer-team-b"
            >
              <Plus className="w-4 h-4 mr-1" />
              Aggiungi
            </Button>
          </div>
        </div>

        <div className="space-y-1.5 max-h-32 overflow-y-auto">
          {scorersB.length === 0 ? (
            <p className="text-xs text-center py-4 text-slate-400 dark:text-slate-600">Nessun marcatore</p>
          ) : (
            scorersB.map((s, i) => (
              <div
                key={i}
                className="group flex items-center justify-between bg-red-50 dark:bg-red-950/20 p-2.5 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-950/30 transition-all"
                data-testid={`scorer-team-b-${i}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    {s.minute}'
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{s.playerName}</span>
                </div>
                <button
                  onClick={() => removeScorerB(i)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md bg-red-500 hover:bg-red-600 text-white transition-all"
                  data-testid={`button-remove-scorer-team-b-${i}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Button
          variant="outline"
          onClick={onClose}
          className="px-6 border-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          data-testid="button-cancel"
        >
          <X className="w-4 h-4 mr-2" />
          Annulla
        </Button>
        <Button
          onClick={handleSave}
          className="px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg"
          data-testid="button-save"
        >
          <Save className="w-4 h-4 mr-2" />
          Salva
        </Button>
      </div>
    </div>
  );
}
