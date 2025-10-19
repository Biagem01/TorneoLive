// server/models/UserModel.js
import { pool } from "../db.js";
import bcrypt from "bcrypt";

export class User {
  // 👤 CREA NUOVO UTENTE
  static async create({ email, password, role }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (email, password, role, is_verified) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, role, false] // utente non verificato di default
    );
    return { id: result.insertId, email, role };
  }

  // 🔍 TROVA UTENTE PER EMAIL
  static async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0] || null;
  }

  // 🔍 TROVA UTENTE PER ID
  static async findById(id) {
    const [rows] = await pool.query("SELECT id, email, role, is_verified FROM users WHERE id = ?", [id]);
    return rows[0] || null;
  }

  // 💾 SALVA IL TOKEN DI VERIFICA
  static async setVerificationToken(email, token) {
    await pool.query("UPDATE users SET verification_token = ? WHERE email = ?", [token, email]);
  }

  // ✅ VERIFICA EMAIL TRAMITE TOKEN
  static async verifyEmail(token) {
    const [result] = await pool.query(
      "UPDATE users SET is_verified = 1, verification_token = NULL WHERE verification_token = ?",
      [token]
    );
    return result.affectedRows > 0; // true se l'email è stata verificata
  }
}
