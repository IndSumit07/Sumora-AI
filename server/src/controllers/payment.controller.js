import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";
import PRICING_PLANS from "../config/pricing.json" with { type: "json" };

function getLiveRazorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return { ok: false, message: "Live payment keys are not configured." };
  }

  if (!keyId.startsWith("rzp_live_")) {
    return { ok: false, message: "Only Razorpay live keys are allowed." };
  }

  return {
    ok: true,
    keyId,
    keySecret,
  };
}

function getRazorpayClient() {
  const config = getLiveRazorpayConfig();
  if (!config.ok) {
    return config;
  }

  return {
    ok: true,
    keyId: config.keyId,
    keySecret: config.keySecret,
    client: new Razorpay({
      key_id: config.keyId,
      key_secret: config.keySecret,
    }),
  };
}

// Store plans directly in mapping for strict validation
const TOKEN_PLANS = {
  [PRICING_PLANS.starter.id]: {
    tokens: PRICING_PLANS.starter.tokens,
    price: PRICING_PLANS.starter.price,
    name: PRICING_PLANS.starter.name,
  },
  [PRICING_PLANS.pro.id]: {
    tokens: PRICING_PLANS.pro.tokens,
    price: PRICING_PLANS.pro.price,
    name: PRICING_PLANS.pro.name,
  },
};

/**
 * Generates an order for purchasing tokens
 */
export const createOrder = async (req, res) => {
  try {
    const paymentGateway = getRazorpayClient();
    if (!paymentGateway.ok) {
      return res.status(503).json({
        success: false,
        message: paymentGateway.message,
      });
    }

    const { planId } = req.body;
    const userId = req.user.id;

    if (!planId || !TOKEN_PLANS[planId]) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid plan selected" });
    }

    const plan = TOKEN_PLANS[planId];

    // Amount in paise (multiply by 100)
    const amountInPaise = plan.price * 100;

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId,
        planId,
      },
    };

    const order = await paymentGateway.client.orders.create(options);

    if (!order) {
      return res.status(500).json({
        success: false,
        message: "Failed to process payment creation",
      });
    }

    // Save transaction trace as created
    await Transaction.create({
      user: userId,
      razorpay_order_id: order.id,
      amount: plan.price,
      currency: "INR",
      tokensAdded: plan.tokens,
      planId: planId,
      status: "created",
    });

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: paymentGateway.keyId,
      },
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating payment order.",
    });
  }
};

/**
 * Verifies Razorpay payment signature and updates user tokens
 */
export const verifyPayment = async (req, res) => {
  try {
    const paymentGateway = getRazorpayClient();
    if (!paymentGateway.ok) {
      return res.status(503).json({
        success: false,
        message: paymentGateway.message,
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const userId = req.user.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Razorpay details." });
    }

    const transaction = await Transaction.findOne({
      razorpay_order_id,
      user: userId,
    });

    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found." });
    }

    if (transaction.status === "success") {
      return res
        .status(400)
        .json({ success: false, message: "Payment already verified." });
    }

    // Checking signature
    const hmac = crypto.createHmac("sha256", paymentGateway.keySecret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      transaction.status = "failed";
      await transaction.save();
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature." });
    }

    // Update Transaction success
    transaction.status = "success";
    transaction.razorpay_payment_id = razorpay_payment_id;
    transaction.razorpay_signature = razorpay_signature;
    await transaction.save();

    // Increment user tokens
    const user = await User.findById(userId);
    user.tokens = (user.tokens || 0) + transaction.tokensAdded;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Payment verified, tokens added successfully!",
      tokens: user.tokens,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error verifying payment." });
  }
};

/**
 * Request refund if within 1 minute of successful transaction
 */
export const requestRefund = async (req, res) => {
  try {
    const paymentGateway = getRazorpayClient();
    if (!paymentGateway.ok) {
      return res.status(503).json({
        success: false,
        message: paymentGateway.message,
      });
    }

    const { transactionId } = req.body; // Mongoose Transaction ObjectId
    const userId = req.user.id;

    const transaction = await Transaction.findOne({
      _id: transactionId,
      user: userId,
      status: "success",
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Valid successful transaction not found.",
      });
    }

    // Check if within 1 minute
    const transactionTime = new Date(transaction.updatedAt).getTime();
    const currentTime = Date.now();
    const oneMinuteInMs = 1 * 60 * 1000;

    if (currentTime - transactionTime > oneMinuteInMs) {
      return res.status(400).json({
        success: false,
        message: "Refunds are only allowed within 1 minute of purchase.",
      });
    }

    // Check if user still has the tokens (to prevent free-riding)
    // They shouldn't have spent the tokens yet
    const user = await User.findById(userId);
    if ((user.tokens || 0) < transaction.tokensAdded) {
      return res.status(400).json({
        success: false,
        message: "Insufficient tokens for refund. Tokens already consumed.",
      });
    }

    // Initiate Razorpay Refund
    try {
      const refund = await paymentGateway.client.payments.refund(
        transaction.razorpay_payment_id,
        {
          amount: transaction.amount * 100,
          speed: "normal",
          notes: {
            reason: "User requested refund inside 1 minute window",
          },
        },
      );

      if (!refund) {
        return res.status(500).json({
          success: false,
          message: "Failed to initiate refund with payment gateway.",
        });
      }

      // Update Transaction
      transaction.status = "refunded";
      transaction.refund_id = refund.id;
      await transaction.save();

      // Deduct tokens
      user.tokens -= transaction.tokensAdded;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Refund processed successfully. Tokens have been removed.",
        tokens: user.tokens,
      });
    } catch (razorpayError) {
      console.error("Razorpay Refund Error:", razorpayError);
      return res.status(500).json({
        success: false,
        message:
          razorpayError?.error?.description ||
          "Gateway error while processing refund.",
      });
    }
  } catch (error) {
    console.error("Refund Error:", error);
    res.status(500).json({
      success: false,
      message: error?.error?.description || "Server error processing refund.",
    });
  }
};

/**
 * Get User's Current Token Balance & History
 */
export const getUserTokens = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("tokens");
    const transactions = await Transaction.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      tokens: user.tokens,
      transactions: transactions,
    });
  } catch (error) {
    console.error("Get Tokens Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch tokens data." });
  }
};
