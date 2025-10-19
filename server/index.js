// server/index.js
import express from "express";
import 'dotenv/config';

import cors from "cors";
import cookieParser from "cookie-parser"; // ✅ necessario per leggere i cookie
import { setupVite, serveStatic, log } from "./vite.js";

import tournamentRoutes from "./routes/TournamentRoute.js";
import teamRoutes from "./routes/TeamRoute.js";
import matchRoutes from "./routes/MatchRoute.js";
import playerRoutes from "./routes/PlayerRoute.js";
import rankingsRoutes from "./routes/RankingRoute.js";
import topScorerRoutes from "./routes/TopScorerRoute.js";
import userRoutes from "./routes/UserRoute.js";

const app = express();

// --- Middleware CORS ---
app.use(cors({
  origin: "http://localhost:5173", // permette solo al frontend su questa origine
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // ✅ necessario per inviare i cookie
}));

// --- Middleware globali ---
app.use(cookieParser()); // ✅ ora Express può leggere i cookie JWT
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- Middleware log richieste / risposte API ---
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
      log(logLine);
    }
  });

  next();
});

// --- Collega le rotte MVC ---
app.use("/api/tournaments", tournamentRoutes);
app.use("/api", teamRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api", playerRoutes);
app.use("/api", rankingsRoutes);
app.use("/api", topScorerRoutes);
app.use("/api", userRoutes);

// --- Error handling globale ---
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  throw err;
});

// --- Avvio del server + integrazione Vite ---
(async () => {
  const port = parseInt(process.env.PORT || "5001", 10);
  const server = app.listen(port, () => {
    log(`Server running on port ${port}`);
  });

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
})();
