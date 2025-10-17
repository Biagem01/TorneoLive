import { eq, and, desc } from "drizzle-orm";
import { db } from "./db";
import {
  tournaments,
  teams,
  players,
  matches,
  goals,
  type Tournament,
  type InsertTournament,
  type Team,
  type InsertTeam,
  type Player,
  type InsertPlayer,
  type Match,
  type InsertMatch,
  type Goal,
  type InsertGoal,
} from "@shared/schema";
import { IStorage } from "./storage";

export class PgStorage implements IStorage {
  // Tournaments
  async createTournament(tournament: InsertTournament): Promise<Tournament> {
    const [result] = await db.insert(tournaments).values(tournament).returning();
    return result;
  }

  async getTournament(id: string): Promise<Tournament | undefined> {
    const result = await db.select().from(tournaments).where(eq(tournaments.id, id));
    return result[0];
  }

  async getAllTournaments(): Promise<Tournament[]> {
    return await db.select().from(tournaments);
  }

  async updateTournament(id: string, tournament: Partial<InsertTournament>): Promise<Tournament | undefined> {
    const [result] = await db.update(tournaments).set(tournament).where(eq(tournaments.id, id)).returning();
    return result;
  }

  async deleteTournament(id: string): Promise<boolean> {
    const result = await db.delete(tournaments).where(eq(tournaments.id, id));
    return true;
  }

  // Teams
  async createTeam(team: InsertTeam): Promise<Team> {
    const [result] = await db.insert(teams).values(team).returning();
    return result;
  }

  async getTeam(id: string): Promise<Team | undefined> {
    const result = await db.select().from(teams).where(eq(teams.id, id));
    return result[0];
  }

  async getTeamsByTournament(tournamentId: string): Promise<Team[]> {
    return await db.select().from(teams).where(eq(teams.tournamentId, tournamentId));
  }

  async updateTeam(id: string, team: Partial<InsertTeam>): Promise<Team | undefined> {
    const [result] = await db.update(teams).set(team).where(eq(teams.id, id)).returning();
    return result;
  }

  async deleteTeam(id: string): Promise<boolean> {
    await db.delete(teams).where(eq(teams.id, id));
    return true;
  }

  // Players
  async createPlayer(player: InsertPlayer): Promise<Player> {
    const [result] = await db.insert(players).values(player).returning();
    return result;
  }

  async getPlayer(id: string): Promise<Player | undefined> {
    const result = await db.select().from(players).where(eq(players.id, id));
    return result[0];
  }

  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    return await db.select().from(players).where(eq(players.teamId, teamId));
  }

  async updatePlayer(id: string, player: Partial<InsertPlayer>): Promise<Player | undefined> {
    const [result] = await db.update(players).set(player).where(eq(players.id, id)).returning();
    return result;
  }

  async deletePlayer(id: string): Promise<boolean> {
    await db.delete(players).where(eq(players.id, id));
    return true;
  }

  // Matches
  async createMatch(match: InsertMatch): Promise<Match> {
    const [result] = await db.insert(matches).values(match).returning();
    return result;
  }

  async getMatch(id: string): Promise<Match | undefined> {
    const result = await db.select().from(matches).where(eq(matches.id, id));
    return result[0];
  }

  async getMatchesByTournament(tournamentId: string): Promise<Match[]> {
    return await db.select().from(matches).where(eq(matches.tournamentId, tournamentId));
  }

  async updateMatch(id: string, match: Partial<InsertMatch>): Promise<Match | undefined> {
    const [result] = await db.update(matches).set(match).where(eq(matches.id, id)).returning();
    return result;
  }

  async deleteMatch(id: string): Promise<boolean> {
    await db.delete(matches).where(eq(matches.id, id));
    return true;
  }

  // Goals
  async createGoal(goal: InsertGoal): Promise<Goal> {
    const [result] = await db.insert(goals).values(goal).returning();
    return result;
  }

  async getGoalsByMatch(matchId: string): Promise<Goal[]> {
    return await db.select().from(goals).where(eq(goals.matchId, matchId));
  }

  async getGoalsByPlayer(playerId: string): Promise<Goal[]> {
    return await db.select().from(goals).where(eq(goals.playerId, playerId));
  }

  async deleteGoal(id: string): Promise<boolean> {
    await db.delete(goals).where(eq(goals.id, id));
    return true;
  }

  // Statistics
  async getRankings(tournamentId: string): Promise<any[]> {
    const tournamentMatches = await this.getMatchesByTournament(tournamentId);
    const tournamentTeams = await this.getTeamsByTournament(tournamentId);
    
    const standings = new Map<string, any>();
    
    tournamentTeams.forEach(team => {
      standings.set(team.id, {
        teamId: team.id,
        teamName: team.name,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      });
    });

    tournamentMatches.forEach(match => {
      if (match.scoreA === null || match.scoreB === null) return;
      
      const teamA = standings.get(match.teamAId);
      const teamB = standings.get(match.teamBId);
      
      if (!teamA || !teamB) return;

      teamA.played++;
      teamB.played++;
      teamA.goalsFor += match.scoreA;
      teamA.goalsAgainst += match.scoreB;
      teamB.goalsFor += match.scoreB;
      teamB.goalsAgainst += match.scoreA;

      if (match.scoreA > match.scoreB) {
        teamA.won++;
        teamA.points += 3;
        teamB.lost++;
      } else if (match.scoreA < match.scoreB) {
        teamB.won++;
        teamB.points += 3;
        teamA.lost++;
      } else {
        teamA.drawn++;
        teamB.drawn++;
        teamA.points += 1;
        teamB.points += 1;
      }

      teamA.goalDifference = teamA.goalsFor - teamA.goalsAgainst;
      teamB.goalDifference = teamB.goalsFor - teamB.goalsAgainst;
    });

    const rankings = Array.from(standings.values())
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
      })
      .map((team, index) => ({ ...team, position: index + 1 }));

    return rankings;
  }

  async getTopScorers(tournamentId: string): Promise<any[]> {
    const tournamentTeams = await this.getTeamsByTournament(tournamentId);
    const teamIds = new Set(tournamentTeams.map(t => t.id));
    
    const allPlayers = await db.select().from(players);
    const scorerMap = new Map<string, any>();

    for (const player of allPlayers) {
      if (!teamIds.has(player.teamId)) continue;
      
      const playerGoals = await this.getGoalsByPlayer(player.id);
      if (playerGoals.length > 0) {
        const team = tournamentTeams.find(t => t.id === player.teamId);
        scorerMap.set(player.id, {
          playerId: player.id,
          playerName: player.name,
          teamName: team?.name || "Unknown",
          goals: playerGoals.length,
        });
      }
    }

    return Array.from(scorerMap.values())
      .sort((a, b) => b.goals - a.goals);
  }
}

export const storage = new PgStorage();
