import express from "express";
import PlayerController from "../controller/PlayerController.js";

const router = express.Router();

// prima era router.get("/:teamId", ...)
router.get("/teams/:teamId/players", PlayerController.getByTeam);
router.post("/players", PlayerController.create);
router.delete("/players/:id", PlayerController.delete);

export default router;
