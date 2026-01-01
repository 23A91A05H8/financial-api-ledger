import pool from "../db/db.js";

export const getLedgerEntries = async (req, res) => {
  const { accountId } = req.params;

  const result = await pool.query(
    `SELECT * FROM ledger_entries
     WHERE account_id = $1
     ORDER BY created_at ASC`,
    [accountId]
  );

  res.json(result.rows);
};
