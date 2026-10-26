const mongoose = require("mongoose");

function createDefaultSeatLayout() {
  const rows = [
    { row: "A", type: "standard", priceMultiplier: 1.0, seatCount: 12 },
    { row: "B", type: "standard", priceMultiplier: 1.0, seatCount: 12 },
    { row: "C", type: "standard", priceMultiplier: 1.0, seatCount: 12 },
    { row: "D", type: "standard", priceMultiplier: 1.0, seatCount: 12 },
    { row: "E", type: "standard", priceMultiplier: 1.0, seatCount: 12 },
    { row: "F", type: "premium", priceMultiplier: 1.35, seatCount: 12 },
    { row: "G", type: "premium", priceMultiplier: 1.35, seatCount: 12 },
    { row: "H", type: "vip", priceMultiplier: 1.6, seatCount: 12 },
    { row: "J", type: "vip", priceMultiplier: 1.6, seatCount: 12 }
  ];

  return rows.map((r) => {
    const seats = [];
    for (let i = 1; i <= r.seatCount; i++) {
      seats.push({
        number: i,
        seatCode: `${r.row}${i}`,
        type: r.type
      });
    }
    return {
      row: r.row,
      type: r.type,
      priceMultiplier: r.priceMultiplier,
      seats
    };
  });
}

const screenSchema = new mongoose.Schema(
  {
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      required: [true, "Theatre reference is required"],
      index: true
    },
    name: {
      type: String,
      required: [true, "Screen name is required"],
      trim: true
    },
    screenType: {
      type: String,
      enum: ["IMAX", "Dolby Cinema", "Dolby Atmos", "Standard", "4DX", "3D", "IMAX 70mm", "2D 4K"],
      default: "Standard"
    },
    seatLayout: {
      type: Array,
      default: createDefaultSeatLayout
    },
    capacity: {
      type: Number,
      default: 108,
      min: [1, "Screen capacity must be at least 1"]
    },
    status: {
      type: String,
      enum: ["active", "maintenance", "inactive"],
      default: "active"
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

screenSchema.index({ theatre: 1, name: 1 }, { unique: true });

const Screen = mongoose.model("Screen", screenSchema);

module.exports = Screen;
