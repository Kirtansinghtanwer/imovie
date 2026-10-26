const mongoose = require("mongoose");

function generateBookingReference() {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `IMV-${randomNum}`;
}

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      unique: true,
      default: generateBookingReference,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: [true, "Show reference is required"],
      index: true
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: [true, "Movie reference is required"]
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      required: [true, "Theatre reference is required"]
    },
    screen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen",
      required: [true, "Screen reference is required"]
    },
    seats: [
      {
        seatIdentifier: { type: String, required: true },
        row: { type: String, required: true },
        number: { type: Number, required: true },
        seatType: { type: String, default: "standard" },
        price: { type: Number, required: true }
      }
    ],
    selectedSeats: {
      type: [String],
      default: []
    },
    ticketSubtotal: {
      type: Number,
      required: true,
      min: 0
    },
    fees: {
      type: Number,
      default: 0,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "expired"],
      default: "pending",
      index: true
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "failed", "refunded"],
      default: "unpaid",
      index: true
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null
    },
    qrCodeData: {
      type: String,
      default: ""
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true
    },
    cancellationDetails: {
      reason: { type: String, default: "" },
      cancelledAt: { type: Date, default: null },
      refundAmount: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret.bookingReference || ret._id.toString();
        ret.status = ret.bookingStatus;
        if (ret.user && ret.user._id) {
          ret.userId = ret.user._id.toString();
        } else if (ret.user) {
          ret.userId = ret.user.toString();
        }
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret.bookingReference || ret._id.toString();
        ret.status = ret.bookingStatus;
        if (ret.user && ret.user._id) {
          ret.userId = ret.user._id.toString();
        } else if (ret.user) {
          ret.userId = ret.user.toString();
        }
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ show: 1, bookingStatus: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
