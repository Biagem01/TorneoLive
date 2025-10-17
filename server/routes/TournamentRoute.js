// server/routes/TournamentRoute.js
import express from "express";
import { TournamentController } from "../controller/TournamentController.js";

const router = express.Router();

router.get("/", TournamentController.getAll);
router.get("/:id", TournamentController.getById);
router.post("/", TournamentController.create);
router.patch("/:id", TournamentController.update);
router.delete("/:id", TournamentController.delete);

export default router;
