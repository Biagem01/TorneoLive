import { Request, Response } from "express";
import { storage } from "../pg-storage";

export async function getTopScorersByTournament(req: Request, res: Response) {
  try {
    const { tournamentId } = req.params;
    const topScorers = await storage.getTopScorers(tournamentId);
    res.json(topScorers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch top scorers" });
  }
}
