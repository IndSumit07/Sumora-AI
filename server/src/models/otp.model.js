import mongoose from "mongoose";
import crypto from "crypto";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    otp: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["registration", "forgot-password", "change-password", "change-email"],
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
      max: 5,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000),
      index: { expires: 0 },
    },
  },
  { timestamps: true },
);

// Index for fast lookups
otpSchema.index({ email: 1, type: 1 });

// Hash OTP before saving
otpSchema.pre("save", function () {
  if (this.isModified("otp")) {
    this.otp = crypto.createHash("sha256").update(this.otp).digest("hex");
  }
});

// Static method to verify OTP with attempt tracking
otpSchema.statics.verifyOtp = async function (email, plainOtp, type) {
  const hashed = crypto.createHash("sha256").update(plainOtp).digest("hex");
  const record = await this.findOne({ email, type });

  if (!record) return null;

  // Too many attempts
  if (record.attempts >= 5) {
    await this.deleteOne({ _id: record._id });
    return null;
  }

  if (record.otp !== hashed) {
    record.attempts += 1;
    await record.save();
    return null;
  }

  // Valid — delete and return record
  await this.deleteOne({ _id: record._id });
  return record;
};

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;
