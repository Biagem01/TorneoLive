import Player from "../models/PlayerModel.js";

class PlayerController {
  static async create(req, res) {
    try {
      const { teamId, name, jerseyNumber } = req.body;

      if (!teamId || !name) {
        return res.status(400).json({ error: "teamId and name are required" });
      }

      const player = await Player.create({
        teamId,
        name,
        jerseyNumber: jerseyNumber || null
      });

      res.status(201).json(player);
    } catch (error) {
      console.error("Error creating player:", error);
      res.status(500).json({ error: "Failed to create player" });
    }
  }

  static async getByTeam(req, res) {
    try {
      const { teamId } = req.params;
      const players = await Player.findByTeam(teamId);
      res.json(players);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch players" });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await Player.delete(id);
      res.json({ message: "Player deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete player" });
    }
  }
}

export default PlayerController;
