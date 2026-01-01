import express from "express";
import { getLedgerEntries } from "../controllers/ledgerController.js";

const router = express.Router();

router.get("/accounts/:accountId/ledger", getLedgerEntries);

export default router;
