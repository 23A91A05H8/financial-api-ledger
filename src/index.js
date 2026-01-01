import dotenv from "dotenv";
dotenv.config(); // ✅ FIRST

import express from "express";
import pool from "./db/db.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import ledgerRoutes from "./routes/ledgerRoutes.js";

const app = express();
app.use(express.json());
app.use("/api", transactionRoutes);
app.use("/api", accountRoutes);
app.use("/api", ledgerRoutes);

app.get("/", (req, res) => {
  res.send("Financial Ledger API Running");
});

app.get("/test-db", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
