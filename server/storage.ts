import {
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
import { randomUUID } from "crypto";

export interface IStorage {
  // Tournaments
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  getTournament(id: string): Promise<Tournament | undefined>;
  getAllTournaments(): Promise<Tournament[]>;
  updateTournament(id: string, tournament: Partial<InsertTournament>): Promise<Tournament | undefined>;
  deleteTournament(id: string): Promise<boolean>;

  // Teams
  createTeam(team: InsertTeam): Promise<Team>;
  getTeam(id: string): Promise<Team | undefined>;
  getTeamsByTournament(tournamentId: string): Promise<Team[]>;
  updateTeam(id: string, team: Partial<InsertTeam>): Promise<Team | undefined>;
  deleteTeam(id: string): Promise<boolean>;

  // Players
  createPlayer(player: InsertPlayer): Promise<Player>;
  getPlayer(id: string): Promise<Player | undefined>;
  getPlayersByTeam(teamId: string): Promise<Player[]>;
  updatePlayer(id: string, player: Partial<InsertPlayer>): Promise<Player | undefined>;
  deletePlayer(id: string): Promise<boolean>;

  // Matches
  createMatch(match: InsertMatch): Promise<Match>;
  getMatch(id: string): Promise<Match | undefined>;
  getMatchesByTournament(tournamentId: string): Promise<Match[]>;
  updateMatch(id: string, match: Partial<InsertMatch>): Promise<Match | undefined>;
  deleteMatch(id: string): Promise<boolean>;

  // Goals
  createGoal(goal: InsertGoal): Promise<Goal>;
  getGoalsByMatch(matchId: string): Promise<Goal[]>;
  getGoalsByPlayer(playerId: string): Promise<Goal[]>;
  deleteGoal(id: string): Promise<boolean>;

  // Statistics
  getRankings(tournamentId: string): Promise<any[]>;
  getTopScorers(tournamentId: string): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private tournaments: Map<string, Tournament>;
  private teams: Map<string, Team>;
  private players: Map<string, Player>;
  private matches: Map<string, Match>;
  private goals: Map<string, Goal>;

  constructor() {
    this.tournaments = new Map();
    this.teams = new Map();
    this.players = new Map();
    this.matches = new Map();
    this.goals = new Map();
  }

  // Tournaments
  async createTournament(tournament: InsertTournament): Promise<Tournament> {
    const id = randomUUID();
    const newTournament: Tournament = { ...tournament, id };
    this.tournaments.set(id, newTournament);
    return newTournament;
  }

  async getTournament(id: string): Promise<Tournament | undefined> {
    return this.tournaments.get(id);
  }

  async getAllTournaments(): Promise<Tournament[]> {
    return Array.from(this.tournaments.values());
  }

  async updateTournament(id: string, tournament: Partial<InsertTournament>): Promise<Tournament | undefined> {
    const existing = this.tournaments.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...tournament };
    this.tournaments.set(id, updated);
    return updated;
  }

  async deleteTournament(id: string): Promise<boolean> {
    return this.tournaments.delete(id);
  }

  // Teams
  async createTeam(team: InsertTeam): Promise<Team> {
    const id = randomUUID();
    const newTeam: Team = { ...team, id };
    this.teams.set(id, newTeam);
    return newTeam;
  }

  async getTeam(id: string): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async getTeamsByTournament(tournamentId: string): Promise<Team[]> {
    return Array.from(this.teams.values()).filter(
      (team) => team.tournamentId === tournamentId
    );
  }

  async updateTeam(id: string, team: Partial<InsertTeam>): Promise<Team | undefined> {
    const existing = this.teams.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...team };
    this.teams.set(id, updated);
    return updated;
  }

  async deleteTeam(id: string): Promise<boolean> {
    return this.teams.delete(id);
  }

  // Players
  async createPlayer(player: InsertPlayer): Promise<Player> {
    const id = randomUUID();
    const newPlayer: Player = { ...player, id };
    this.players.set(id, newPlayer);
    return newPlayer;
  }

  async getPlayer(id: string): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    return Array.from(this.players.values()).filter(
      (player) => player.teamId === teamId
    );
  }

  async updatePlayer(id: string, player: Partial<InsertPlayer>): Promise<Player | undefined> {
    const existing = this.players.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...player };
    this.players.set(id, updated);
    return updated;
  }

  async deletePlayer(id: string): Promise<boolean> {
    return this.players.delete(id);
  }

  // Matches
  async createMatch(match: InsertMatch): Promise<Match> {
    const id = randomUUID();
    const newMatch: Match = { ...match, id };
    this.matches.set(id, newMatch);
    return newMatch;
  }

  async getMatch(id: string): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async getMatchesByTournament(tournamentId: string): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(
      (match) => match.tournamentId === tournamentId
    );
  }

  async updateMatch(id: string, match: Partial<InsertMatch>): Promise<Match | undefined> {
    const existing = this.matches.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...match };
    this.matches.set(id, updated);
    return updated;
  }

  async deleteMatch(id: string): Promise<boolean> {
    return this.matches.delete(id);
  }

  // Goals
  async createGoal(goal: InsertGoal): Promise<Goal> {
    const id = randomUUID();
    const newGoal: Goal = { ...goal, id };
    this.goals.set(id, newGoal);
    return newGoal;
  }

  async getGoalsByMatch(matchId: string): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(
      (goal) => goal.matchId === matchId
    );
  }

  async getGoalsByPlayer(playerId: string): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(
      (goal) => goal.playerId === playerId
    );
  }

  async deleteGoal(id: string): Promise<boolean> {
    return this.goals.delete(id);
  }

  // Statistics
  async getRankings(tournamentId: string): Promise<any[]> {
    const matches = await this.getMatchesByTournament(tournamentId);
    const teams = await this.getTeamsByTournament(tournamentId);
    
    const standings = new Map<string, any>();
    
    teams.forEach(team => {
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

    matches.forEach(match => {
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
    const teams = await this.getTeamsByTournament(tournamentId);
    const teamIds = new Set(teams.map(t => t.id));
    
    const scorerMap = new Map<string, any>();

    for (const player of this.players.values()) {
      if (!teamIds.has(player.teamId)) continue;
      
      const goals = await this.getGoalsByPlayer(player.id);
      if (goals.length > 0) {
        const team = this.teams.get(player.teamId);
        scorerMap.set(player.id, {
          playerId: player.id,
          playerName: player.name,
          teamName: team?.name || "Unknown",
          goals: goals.length,
        });
      }
    }

    return Array.from(scorerMap.values())
      .sort((a, b) => b.goals - a.goals);
  }
}

export const storage = new MemStorage();
