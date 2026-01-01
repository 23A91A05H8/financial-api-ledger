import { v4 as uuidv4 } from "uuid";
import pool from "../db/db.js";

export const transferMoney = async (req, res) => {
  const { sourceAccountId, destinationAccountId, amount, currency } = req.body;

  if (!sourceAccountId || !destinationAccountId || !amount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const transactionId = uuidv4();

    // 1️⃣ Insert transaction
    await client.query(
      `INSERT INTO transactions 
       (id, type, source_account, destination_account, amount, currency, status)
       VALUES ($1, 'transfer', $2, $3, $4, $5, 'completed')`,
      [transactionId, sourceAccountId, destinationAccountId, amount, currency]
    );

    // 2️⃣ Debit entry (source)
    await client.query(
      `INSERT INTO ledger_entries 
       (id, account_id, transaction_id, entry_type, amount)
       VALUES ($1, $2, $3, 'debit', $4)`,
      [uuidv4(), sourceAccountId, transactionId, amount]
    );

    // 3️⃣ Credit entry (destination)
    await client.query(
      `INSERT INTO ledger_entries 
       (id, account_id, transaction_id, entry_type, amount)
       VALUES ($1, $2, $3, 'credit', $4)`,
      [uuidv4(), destinationAccountId, transactionId, amount]
    );

    await client.query("COMMIT");

    res.json({ message: "Transfer successful", transactionId });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};
