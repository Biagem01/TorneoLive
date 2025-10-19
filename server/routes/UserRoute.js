import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
  logoutUser,
  verifyEmail, // 👈 nuova funzione per la verifica
} from "../controller/UserController.js"; // corretto percorso
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧩 Rotte pubbliche
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// ✅ Rotta pubblica per la verifica dell'email
router.get("/verify", verifyEmail);

// 🔒 Rotta privata: ottenere i dati dell'utente loggato
router.get("/user", isAuthenticated, getUser);

export default router;
