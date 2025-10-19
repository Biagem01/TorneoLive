// server/controller/TournamentController.js
import { TournamentModel } from "../models/TournamentModel.js";

export const TournamentController = {
 async getAll(req, res) {
  try {
    const tournaments = await TournamentModel.getAll();

    // converti le date in oggetti ISO string
    const formatted = tournaments.map(t => ({
      ...t,
      start_date: t.start_date ? new Date(t.start_date).toISOString() : null,
      end_date: t.end_date ? new Date(t.end_date).toISOString() : null,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("❌ ERRORE getAll:", error);
    res.status(500).json({ error: error.message || "Unknown error" });
  }
}

,

  async getById(req, res) {
    try {
      const tournament = await TournamentModel.getById(req.params.id);
      if (!tournament) return res.status(404).json({ error: "Tournament not found" });
      res.json(tournament);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tournament" });
    }
  },

async create(req, res) {
  console.log("BODY:", req.body); // 👈 qui vediamo cosa arriva
  try {
    const tournament = await TournamentModel.create(req.body);
    res.status(201).json(tournament);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid tournament data" });
  }
},

  async update(req, res) {
    try {
      const tournament = await TournamentModel.update(req.params.id, req.body);
      if (!tournament) return res.status(404).json({ error: "Tournament not found" });
      res.json(tournament);
    } catch (error) {
      res.status(500).json({ error: "Failed to update tournament" });
    }
  },

  async delete(req, res) {
    try {
      const success = await TournamentModel.delete(req.params.id);
      if (!success) return res.status(404).json({ error: "Tournament not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete tournament" });
    }
  },
};
