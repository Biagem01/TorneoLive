// RankingModel.js
import { pool } from "../db.js";

export async function getMatchesByTournament(tournamentId) {
  const [rows] = await pool.execute(
    `SELECT m.*,
            t1.name AS team1_name,
            t2.name AS team2_name
     FROM matches m
     JOIN teams t1 ON m.team1_id = t1.id
     JOIN teams t2 ON m.team2_id = t2.id
     WHERE m.tournament_id = ?
     ORDER BY m.match_date ASC`,
    [tournamentId]
  );

  return rows;
}

// Nuova funzione per prendere la struttura dei gironi
export async function getTournamentStructure(tournamentId) {
  const [rows] = await pool.execute(
    "SELECT data FROM tournament_structure WHERE tournament_id = ?",
    [tournamentId]
  );

  if (!rows.length) return null;

  const data = rows[0].data;

  // se è stringa, parsala, altrimenti restituisci direttamente l'oggetto
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (err) {
      console.error("Failed to parse tournament_structure data:", err, data);
      return null;
    }
  }

  return data;
}

