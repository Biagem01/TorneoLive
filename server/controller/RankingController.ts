import { Request, Response } from "express";
import { storage } from "../pg-storage";

export async function getRankingsByTournament(req: Request, res: Response) {
  try {
    const { tournamentId } = req.params;
    const rankings = await storage.getRankings(tournamentId);
    res.json(rankings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch rankings" });
  }
}
