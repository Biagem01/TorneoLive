import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tournaments = pgTable("tournaments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull().default("upcoming"),
});

export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tournamentId: varchar("tournament_id").notNull().references(() => tournaments.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
});

export const players = pgTable("players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teamId: varchar("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  jerseyNumber: integer("jersey_number"),
});

export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tournamentId: varchar("tournament_id").notNull().references(() => tournaments.id, { onDelete: "cascade" }),
  teamAId: varchar("team_a_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  teamBId: varchar("team_b_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  scoreA: integer("score_a"),
  scoreB: integer("score_b"),
  status: text("status").notNull().default("scheduled"),
  matchDate: timestamp("match_date").notNull(),
});

export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  matchId: varchar("match_id").notNull().references(() => matches.id, { onDelete: "cascade" }),
  playerId: varchar("player_id").notNull().references(() => players.id, { onDelete: "cascade" }),
  minute: integer("minute").notNull(),
});

export const insertTournamentSchema = createInsertSchema(tournaments).omit({
  id: true,
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
});

export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type Tournament = typeof tournaments.$inferSelect;

export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;

export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;
