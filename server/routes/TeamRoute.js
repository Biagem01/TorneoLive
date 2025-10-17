import express from "express";
import { TeamController } from "../controller/TeamController";

const router = express.Router();

router.get("/tournaments/:id/teams", TeamController.getTeamsByTournament);
router.post("/teams", TeamController.create);
router.get("/teams", TeamController.getAllTeams);


export default router;
