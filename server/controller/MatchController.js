import Match from "../models/MatchModel.js";
import { pool } from "../db.js";

class MatchController {
  // 📌 CREA NUOVO MATCH
  static async create(req, res) {
    try {
      const {
        tournament_id,
        team1_id,
        team2_id,
        match_date,
        scoreTeam1,
        scoreTeam2,
        status = "scheduled",
        scorersA = [],
        scorersB = [],
      } = req.body;

      if (!tournament_id || !team1_id || !team2_id) {
        return res.status(400).json({ error: "Required fields missing" });
      }

      const matchDateFormatted = new Date(match_date)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      const statusLower = status.toLowerCase();

      const match = await Match.create({
        tournamentId: tournament_id,
        team1Id: team1_id,
        team2Id: team2_id,
        scoreTeam1: scoreTeam1 ?? 0,
        scoreTeam2: scoreTeam2 ?? 0,
        matchDate: matchDateFormatted,
        status: statusLower,
      });

      const insertGoals = async (scorers, teamId) => {
        for (const scorer of scorers) {
          if (scorer.player && scorer.minute) {
            const minute = parseInt(scorer.minute);
            if (isNaN(minute)) continue;
            await pool.execute(
              `INSERT INTO scores 
                 (match_id, team_id, player_id, minute, points, created_at)
               VALUES (?, ?, ?, ?, ?, NOW())`,
              [match.id, teamId, scorer.player, minute, 1]
            );
          }
        }
      };

      await insertGoals(scorersA, team1_id);
      await insertGoals(scorersB, team2_id);

      res.status(201).json(match);
    } catch (error) {
      console.error("❌ Error creating match:", error);
      res.status(500).json({ error: "Failed to create match" });
    }
  }

  // 📌 MATCH PER TORNEO
  static async getByTournament(req, res) {
    try {
      const { tournamentId } = req.params;
      const matches = await Match.findByTournament(tournamentId);
      res.json(matches);
    } catch (error) {
      console.error("❌ Error fetching matches:", error);
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  }

  // 📌 MATCH PER ID
  static async getById(req, res) {
    try {
      const { id } = req.params;

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
        teamAId: row.team1_id,
        teamBId: row.team2_id,
        teamAName: row.team1_name,
        teamBName: row.team2_name,
        scoreA: row.score_team1 ?? 0,
        scoreB: row.score_team2 ?? 0,
        matchDate: row.match_date,
        goalScorersA,
        goalScorersB,
      });
    } catch (error) {
      console.error("❌ Error fetching match by ID:", error);
      res.status(500).json({ error: "Failed to fetch match" });
    }
  }

  // 📌 AGGIORNA MATCH (senza eliminare goal esistenti)
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { scoreTeam1, scoreTeam2, status, scorersA = [], scorersB = [] } = req.body;

      const [existing] = await pool.execute("SELECT * FROM matches WHERE id = ?", [id]);
      if (!existing.length) {
        return res.status(404).json({ error: "Match not found" });
      }
      const match = existing[0];

      await pool.execute(
        `UPDATE matches 
         SET score_team1 = ?, 
             score_team2 = ?, 
             status = ?
         WHERE id = ?`,
        [
          scoreTeam1 ?? match.score_team1,
          scoreTeam2 ?? match.score_team2,
          status?.toLowerCase() ?? match.status,
          id,
        ]
      );

      // Inserisci solo i nuovi goal che non esistono ancora
      const insertGoalsIfNew = async (scorers, teamId) => {
        for (const scorer of scorers) {
          const playerId = scorer.playerId || scorer.player;
          const minute = parseInt(scorer.minute);
          if (!playerId || isNaN(minute)) continue;

          const [existingGoal] = await pool.execute(
            `SELECT * FROM scores WHERE match_id = ? AND team_id = ? AND player_id = ? AND minute = ?`,
            [id, teamId, playerId, minute]
          );

          if (existingGoal.length === 0) {
            await pool.execute(
              `INSERT INTO scores (match_id, team_id, player_id, minute, points, created_at)
               VALUES (?, ?, ?, ?, ?, NOW())`,
              [id, teamId, playerId, minute, 1]
            );
          }
        }
        
      };

      await insertGoalsIfNew(scorersA, match.team1_id);
      await insertGoalsIfNew(scorersB, match.team2_id);

      res.json({ message: "✅ Match updated successfully" });
    } catch (error) {
      console.error("❌ Failed to update match:", error);
      res.status(500).json({ error: "Failed to update match" });
    }
  }

  static async recalculateStandings(tournamentId) {
  try {
    // 1️⃣ Prendiamo tutte le partite finali di quel torneo
    const [matches] = await pool.execute(
      `SELECT * FROM matches WHERE tournament_id = ? AND status = 'final'`,
      [tournamentId]
    );

    // 2️⃣ Reset dei punti per tutte le squadre del torneo
    await pool.execute(
      `UPDATE teams SET wins = 0, draws = 0, losses = 0, points = 0 WHERE tournament_id = ?`,
      [tournamentId]
    );

    // 3️⃣ Ricalcolo manuale
    for (const m of matches) {
      if (m.score_team1 > m.score_team2) {
        await pool.execute(
          `UPDATE teams SET wins = wins + 1, points = points + 3 WHERE id = ?`,
          [m.team1_id]
        );
        await pool.execute(
          `UPDATE teams SET losses = losses + 1 WHERE id = ?`,
          [m.team2_id]
        );
      } else if (m.score_team1 < m.score_team2) {
        await pool.execute(
          `UPDATE teams SET wins = wins + 1, points = points + 3 WHERE id = ?`,
          [m.team2_id]
        );
        await pool.execute(
          `UPDATE teams SET losses = losses + 1 WHERE id = ?`,
          [m.team1_id]
        );
      } else {
        await pool.execute(
          `UPDATE teams SET draws = draws + 1, points = points + 1 WHERE id IN (?, ?)`,
          [m.team1_id, m.team2_id]
        );
      }
    }

    console.log("✅ Classifica ricalcolata per il torneo", tournamentId);
  } catch (error) {
    console.error("❌ Errore nel ricalcolo classifica:", error);
  }
}

}



export default MatchController;
