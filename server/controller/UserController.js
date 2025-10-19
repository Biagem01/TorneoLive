import { User } from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto"; // 🔑 per generare il token di verifica
import { sendVerificationEmail } from "../utils/emailService.js"; // ✉️ per inviare l’email

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

//
// 🧩 REGISTRAZIONE CON VERIFICA EMAIL
//
export const registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Verifica se l'email esiste già
    const existing = await User.findByEmail(email);
    if (existing) return res.status(400).send("Email già registrata");

    // Crea utente (is_verified = false)
    const user = await User.create({ email, password, role: role || "user" });

    // Genera token di verifica unico
    const verificationToken = crypto.randomBytes(32).toString("hex");
    await User.setVerificationToken(email, verificationToken);

    // Invia l’email di verifica
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message: "Registrazione completata. Controlla la tua email per verificare l'account.",
      user,
    });
  } catch (err) {
    console.error("Errore in registerUser:", err);
    res.status(500).send("Errore del server durante la registrazione");
  }
};

//
// 🔑 LOGIN SOLO SE L'EMAIL È VERIFICATA
//
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (!user) return res.status(401).send("Utente non trovato");
    if (!user.is_verified)
      return res.status(403).send("Devi prima verificare la tua email");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send("Password errata");

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    res.json({ id: user.id, email: user.email, role: user.role });
  } catch (err) {
    console.error("Errore in loginUser:", err);
    res.status(500).send("Errore del server durante il login");
  }
};

//
// 👤 OTTIENI DATI UTENTE LOGGATO
//
export const getUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).send("Non autenticato");

    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).send("Utente non trovato");

    res.json(user);
  } catch (err) {
    res.status(401).send("Token non valido o scaduto");
  }
};

//
// 🚪 LOGOUT
//
export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.send("Logout effettuato");
};

//
// ✅ VERIFICA EMAIL (link da mailtrap)
//
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) return res.status(400).send("Token mancante");

    const success = await User.verifyEmail(token);

    if (!success) {
      return res.status(400).send("Token non valido o già usato");
    }

    res.send("Email verificata con successo! Ora puoi accedere al tuo account.");
  } catch (err) {
    console.error("Errore in verifyEmail:", err);
    res.status(500).send("Errore del server durante la verifica email");
  }
};
