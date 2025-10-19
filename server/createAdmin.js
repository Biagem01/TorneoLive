// server/createAdmin.js
import bcrypt from "bcrypt";
import { pool } from "./db.js"; // assicurati che punti al tuo db.js

const email = "admin@torneolive.com";
const password = "admin123";
const role = "admin";

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserisce l'admin nel DB
    const [result] = await pool.query(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [email, hashedPassword, role]
    );

    console.log("Admin creato con successo! ID:", result.insertId);
    process.exit(0);
  } catch (err) {
    console.error("Errore:", err.message);
    process.exit(1);
  }
}

createAdmin();
