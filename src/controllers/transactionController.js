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

export const depositMoney = async (req, res) => {
  const { accountId, amount, currency } = req.body;

  if (!accountId || !amount) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const transactionId = uuidv4();

    await client.query(
      `INSERT INTO transactions
       (id, type, destination_account, amount, currency, status)
       VALUES ($1, 'deposit', $2, $3, $4, 'completed')`,
      [transactionId, accountId, amount, currency]
    );

    await client.query(
      `INSERT INTO ledger_entries
       (id, account_id, transaction_id, entry_type, amount)
       VALUES ($1, $2, $3, 'credit', $4)`,
      [uuidv4(), accountId, transactionId, amount]
    );

    await client.query("COMMIT");
    res.json({ message: "Deposit successful", transactionId });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};


export const withdrawMoney = async (req, res) => {
  const { accountId, amount, currency } = req.body;

  if (!accountId || !amount) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check balance
    const balanceResult = await client.query(
      `SELECT COALESCE(
        SUM(CASE
          WHEN entry_type = 'credit' THEN amount
          WHEN entry_type = 'debit' THEN -amount
        END), 0) AS balance
       FROM ledger_entries WHERE account_id = $1`,
      [accountId]
    );

    const balance = parseFloat(balanceResult.rows[0].balance);

    if (balance < amount) {
      throw new Error("Insufficient funds");
    }

    const transactionId = uuidv4();

    await client.query(
      `INSERT INTO transactions
       (id, type, source_account, amount, currency, status)
       VALUES ($1, 'withdrawal', $2, $3, $4, 'completed')`,
      [transactionId, accountId, amount, currency]
    );

    await client.query(
      `INSERT INTO ledger_entries
       (id, account_id, transaction_id, entry_type, amount)
       VALUES ($1, $2, $3, 'debit', $4)`,
      [uuidv4(), accountId, transactionId, amount]
    );

    await client.query("COMMIT");
    res.json({ message: "Withdrawal successful", transactionId });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(422).json({ error: err.message });
  } finally {
    client.release();
  }
};


