import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    razorpay_order_id: {
      type: String,
      required: true,
    },
    razorpay_payment_id: {
      type: String,
    },
    razorpay_signature: {
      type: String,
    },
    amount: {
      type: Number,
      required: true, // Amount in INR (not paise, we'll convert it in Razorpay logic to paise, but here we can save the actual INR amount)
    },
    currency: {
      type: String,
      default: "INR",
    },
    tokensAdded: {
      type: Number,
      required: true,
    },
    planId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["created", "success", "failed", "refunded"],
      default: "created",
    },
    refund_id: {
      type: String, // In case of refund
    },
  },
  { timestamps: true },
);

// Index to easily find user's transaction for refunds (sort by newest)
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ razorpay_order_id: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
