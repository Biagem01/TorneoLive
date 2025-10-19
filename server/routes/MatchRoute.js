import express from "express";
import MatchController from "../controller/MatchController.js";

const router = express.Router();

// POST: crea un nuovo match
router.post("/", MatchController.create);

// GET: recupera tutti i match di un torneo
router.get("/tournament/:tournamentId", MatchController.getByTournament);

// GET: recupera un match singolo per id
router.get("/:id", MatchController.getById);


export default router;
