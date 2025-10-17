import { Request, Response } from "express";
import { storage } from "../pg-storage";
import { insertMatchSchema, insertGoalSchema } from "@shared/schema";

export class MatchController {
  static async create(req: Request, res: Response) {
    try {
      const { tournamentId, teamAId, teamBId, matchDate, scoreA, scoreB, goalsA = [], goalsB = [] } = req.body;
      
      const matchData = insertMatchSchema.parse({
        tournamentId,
        teamAId,
        teamBId,
        matchDate: new Date(matchDate),
        scoreA: scoreA ?? null,
        scoreB: scoreB ?? null,
        status: (scoreA !== null && scoreB !== null) ? "completed" : "scheduled"
      });
      
      const match = await storage.createMatch(matchData);
      
      for (const goal of goalsA) {
        if (goal.playerId && goal.minute) {
          await storage.createGoal({
            matchId: match.id,
            playerId: goal.playerId,
            minute: parseInt(goal.minute)
          });
        }
      }
      
      for (const goal of goalsB) {
        if (goal.playerId && goal.minute) {
          await storage.createGoal({
            matchId: match.id,
            playerId: goal.playerId,
            minute: parseInt(goal.minute)
          });
        }
      }
      
      res.status(201).json(match);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Failed to create match" });
    }
  }

  static async getByTournament(req: Request, res: Response) {
    try {
      const { tournamentId } = req.params;
      const matches = await storage.getMatchesByTournament(tournamentId);
      res.json(matches);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const match = await storage.getMatch(id);
      
      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }
      
      const teamA = await storage.getTeam(match.teamAId);
      const teamB = await storage.getTeam(match.teamBId);
      const matchGoals = await storage.getGoalsByMatch(id);
      
      const goalScorersA = [];
      const goalScorersB = [];
      
      for (const goal of matchGoals) {
        const player = await storage.getPlayer(goal.playerId);
        const goalData = {
          playerName: player?.name || "Unknown",
          minute: goal.minute
        };
        
        if (player?.teamId === match.teamAId) {
          goalScorersA.push(goalData);
        } else {
          goalScorersB.push(goalData);
        }
      }
      
      res.json({
        ...match,
        teamAName: teamA?.name || "Unknown",
        teamBName: teamB?.name || "Unknown",
        goalScorersA,
        goalScorersB
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch match" });
    }
  }
}

export default MatchController;
