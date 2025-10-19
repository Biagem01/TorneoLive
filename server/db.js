// server/db.js
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 8889, // 👈 MAMP usa 8889!
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "torneo_live",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export { pool };
