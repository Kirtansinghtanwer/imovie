const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Show = require("../models/Show");
const ShowSeat = require("../models/ShowSeat");
const SeatService = require("./seatService");
const config = require("../config/env");

class BookingService {
  /**
   * Creates a new pending booking with server-calculated totals and atomic seat reservation.
   */
  static async createBooking({ userId, showId, seatIdentifiers, selectedSeats = [] }) {
    const seatsToBook = seatIdentifiers || selectedSeats;

    if (!Array.isArray(seatsToBook) || seatsToBook.length === 0) {
      throw new Error("Please select at least one seat to book");
    }

    if (seatsToBook.length > 10) {
      throw new Error("You can book a maximum of 10 seats per transaction");
    }

    if (!mongoose.Types.ObjectId.isValid(showId)) {
      throw new Error("Invalid show ID format");
    }

    const show = await Show.findById(showId)
      .populate("movie")
      .populate("theatre")
      .populate("screen");

    if (!show) {
      throw new Error("Show not found");
    }

    if (new Date(show.startTime) <= new Date()) {
      throw new Error("This show has already started or ended. Bookings are closed.");
    }

    // 1. Concurrency-safe atomic seat reservation
    const reservation = await SeatService.reserveSeats({
      showId: show._id,
      seatIdentifiers: seatsToBook,
      userId,
      holdMinutes: config.reservationHoldMinutes
    });

    // 2. Server-side authoritative price calculation (never trust frontend totals)
    const seatsDetail = reservation.reservedSeats.map((s) => ({
      seatIdentifier: s.seatIdentifier,
      row: s.row,
      number: s.seatNumber,
      seatType: s.seatType,
      price: s.price
    }));

    const ticketSubtotal = seatsDetail.reduce((sum, item) => sum + item.price, 0);
    const fees = Math.round(seatsToBook.length * 1.5 * 100) / 100; // $1.50 per ticket booking fee
    const discount = 0.0;
    const totalAmount = Math.round((ticketSubtotal + fees - discount) * 100) / 100;

    // 3. Create pending booking record
    const booking = await Booking.create({
      user: userId,
      show: show._id,
      movie: show.movie._id,
      theatre: show.theatre._id,
      screen: show.screen._id,
      seats: seatsDetail,
      selectedSeats: seatsToBook,
      ticketSubtotal,
      fees,
      discount,
      totalAmount,
      bookingStatus: "pending",
      paymentStatus: "unpaid",
      expiresAt: reservation.expiresAt,
      qrCodeData: `IMOVIES-TICKET-${Date.now()}-${seatsToBook.join("-")}`
    });

    // 4. Associate booking reference with the held ShowSeat records
    await ShowSeat.updateMany(
      {
        show: show._id,
        seatIdentifier: { $in: seatsToBook }
      },
      {
        $set: { booking: booking._id }
      }
    );

    return booking;
  }

  /**
   * Retrieves bookings for a specific user.
   */
  static async getUserBookings(userId) {
    // Lazy expire any pending bookings past expiresAt
    await this.cleanupExpiredBookings();

    const bookings = await Booking.find({ user: userId })
      .populate("movie", "title posterUrl durationMinutes genres rating")
      .populate("theatre", "name city address")
      .populate("screen", "name screenType")
      .populate("show", "startTime endTime date time format language")
      .sort({ createdAt: -1 });

    return bookings.map((b) => b.toJSON());
  }

  /**
   * Retrieves single booking by ID or reference with ownership check.
   */
  static async getBookingById(bookingId, userId, isAdmin = false) {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(bookingId)) {
      query._id = bookingId;
    } else {
      query.bookingReference = bookingId;
    }

    const booking = await Booking.findOne(query)
      .populate("movie")
      .populate("theatre")
      .populate("screen")
      .populate("show");

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (!isAdmin && booking.user.toString() !== userId.toString()) {
      throw new Error("Unauthorized: you cannot view another user's booking");
    }

    // Lazy expiration check
    if (booking.bookingStatus === "pending" && new Date(booking.expiresAt) < new Date()) {
      booking.bookingStatus = "expired";
      await booking.save();
      await SeatService.releaseSeats({
        showId: booking.show._id,
        seatIdentifiers: booking.selectedSeats,
        bookingId: booking._id
      });
    }

    return booking.toJSON();
  }

  /**
   * Cancels eligible booking and safely releases seats.
   */
  static async cancelBooking({ bookingId, userId, isAdmin = false, reason = "Cancelled by user" }) {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(bookingId)) {
      query._id = bookingId;
    } else {
      query.bookingReference = bookingId;
    }

    const booking = await Booking.findOne(query).populate("show");
    if (!booking) {
      throw new Error("Booking not found");
    }

    if (!isAdmin && booking.user.toString() !== userId.toString()) {
      throw new Error("Unauthorized: you cannot cancel this booking");
    }

    if (booking.bookingStatus === "cancelled") {
      throw new Error("Booking is already cancelled");
    }

    if (booking.bookingStatus === "expired") {
      throw new Error("Booking has already expired");
    }

    // Check showtime eligibility
    if (booking.show && new Date(booking.show.startTime) <= new Date()) {
      throw new Error("Cannot cancel a booking for a show that has already started or completed");
    }

    // Release seats
    await SeatService.releaseSeats({
      showId: booking.show._id || booking.show,
      seatIdentifiers: booking.selectedSeats,
      bookingId: booking._id
    });

    booking.bookingStatus = "cancelled";
    booking.paymentStatus = "refunded";
    booking.cancellationDetails = {
      reason,
      cancelledAt: new Date(),
      refundAmount: booking.totalAmount
    };

    await booking.save();
    return booking.toJSON();
  }

  /**
   * Cleans up expired pending bookings across the system.
   */
  static async cleanupExpiredBookings() {
    const now = new Date();
    const expiredBookings = await Booking.find({
      bookingStatus: "pending",
      expiresAt: { $lt: now }
    });

    for (const b of expiredBookings) {
      b.bookingStatus = "expired";
      await b.save();
      await SeatService.releaseSeats({
        showId: b.show,
        seatIdentifiers: b.selectedSeats,
        bookingId: b._id
      });
    }
  }
}

module.exports = BookingService;
