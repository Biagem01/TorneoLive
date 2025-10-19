import { TeamModel } from "../models/TeamModel.js";

export const TeamController = {
  async getTeamsByTournament(req, res) {
    try {
      const { id } = req.params;
      const teams = await TeamModel.getByTournamentId(id);
      res.json(teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ error: "Failed to fetch teams" });
    }
  },

  async getAllTeams(req, res) {
  try {
    const teams = await TeamModel.getAll();
    res.json(teams);
  } catch (error) {
    console.error("Error fetching all teams:", error);
    res.status(500).json({ error: "Failed to fetch all teams" });
  }
},


  async create(req, res) {
    try {
      const team = await TeamModel.create(req.body);
      res.status(201).json(team);
    } catch (error) {
      console.error("Error creating team:", error);
      res.status(400).json({ error: "Invalid team data" });
    }
  },
};
