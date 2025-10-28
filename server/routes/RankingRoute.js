import express from "express";
import { getRankingsByTournament, getGroupRankings } from "../controller/RankingController.js";

const router = express.Router();

// GET /api/tournaments/:id/rankings
router.get("/tournaments/:id/rankings", getRankingsByTournament);

// GET /api/tournaments/:id/group-rankings → classifiche per gironi
router.get("/tournaments/:id/group-rankings", getGroupRankings);
export default router;
