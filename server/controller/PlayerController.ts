import { Request, Response } from "express";
import { storage } from "../pg-storage";
import { insertPlayerSchema } from "@shared/schema";

export class PlayerController {
  static async getByTeam(req: Request, res: Response) {
    try {
      const { teamId } = req.params;
      const players = await storage.getPlayersByTeam(teamId);
      res.json(players);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch players" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const data = insertPlayerSchema.parse(req.body);
      const player = await storage.createPlayer(data);
      res.status(201).json(player);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Invalid player data" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await storage.deletePlayer(id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete player" });
    }
  }
}

export default PlayerController;
