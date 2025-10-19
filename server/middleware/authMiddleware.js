// server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Non autenticato");

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // aggiunge i dati dell'utente alla richiesta
    next();
  } catch (err) {
    return res.status(401).send("Token non valido o scaduto");
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).send("Non autenticato");
  if (req.user.role !== "admin") return res.status(403).send("Accesso negato: Admin richiesto");
  next();
};
