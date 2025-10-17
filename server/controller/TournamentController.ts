import { Request, Response } from "express";
import { storage } from "../pg-storage";
import { insertTournamentSchema } from "@shared/schema";

export class TournamentController {
  static async getAll(req: Request, res: Response) {
    try {
      const tournaments = await storage.getAllTournaments();
      res.json(tournaments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch tournaments" });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tournament = await storage.getTournament(id);
      if (!tournament) {
        return res.status(404).json({ error: "Tournament not found" });
      }
      res.json(tournament);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch tournament" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const data = insertTournamentSchema.parse(req.body);
      const tournament = await storage.createTournament(data);
      res.status(201).json(tournament);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Invalid tournament data" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tournament = await storage.updateTournament(id, req.body);
      if (!tournament) {
        return res.status(404).json({ error: "Tournament not found" });
      }
      res.json(tournament);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update tournament" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await storage.deleteTournament(id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete tournament" });
    }
  }
}
