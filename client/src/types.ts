// src/types.ts
export interface Player {
  id: number;
  name: string;
  team_id: number;
}

export interface GoalScorer {
  playerName: string;
  minute: number;
}

// src/types.ts
export interface MatchWithScorers {
  id: string;
  teamAName: string;
  teamBName: string;
  
  teamAId: string; // ← aggiungi
  teamBId: string; // ← aggiungi
  scoreA: number;
  scoreB: number;
  status: string;
  matchDate: Date;
  scorersA: GoalScorer[];
  scorersB: GoalScorer[];
}

