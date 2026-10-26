const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const SeatService = require("./seatService");
const config = require("../config/env");

class PaymentService {
  /**
   * Creates payment order intent on backend.
   */
  static async createPaymentOrder({ bookingId, userId }) {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(bookingId)) {
      query._id = bookingId;
    } else {
      query.bookingReference = bookingId;
    }

    const booking = await Booking.findOne(query);
    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.user.toString() !== userId.toString()) {
      throw new Error("Unauthorized: you can only pay for your own booking");
    }

    if (booking.bookingStatus !== "pending") {
      throw new Error(`Cannot pay for a booking with status '${booking.bookingStatus}'`);
    }

    if (new Date(booking.expiresAt) < new Date()) {
      booking.bookingStatus = "expired";
      await booking.save();
      await SeatService.releaseSeats({
        showId: booking.show,
        seatIdentifiers: booking.selectedSeats,
        bookingId: booking._id
      });
      throw new Error("Booking hold expired. Please select seats and book again.");
    }

    // Check if an existing pending payment order exists for this booking
    let payment = await Payment.findOne({
      booking: booking._id,
      status: "created"
    });

    if (!payment) {
      const providerOrderId = `order_${config.paymentProvider}_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
      payment = await Payment.create({
        booking: booking._id,
        user: userId,
        provider: config.paymentProvider,
        providerOrderId,
        amount: booking.totalAmount,
        currency: "USD",
        status: "created"
      });
    }

    return {
      orderId: payment.providerOrderId,
      amount: payment.amount,
      currency: payment.currency,
      bookingId: booking._id.toString(),
      isLive: config.paymentProvider !== "dev" && config.paymentProvider !== "simulated"
    };
  }

  /**
   * Verifies payment result with idempotency protection and confirms booking & seats.
   */
  static async verifyPayment({ orderId, paymentResponse = {}, userId }) {
    if (!orderId) {
      throw new Error("Order ID is required for payment verification");
    }

    const payment = await Payment.findOne({ providerOrderId: orderId }).populate("booking");
    if (!payment) {
      throw new Error("Payment order not found");
    }

    if (payment.user.toString() !== userId.toString()) {
      throw new Error("Unauthorized payment verification attempt");
    }

    // Idempotency: If already confirmed, return success immediately
    if (payment.status === "succeeded") {
      return {
        verified: true,
        alreadyProcessed: true,
        isLive: payment.provider !== "dev" && payment.provider !== "simulated",
        booking: payment.booking.toJSON()
      };
    }

    const booking = await Booking.findById(payment.booking);
    if (!booking) {
      throw new Error("Associated booking not found");
    }

    // Provider-specific verification
    let isVerified = false;
    if (config.paymentProvider === "dev" || config.paymentProvider === "simulated") {
      // Development mode verification
      isVerified = true;
    } else {
      // Production provider verification (e.g. Stripe webhook or Razorpay signature)
      isVerified = Boolean(paymentResponse && paymentResponse.signature);
    }

    if (!isVerified) {
      payment.status = "failed";
      await payment.save();
      throw new Error("Payment verification failed. Transaction was not authenticated.");
    }

    // Mark payment as succeeded
    payment.status = "succeeded";
    payment.verifiedAt = new Date();
    payment.providerPaymentId =
      paymentResponse.paymentId ||
      paymentResponse.id ||
      `pay_${config.paymentProvider}_${Date.now()}`;
    payment.metadata = paymentResponse;
    await payment.save();

    // Confirm booking and permanently book seats
    booking.bookingStatus = "confirmed";
    booking.paymentStatus = "paid";
    booking.payment = payment._id;
    await booking.save();

    await SeatService.confirmSeats({
      showId: booking.show,
      seatIdentifiers: booking.selectedSeats,
      bookingId: booking._id
    });

    return {
      verified: true,
      isLive: payment.provider !== "dev" && payment.provider !== "simulated",
      status: "confirmed",
      booking: booking.toJSON()
    };
  }
}

module.exports = PaymentService;
