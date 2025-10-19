// server/models/TournamentModel.js
import { pool } from "../db.js";

export const TournamentModel = {
  async getAll() {
    const [rows] = await pool.query("SELECT * FROM tournaments");
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query("SELECT * FROM tournaments WHERE id = ?", [id]);
    return rows[0];
  },

 async create(data) {
  const { name, location, start_date, end_date, status } = data;

  // se i valori sono vuoti, manda null
  const [result] = await pool.query(
    "INSERT INTO tournaments (name, start_date, end_date, status) VALUES (?,  ?, ?, ?)",
    [
      name,         // se vuoto, diventa null
      start_date || null,         // se vuoto, diventa null
      end_date || null,            // se vuoto, diventa null
      status || "upcoming"
    ]
  );

  return this.getById(result.insertId);
},

  async update(id, data) {
    const fields = [];
    const values = [];
    for (const key in data) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
    if (fields.length === 0) return this.getById(id);
    values.push(id);
    await pool.query(`UPDATE tournaments SET ${fields.join(", ")} WHERE id = ?`, values);
    return this.getById(id);
  },

  async delete(id) {
    const [result] = await pool.query("DELETE FROM tournaments WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }
};
