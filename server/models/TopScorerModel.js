import { pool } from "../db.js";

/**
 * Recupera la classifica marcatori per torneo
 * Restituisce array con player_id, player_name, team_id, team_name, goals
 */
export async function getTopScorersByTournament(tournamentId) {
  const [rows] = await pool.execute(
    `SELECT p.id AS player_id,
            p.name AS player_name,
            t.id AS team_id,
            t.name AS team_name,
            SUM(s.points) AS goals
     FROM scores s
     JOIN players p ON s.player_id = p.id
     JOIN teams t ON p.team_id = t.id
     JOIN matches m ON s.match_id = m.id
     WHERE m.tournament_id = ?
     GROUP BY p.id, p.name, t.id, t.name
     ORDER BY goals DESC`,
    [tournamentId]
  );

  return rows;
}
