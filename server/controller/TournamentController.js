// server/controller/TournamentController.js
import { TournamentModel } from "../models/TournamentModel.js";
import { pool } from "../db.js";
import { generateGroupKnockoutStructure } from "../utils/tournamentUtils.js";

export const TournamentController = {
  // 🔹 Ottieni tutti i tornei
  async getAll(req, res) {
    try {
      const tournaments = await TournamentModel.getAll();
      const formatted = tournaments.map((t) => ({
        ...t,
        start_date: t.start_date ? new Date(t.start_date).toISOString() : null,
        end_date: t.end_date ? new Date(t.end_date).toISOString() : null,
      }));
      res.json(formatted);
    } catch (error) {
      console.error("❌ ERRORE getAll:", error);
      res.status(500).json({ error: error.message || "Unknown error" });
    }
  },

  // 🔹 Ottieni torneo per ID
  async getById(req, res) {
    try {
      const tournament = await TournamentModel.getById(req.params.id);
      if (!tournament)
        return res.status(404).json({ error: "Tournament not found" });
      res.json(tournament);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tournament" });
    }
  },

  // 🔹 Crea nuovo torneo
  async create(req, res) {
    console.log("BODY:", req.body);
    try {
      const tournament = await TournamentModel.create(req.body);

      // se è di tipo "groupKnockout", inizializza struttura base vuota
      if (req.body.type === "groupKnockout") {
        await pool.query(
          `INSERT INTO tournament_structure (tournament_id, type, data)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE data = VALUES(data)`,
          [tournament.id, "groupKnockout", JSON.stringify({ groups: [], knockout: [] })]
        );
      }

      res.status(201).json(tournament);
    } catch (error) {
      console.error("❌ ERRORE CREATE:", error);
      res.status(400).json({ error: "Invalid tournament data" });
    }
  },

  // 🔹 Aggiorna torneo
  async update(req, res) {
    try {
      const tournament = await TournamentModel.update(req.params.id, req.body);
      if (!tournament)
        return res.status(404).json({ error: "Tournament not found" });
      res.json(tournament);
    } catch (error) {
      res.status(500).json({ error: "Failed to update tournament" });
    }
  },

  // 🔹 Elimina torneo
  async delete(req, res) {
    try {
      const success = await TournamentModel.delete(req.params.id);
      if (!success)
        return res.status(404).json({ error: "Tournament not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete tournament" });
    }
  },

  // 🔹 Genera i gironi (fase a gruppi)
  // 🔹 Genera i gironi (fase a gruppi)
// 🔹 Genera i gironi e i match del torneo
async generateStructure(req, res) {
  try {
    const tournamentId = req.params.id;

    // 1️⃣ Recupera il torneo
    const tournament = await TournamentModel.getById(tournamentId);
    if (!tournament)
      return res.status(404).json({ error: "Tournament not found" });

    // 2️⃣ Recupera le squadre
    const [teams] = await pool.query(
      "SELECT id, name FROM teams WHERE tournament_id = ?",
      [tournamentId]
    );
    if (teams.length === 0) {
      return res.status(400).json({ error: "Nessuna squadra trovata per questo torneo" });
    }

    // 3️⃣ Calcola la dimensione dei gruppi
    const groupSize = tournament.group_size || 4;

    // 4️⃣ Genera la struttura (gironi)
    const structure = generateGroupKnockoutStructure(teams, groupSize);

    // 5️⃣ Salva o aggiorna la struttura nel DB
    await pool.query(
      `INSERT INTO tournament_structure (tournament_id, type, data)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [tournamentId, "groupKnockout", JSON.stringify(structure)]
    );

    // 6️⃣ Elimina eventuali match precedenti (per rigenerare)
    await pool.query("DELETE FROM matches WHERE tournament_id = ?", [tournamentId]);

    // 7️⃣ Genera match "tutti contro tutti" nei gironi
    const createdMatches = [];
    for (const group of structure.groups) {
      const groupTeams = group.teams;
      for (let i = 0; i < groupTeams.length; i++) {
        for (let j = i + 1; j < groupTeams.length; j++) {
          const [result] = await pool.query(
            `INSERT INTO matches (tournament_id, team1_id, team2_id, group_name, status)
             VALUES (?, ?, ?, ?, ?)`,
            [tournamentId, groupTeams[i].id, groupTeams[j].id, group.name, "scheduled"]
          );
          createdMatches.push(result.insertId);
        }
      }
    }

    // 8️⃣ Risposta finale
    res.json({
      message: "✅ Gironi e match generati con successo!",
      totalTeams: teams.length,
      totalGroups: structure.groups.length,
      totalMatches: createdMatches.length,
      structure,
    });

  } catch (error) {
    console.error("❌ ERRORE GENERATE STRUCTURE:", error);
    res.status(500).json({ error: "Errore durante la generazione dei gironi" });
  }
},

async getStructure(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT data FROM tournament_structure WHERE tournament_id = ? ORDER BY id DESC LIMIT 1",
      [req.params.id]
    );

    if (!rows.length)
      return res.status(404).json({ error: "Struttura non trovata" });

    let structure = rows[0].data;

    // controlla se è già un oggetto
    if (typeof structure === "string") {
      structure = JSON.parse(structure);
    }

    res.json(structure);
  } catch (error) {
    console.error("❌ ERRORE GET STRUCTURE:", error);
    res.status(500).json({ error: "Errore nel recupero struttura torneo" });
  }
}


};
