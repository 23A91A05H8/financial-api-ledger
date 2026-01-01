import { v4 as uuidv4 } from "uuid";
import pool from "../db/db.js";

export const createAccount = async (req, res) => {
  const { userId, type, currency } = req.body;

  if (!userId || !type || !currency) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const accountId = uuidv4();

  await pool.query(
    `INSERT INTO accounts (id, user_id, type, currency)
     VALUES ($1, $2, $3, $4)`,
    [accountId, userId, type, currency]
  );

  res.json({ accountId });
};

export const getAccountBalance = async (req, res) => {
  const { accountId } = req.params;

  const result = await pool.query(
    `SELECT 
       COALESCE(
         SUM(
           CASE 
             WHEN entry_type = 'credit' THEN amount
             WHEN entry_type = 'debit' THEN -amount
           END
         ), 0
       ) AS balance
     FROM ledger_entries
     WHERE account_id = $1`,
    [accountId]
  );

  res.json({
    accountId,
    balance: result.rows[0].balance
  });
};

