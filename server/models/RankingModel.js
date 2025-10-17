import { pool } from "../db.js";

/**
 * Recupera tutte le partite di un torneo (con nomi squadre)
 * e ritorna l'array raw di match per il controller/calcoli.
 */
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
