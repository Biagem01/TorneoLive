import express from "express";
import { getRankingsByTournament } from "../controller/RankingController.js";

const router = express.Router();

// GET /api/tournaments/:id/rankings
router.get("/tournaments/:id/rankings", getRankingsByTournament);

export default router;
