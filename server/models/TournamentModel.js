// server/models/TournamentModel.js
import { pool } from "../db.js";

export const TournamentModel = {
  // 🔹 Recupera tutti i tornei
  async getAll() {
    const [rows] = await pool.query("SELECT * FROM tournaments");
    return rows;
  },

  // 🔹 Recupera torneo per ID (con eventuale struttura salvata)
  async getById(id) {
    const [rows] = await pool.query(
      `SELECT t.*, ts.data AS structure
       FROM tournaments t
       LEFT JOIN tournament_structure ts ON ts.tournament_id = t.id
       WHERE t.id = ?`,
      [id]
    );

    if (!rows[0]) return null;

    const tournament = rows[0];
    if (tournament.structure) {
      try {
        tournament.structure = JSON.parse(tournament.structure);
      } catch {
        tournament.structure = null;
      }
    }

    return tournament;
  },

  // 🔹 Crea nuovo torneo
  async create(data) {
    const {
      name,
      start_date,
      end_date,
      status,
      type,
      total_teams,
      group_size,
      knockout_rounds,
    } = data;

    const [result] = await pool.query(
      `INSERT INTO tournaments 
        (name, start_date, end_date, status, type, total_teams, group_size, knockout_rounds)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        start_date || null,
        end_date || null,
        status || "upcoming",
        type || "league",
        total_teams || null,
        group_size || null,
        knockout_rounds || null,
      ]
    );

    return this.getById(result.insertId);
  },

  // 🔹 Aggiorna torneo
  async update(id, data) {
    const allowedFields = [
      "name",
      "location",
      "start_date",
      "end_date",
      "status",
      "type",
      "total_teams",
      "group_size",
      "knockout_rounds",
    ];

    const fields = [];
    const values = [];

    for (const key in data) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    if (fields.length === 0) return this.getById(id);

    values.push(id);
    await pool.query(
      `UPDATE tournaments SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return this.getById(id);
  },

  // 🔹 Elimina torneo
  async delete(id) {
    const [result] = await pool.query(
      "DELETE FROM tournaments WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },

  // 🆕 SALVA la struttura (gironi + knockout)
  async saveStructure(tournamentId, structure) {
    const jsonData = JSON.stringify(structure);

    await pool.query(
      `INSERT INTO tournament_structure (tournament_id, data)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [tournamentId, jsonData]
    );

    return { success: true };
  },
};
