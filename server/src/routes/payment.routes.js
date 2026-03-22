import express from "express";
import {
  createOrder,
  verifyPayment,
  requestRefund,
  getUserTokens,
} from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All payment routes should be protected
router.use(authMiddleware);

router.get("/tokens", getUserTokens); // Fetch token balance & history
router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);
router.post("/refund", requestRefund);

export default router;
