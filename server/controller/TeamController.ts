import { Request, Response } from "express";
import { storage } from "../pg-storage";
import { insertTeamSchema } from "@shared/schema";

export class TeamController {
  static async getTeamsByTournament(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const teams = await storage.getTeamsByTournament(id);
      res.json(teams);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch teams" });
    }
  }

  static async getAllTeams(req: Request, res: Response) {
    try {
      const tournaments = await storage.getAllTournaments();
      const allTeams = [];
      for (const tournament of tournaments) {
        const teams = await storage.getTeamsByTournament(tournament.id);
        allTeams.push(...teams);
      }
      res.json(allTeams);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch teams" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const data = insertTeamSchema.parse(req.body);
      const team = await storage.createTeam(data);
      res.status(201).json(team);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Invalid team data" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await storage.deleteTeam(id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete team" });
    }
  }
}
