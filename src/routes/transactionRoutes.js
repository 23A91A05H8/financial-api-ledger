import express from "express";
import { transferMoney } from "../controllers/transactionController.js";
import { depositMoney, withdrawMoney } from "../controllers/transactionController.js";

const router = express.Router();

router.post("/transfer", transferMoney);
router.post("/transfer", transferMoney);
router.post("/deposits", depositMoney);
router.post("/withdrawals", withdrawMoney);

export default router;
