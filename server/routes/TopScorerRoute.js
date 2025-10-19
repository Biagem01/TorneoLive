// routes/topScorers.js
import express from "express";
import { getTopScorersByTournament } from "../controller/TopScorerController.js";

const router = express.Router();

// GET /api/tournaments/:id/top-scorers
router.get("/tournaments/:id/top-scorers", getTopScorersByTournament);

export default router;
