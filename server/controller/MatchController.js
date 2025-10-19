import Match from "../models/MatchModel.js";
import { pool } from "../db.js";

class MatchController {
  static async create(req, res) {
    try {
      const {
        tournament_id,
        team1_id,
        team2_id,
        match_date,
        scoreTeam1,
        scoreTeam2,
        scorersA = [],
        scorersB = [],
      } = req.body;

      if (!tournament_id || !team1_id || !team2_id || !match_date) {
        return res.status(400).json({ error: "Required fields missing" });
      }

      // Formatta la data in 'YYYY-MM-DD HH:MM:SS'
      const matchDateFormatted = new Date(match_date)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      // Crea il match
      const match = await Match.create({
        tournamentId: tournament_id,
        team1Id: team1_id,
        team2Id: team2_id,
        scoreTeam1: scoreTeam1 ?? 0,
        scoreTeam2: scoreTeam2 ?? 0,
        matchDate: matchDateFormatted,
      });

      // Funzione helper per inserire goal
      const insertGoals = async (scorers, teamId) => {
        for (const scorer of scorers) {
          if (scorer.player && scorer.minute) {
            const minute = parseInt(scorer.minute);
            if (isNaN(minute)) continue; // Salta valori non validi
            await pool.execute(
              `INSERT INTO scores 
                (match_id, team_id, player_id, minute, points, created_at)
               VALUES (?, ?, ?, ?, ?, NOW())`,
              [match.id, teamId, scorer.player, minute, 1] // points = 1 per goal
            );
          }
        }
      };

      // Inserisci goal squadra A e B
      await insertGoals(scorersA, team1_id);
      await insertGoals(scorersB, team2_id);

      res.status(201).json(match);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create match" });
    }
  }

  static async getByTournament(req, res) {
    try {
      const { tournamentId } = req.params;
      const matches = await Match.findByTournament(tournamentId);
      res.json(matches);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  }

  static async getById(req, res) {
  try {
    const { id } = req.params;

    // Recupera match e nomi squadre
    const [rows] = await pool.execute(
      `SELECT m.*, 
              t1.name AS team1_name, 
              t2.name AS team2_name
       FROM matches m
       JOIN teams t1 ON m.team1_id = t1.id
       JOIN teams t2 ON m.team2_id = t2.id
       WHERE m.id = ?`,
      [Number(id)]
    );

    if (!rows.length) return res.status(404).json({ error: "Match not found" });
    const row = rows[0];

    // Recupera goal scorers
    const [goals] = await pool.execute(
      `SELECT s.team_id, p.name AS player_name, s.minute
       FROM scores s
       JOIN players p ON s.player_id = p.id
       WHERE s.match_id = ?`,
      [row.id]
    );

    const goalScorersA = goals
      .filter(g => g.team_id === row.team1_id)
      .map(g => ({ playerName: g.player_name, minute: g.minute }));

    const goalScorersB = goals
      .filter(g => g.team_id === row.team2_id)
      .map(g => ({ playerName: g.player_name, minute: g.minute }));

    res.json({
      id: row.id,
      tournamentId: String(row.tournament_id),
      teamAId: String(row.team1_id),
      teamBId: String(row.team2_id),
      teamAName: row.team1_name,
      teamBName: row.team2_name,
      scoreA: row.score_team1 ?? 0,
      scoreB: row.score_team2 ?? 0,
      matchDate: row.match_date,
      goalScorersA,
      goalScorersB
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch match" });
  }
}

}

export default MatchController;
