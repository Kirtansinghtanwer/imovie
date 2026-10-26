const mongoose = require("mongoose");

const showSeatSchema = new mongoose.Schema(
  {
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: [true, "Show reference is required"],
      index: true
    },
    seatIdentifier: {
      type: String,
      required: [true, "Seat identifier is required (e.g. A1, B5)"],
      trim: true
    },
    row: {
      type: String,
      required: [true, "Row label is required"],
      trim: true
    },
    seatNumber: {
      type: Number,
      required: [true, "Seat number is required"]
    },
    seatType: {
      type: String,
      enum: ["standard", "premium", "vip"],
      default: "standard"
    },
    price: {
      type: Number,
      required: [true, "Seat price is required"],
      min: [0, "Seat price cannot be negative"]
    },
    status: {
      type: String,
      enum: ["available", "reserved", "booked"],
      default: "available",
      index: true
    },
    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    reservationExpiresAt: {
      type: Date,
      default: null,
      index: true
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret.seatIdentifier || ret._id.toString();
        ret.number = ret.seatNumber;
        ret.type = ret.seatType;
        // For frontend compatibility: 'booked' is mapped to 'occupied' in frontend seat map
        ret.frontendStatus = ret.status === "booked" ? "occupied" : ret.status;
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret.seatIdentifier || ret._id.toString();
        ret.number = ret.seatNumber;
        ret.type = ret.seatType;
        ret.frontendStatus = ret.status === "booked" ? "occupied" : ret.status;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Enforce uniqueness of each seat per show
showSeatSchema.index({ show: 1, seatIdentifier: 1 }, { unique: true });
showSeatSchema.index({ show: 1, status: 1 });

const ShowSeat = mongoose.model("ShowSeat", showSeatSchema);

module.exports = ShowSeat;
