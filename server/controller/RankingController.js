import { getMatchesByTournament } from "../models/RankingModel.js";

/**
 * Calcola la classifica per tournament dinamicamente da matches
 * Restituisce un array ordinato con campi richiesti dal frontend.
 */
export async function getRankingsByTournament(req, res) {
  const { id: tournamentId } = req.params;

  if (!tournamentId) {
    return res.status(400).json({ error: "tournament id required" });
  }

  try {
    const matches = await getMatchesByTournament(tournamentId);

    // accumulator keyed by teamId
    const stats = {};

    for (const m of matches) {
      const t1 = String(m.team1_id);
      const t2 = String(m.team2_id);
      const name1 = m.team1_name;
      const name2 = m.team2_name;

      if (!stats[t1]) {
        stats[t1] = {
          teamId: t1,
          teamName: name1,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0,
        };
      }
      if (!stats[t2]) {
        stats[t2] = {
          teamId: t2,
          teamName: name2,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0,
        };
      }

      const score1 = Number(m.score_team1 ?? 0);
      const score2 = Number(m.score_team2 ?? 0);

      // aggiorna partite e gol
      stats[t1].played += 1;
      stats[t2].played += 1;
      stats[t1].goalsFor += score1;
      stats[t1].goalsAgainst += score2;
      stats[t2].goalsFor += score2;
      stats[t2].goalsAgainst += score1;

      // assegna risultati e punti
      if (score1 > score2) {
        stats[t1].won += 1;
        stats[t2].lost += 1;
        stats[t1].points += 3;
      } else if (score1 < score2) {
        stats[t2].won += 1;
        stats[t1].lost += 1;
        stats[t2].points += 3;
      } else {
        stats[t1].drawn += 1;
        stats[t2].drawn += 1;
        stats[t1].points += 1;
        stats[t2].points += 1;
      }
    }

    // converti in array e calcola GD
    const rankings = Object.values(stats)
      .map((t) => ({
        ...t,
        goalDifference: t.goalsFor - t.goalsAgainst,
      }))
      .sort((a, b) => {
        // ordinamento: points desc, GD desc, goalsFor desc
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
      })
      .map((t, idx) => ({ position: idx + 1, ...t }));

    // Risposta compatibile col frontend: array semplice
    res.json(rankings);
  } catch (err) {
    console.error("getRankingsByTournament error:", err);
    res.status(500).json({ error: "Failed to compute rankings" });
  }
}
