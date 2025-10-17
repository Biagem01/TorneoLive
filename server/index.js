// server/index.js
import express from "express";
import cors from "cors";
import { setupVite, serveStatic, log } from "./vite.js";
import { setupAuth, hashPassword } from "./auth";
import { storage } from "./pg-storage";
import tournamentRoutes from "./routes/TournamentRoute.js";
import teamRoutes from "./routes/TeamRoute.js";
import matchRoutes from "./routes/MatchRoute.js";
import playerRoutes from "./routes/PlayerRoute.js";
import rankingsRoutes from "./routes/RankingRoute.js";
import topScorerRoutes from "./routes/TopScorerRoute.js";

const app = express();

// --- Middleware CORS ---
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup authentication
setupAuth(app);

// Middleware log richieste / risposte API
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

// Collega le rotte MVC
app.use("/api/tournaments", tournamentRoutes);
app.use("/api", teamRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api", playerRoutes);

app.use("/api", rankingsRoutes);
app.use("/api", topScorerRoutes);


// Error handling globale
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  throw err;
});

// Seed admin user if not exists
async function seedAdmin() {
  try {
    const adminEmail = "admin@torneolive.com";
    const existingAdmin = await storage.getUserByEmail(adminEmail);
    
    if (!existingAdmin) {
      await storage.createUser({
        email: adminEmail,
        password: await hashPassword("admin123"),
        role: "admin",
      });
      log("Admin user created: admin@torneolive.com / admin123");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
}

// Avvia server e Vite
(async () => {
  const port = parseInt(process.env.PORT || "5000", 10);
  const server = app.listen(port, "0.0.0.0", () => {
    log(`Server running on 0.0.0.0:${port}`);
  });

  // Seed admin user
  await seedAdmin();

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
})();
