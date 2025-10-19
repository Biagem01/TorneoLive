import { pool } from "../db.js";

class Match {
  // Crea un nuovo match
  static async create({ tournamentId, team1Id, team2Id, scoreTeam1, scoreTeam2, matchDate }) {
    const [result] = await pool.execute(
      `INSERT INTO matches 
        (tournament_id, team1_id, team2_id, score_team1, score_team2, match_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        tournamentId,
        team1Id,
        team2Id,
        scoreTeam1 ?? 0,
        scoreTeam2 ?? 0,
        matchDate
      ]
    );

    return {
      id: result.insertId,
      tournamentId,
      team1Id,
      team2Id,
      scoreTeam1: scoreTeam1 ?? 0,
      scoreTeam2: scoreTeam2 ?? 0,
      matchDate
    };
  }

  // Recupera tutti i match di un torneo
  static async findByTournament(tournamentId) {
  const [rows] = await pool.execute(
    `SELECT m.*, 
            t1.name AS team1_name, 
            t2.name AS team2_name
     FROM matches m
     JOIN teams t1 ON m.team1_id = t1.id
     JOIN teams t2 ON m.team2_id = t2.id
     WHERE m.tournament_id = ?`,
    [tournamentId]
  );

  return rows.map(row => ({
    id: row.id,
    tournamentId: String(row.tournament_id),
    teamAId: String(row.team1_id),
    teamBId: String(row.team2_id),
    teamAName: row.team1_name,
    teamBName: row.team2_name,
    scoreA: row.score_team1 ?? 0,
    scoreB: row.score_team2 ?? 0,
    matchDate: row.match_date
  }));
}


}

export default Match;
