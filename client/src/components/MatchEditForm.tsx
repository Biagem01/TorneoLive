

// MIGLIORA COMPLETAMENTE IL COMPONENTE MatchEditForm
// Questo form serve per modificare i dettagli di una partita (score, status, date, marcatori)
// Obiettivo: renderlo professionale, moderno, leggibile e dinamico
// - Layout responsive per desktop e mobile
// - Card e input con shadow, bordi arrotondati e spaziatura ariosa
// - Pulsanti moderni con gradient, hover e click effect
// - Palette colori coerente (blu per teamA, rosso per teamB, colori complementari per sfondi e hover)
// - Micro-interazioni: fade-in, hover sulle righe dei marcatori, transizioni smooth
// - Migliora leggibilità di titoli, input e select
// - Mantieni la logica React esistente (state, props, fetch, onSave, onClose)
// - Usa TailwindCSS per styling
// - Form elegante e chiaro, facilmente comprensibile all’utente

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

  // --- INIZIALIZZA MARCATORI ESISTENTI ---
  useEffect(() => {
    setScorersA(match.scorersA || []);
    setScorersB(match.scorersB || []);
  }, [match]);

  // --- FETCH GIOCATORI ---
  useEffect(() => {
    if (!match?.teamAId || !match?.teamBId) return;

    const fetchPlayers = async () => {
      setLoadingPlayers(true);
      try {
        const [resA, resB] = await Promise.all([
          fetch(`http://localhost:5001/api/teams/${match.teamAId}/players`),
          fetch(`http://localhost:5001/api/teams/${match.teamBId}/players`),
        ]);

        if (!resA.ok || !resB.ok) throw new Error("Errore nel caricamento giocatori");

        const [dataA, dataB] = await Promise.all([resA.json(), resB.json()]);
        setPlayersA(dataA);
        setPlayersB(dataB);
      } catch (err) {
        console.error("❌ Failed to fetch players:", err);
        setPlayersA([]);
        setPlayersB([]);
      } finally {
        setLoadingPlayers(false);
      }
    };

    fetchPlayers();
  }, [match?.teamAId, match?.teamBId]);

  // --- AGGIUNTA / RIMOZIONE MARCATORI ---
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

  const removeScorerA = (i: number) => {
    const updated = scorersA.filter((_, idx) => idx !== i);
    setScorersA(updated);
  };

  const removeScorerB = (i: number) => {
    const updated = scorersB.filter((_, idx) => idx !== i);
    setScorersB(updated);
  };

  // --- SALVATAGGIO ---
  const handleSave = () => {
    onSave({
      scoreA,
      scoreB,
      status,
      matchDate: new Date(date),
      scorersA,
      scorersB,
    });
  };

  // --- RENDER ---
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center mb-4">Modifica partita</h2>

      {/* SCORE INPUTS */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-medium">{match.teamAName}</span>
          <Input
            type="number"
            value={scoreA}
            onChange={(e) => setScoreA(Number(e.target.value))}
            className="w-16 text-center"
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">{match.teamBName}</span>
          <Input
            type="number"
            value={scoreB}
            onChange={(e) => setScoreB(Number(e.target.value))}
            className="w-16 text-center"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Stato</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Seleziona stato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="final">Final</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Data</label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>

      {/* GOAL SCORERS */}
      <div className="space-y-6 mt-4">
        {/* TEAM A */}
        <div>
          <h3 className="font-semibold text-lg mb-2 text-blue-600">{match.teamAName} Marcatori</h3>
          <div className="flex gap-2 mb-2">
            <Select
              value={newScorerA.playerId}
              onValueChange={(val) => setNewScorerA({ ...newScorerA, playerId: val })}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={loadingPlayers ? "Caricamento..." : "Seleziona giocatore"} />
              </SelectTrigger>
              <SelectContent>
                {playersA.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Min"
              value={newScorerA.minute}
              onChange={(e) => setNewScorerA({ ...newScorerA, minute: e.target.value })}
              className="w-20"
            />
            <Button onClick={addScorerA}>Aggiungi</Button>
          </div>

          {scorersA.map((s, i) => (
            <div key={i} className="flex justify-between bg-blue-50 p-2 rounded mb-1">
              <span>{s.playerName} - {s.minute}'</span>
              <button onClick={() => removeScorerA(i)} className="text-red-600">✕</button>
            </div>
          ))}
        </div>

        {/* TEAM B */}
        <div>
          <h3 className="font-semibold text-lg mb-2 text-red-600">{match.teamBName} Marcatori</h3>
          <div className="flex gap-2 mb-2">
            <Select
              value={newScorerB.playerId}
              onValueChange={(val) => setNewScorerB({ ...newScorerB, playerId: val })}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={loadingPlayers ? "Caricamento..." : "Seleziona giocatore"} />
              </SelectTrigger>
              <SelectContent>
                {playersB.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Min"
              value={newScorerB.minute}
              onChange={(e) => setNewScorerB({ ...newScorerB, minute: e.target.value })}
              className="w-20"
            />
            <Button onClick={addScorerB}>Aggiungi</Button>
          </div>

          {scorersB.map((s, i) => (
            <div key={i} className="flex justify-between bg-red-50 p-2 rounded mb-1">
              <span>{s.playerName} - {s.minute}'</span>
              <button onClick={() => removeScorerB(i)} className="text-red-600">✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>Annulla</Button>
        <Button onClick={handleSave}>Salva</Button>
      </div>
    </div>
  );
}
