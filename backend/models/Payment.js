const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking reference is required"],
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true
    },
    provider: {
      type: String,
      enum: ["dev", "simulated", "stripe", "razorpay"],
      default: "dev"
    },
    providerOrderId: {
      type: String,
      required: [true, "Provider order reference is required"],
      unique: true,
      index: true
    },
    providerPaymentId: {
      type: String,
      default: null
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: [0, "Amount cannot be negative"]
    },
    currency: {
      type: String,
      default: "USD",
      uppercase: true
    },
    status: {
      type: String,
      enum: ["created", "pending", "succeeded", "failed", "refunded"],
      default: "created",
      index: true
    },
    verifiedAt: {
      type: Date,
      default: null
    },
    metadata: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      }
    }
  }
);

paymentSchema.index({ booking: 1, status: 1 });

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
