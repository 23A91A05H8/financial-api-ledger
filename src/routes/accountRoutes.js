import express from "express";
import { createAccount } from "../controllers/accountController.js";
import { getAccountBalance } from "../controllers/accountController.js";

const router = express.Router();

router.post("/accounts", createAccount);
router.get("/accounts/:accountId", getAccountBalance);

export default router;
