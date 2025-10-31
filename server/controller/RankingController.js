// RankingController.js
import { getMatchesByTournament, getTournamentStructure } from "../models/RankingModel.js";

export async function getGroupRankings(req, res) {
  const { id: tournamentId } = req.params;
  if (!tournamentId) return res.status(400).json({ error: "tournament id required" });

  try {
    const matches = await getMatchesByTournament(tournamentId);
    const structure = await getTournamentStructure(tournamentId);

    if (!structure?.groups || structure.groups.length === 0) {
      return res.status(400).json({ error: "No groups defined for this tournament" });
    }

    // inizializza i gruppi con le squadre
    const groups = structure.groups.map(group => {
      const teamsObj = {};
      group.teams.forEach(team => {
        teamsObj[String(team.id)] = {
          teamId: String(team.id),
          teamName: team.name,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0,
        };
      });
      return { name: group.name, teamsObj };
    });

    // aggiorna le statistiche match per match
    for (const m of matches) {
      const team1Id = String(m.team1_id).trim();
      const team2Id = String(m.team2_id).trim();
      const score1 = Number(m.score_team1 ?? 0);
      const score2 = Number(m.score_team2 ?? 0);

      groups.forEach(g => {
        const t1 = g.teamsObj[team1Id];
        const t2 = g.teamsObj[team2Id];

        // aggiorna statistiche solo se la squadra è nel gruppo
        if (t1) {
          t1.played += 1;
          t1.goalsFor += score1;
          t1.goalsAgainst += score2;

          if (score1 > score2) t1.won += 1;
          else if (score1 < score2) t1.lost += 1;
          else t1.drawn += 1;

          // punti sempre
          if (score1 > score2) t1.points += 3;
          else if (score1 === score2) t1.points += 1;
        }

        if (t2) {
          t2.played += 1;
          t2.goalsFor += score2;
          t2.goalsAgainst += score1;

          if (score2 > score1) t2.won += 1;
          else if (score2 < score1) t2.lost += 1;
          else t2.drawn += 1;

          if (score2 > score1) t2.points += 3;
          else if (score1 === score2) t2.points += 1;
        }
      });
    }

    // converti in array ordinato per ogni gruppo
    const result = groups.map(g => {
      const rankings = Object.values(g.teamsObj)
        .map(t => ({ ...t, goalDifference: t.goalsFor - t.goalsAgainst }))
        .sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
          return b.goalsFor - a.goalsFor;
        })
        .map((t, idx) => ({ position: idx + 1, ...t }));
      return { name: g.name, rankings };
    });

    res.json(result);
  } catch (err) {
    console.error("getGroupRankings error:", err);
    res.status(500).json({ error: "Failed to compute group rankings" });
  }
}

export async function getRankingsByTournament(req, res) {
  const { id: tournamentId } = req.params;
  if (!tournamentId) return res.status(400).json({ error: "tournament id required" });

  try {
    const matches = await getMatchesByTournament(tournamentId);
    const teamsObj = {};

    matches.forEach(m => {
      const t1Id = String(m.team1_id);
      const t2Id = String(m.team2_id);
      const score1 = Number(m.score_team1 ?? 0);
      const score2 = Number(m.score_team2 ?? 0);

      if (!teamsObj[t1Id]) teamsObj[t1Id] = { teamId: t1Id, teamName: m.team1_name, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 };
      if (!teamsObj[t2Id]) teamsObj[t2Id] = { teamId: t2Id, teamName: m.team2_name, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 };

      const t1 = teamsObj[t1Id];
      const t2 = teamsObj[t2Id];

      t1.played += 1;
      t2.played += 1;
      t1.goalsFor += score1;
      t1.goalsAgainst += score2;
      t2.goalsFor += score2;
      t2.goalsAgainst += score1;

      if (score1 > score2) {
        t1.won += 1; t2.lost += 1; t1.points += 3;
      } else if (score1 < score2) {
        t2.won += 1; t1.lost += 1; t2.points += 3;
      } else {
        t1.drawn += 1; t2.drawn += 1; t1.points += 1; t2.points += 1;
      }
    });

    const result = Object.values(teamsObj)
      .map(t => ({ ...t, goalDifference: t.goalsFor - t.goalsAgainst }))
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
      })
      .map((t, idx) => ({ position: idx + 1, ...t }));

    res.json(result);
  } catch (err) {
    console.error("getRankingsByTournament error:", err);
    res.status(500).json({ error: "Failed to compute tournament rankings" });
  }
}
