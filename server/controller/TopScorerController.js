import { getTopScorersByTournament as getTopScorersFromDB } from "../models/TopScorerModel.js";

/**
 * Recupera la classifica marcatori di un torneo
 */
export async function getTopScorersByTournament(req, res) {
  // prendi il parametro 'id' dalla route e rinominalo in 'tournamentId'
  const { id: tournamentId } = req.params;

  if (!tournamentId) {
    return res.status(400).json({ error: "tournament id required" });
  }

  try {
    const scorers = await getTopScorersFromDB(tournamentId);

    // ordina per gol discendente e struttura i dati per il frontend
    const sortedScorers = scorers
      .map(s => ({
        playerId: s.player_id,
        playerName: s.player_name,
        teamId: s.team_id,
        teamName: s.team_name,
        goals: Number(s.goals ?? 0),
      }))
      .sort((a, b) => b.goals - a.goals);

    res.json(sortedScorers);
  } catch (err) {
    console.error("getTopScorersByTournament error:", err);
    res.status(500).json({ error: "Failed to fetch top scorers" });
  }
}
