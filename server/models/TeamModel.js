import { pool } from "../db.js";

export const TeamModel = {
  async getByTournamentId(tournamentId) {
    const [rows] = await pool.query(
      "SELECT * FROM teams WHERE tournament_id = ?",
      [tournamentId]
    );
    return rows;
  },

  async getAll() {
  const [rows] = await pool.query("SELECT * FROM teams");
  return rows;
},


  async create(data) {
    const { name, tournament_id } = data;
    const [result] = await pool.query(
      "INSERT INTO teams (name, tournament_id) VALUES (?, ?)",
      [name, tournament_id]
    );
    const [rows] = await pool.query("SELECT * FROM teams WHERE id = ?", [result.insertId]);
    return rows[0];
  },
};
