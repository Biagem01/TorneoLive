import { pool } from "../db.js";

class Player {
  static async create({ teamId, name, jerseyNumber }) {
    const [result] = await pool.execute(
      `INSERT INTO players (team_id, name, jersey_number) VALUES (?, ?, ?)`,
      [teamId, name, jerseyNumber]
    );

    return {
      id: result.insertId,
      teamId,
      name,
      jerseyNumber
    };
  }

  static async findByTeam(teamId) {
    const [rows] = await pool.execute(
      `SELECT id, team_id AS teamId, name, jersey_number AS jerseyNumber FROM players WHERE team_id = ?`,
      [teamId]
    );
    return rows;
  }

  static async delete(id) {
    await pool.execute(`DELETE FROM players WHERE id = ?`, [id]);
  }
}

export default Player;
