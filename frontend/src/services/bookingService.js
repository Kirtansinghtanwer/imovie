import api from './api';
import { mockBookings } from '../data/mockBookings';

const BOOKINGS_LOCAL_KEY = 'imovies_bookings_cache';

const getStoredBookings = () => {
  try {
    const cached = localStorage.getItem(BOOKINGS_LOCAL_KEY);
    if (cached) return JSON.parse(cached);
  } catch (err) {
    console.error('Failed reading bookings from storage', err);
  }
  localStorage.setItem(BOOKINGS_LOCAL_KEY, JSON.stringify(mockBookings));
  return mockBookings;
};

export const bookingService = {
  // Create booking (initiates booking verification)
  createBooking: async (bookingPayload) => {
    try {
      const res = await api.post('/bookings', bookingPayload);
      if (res.data?.booking) {
        return { success: true, booking: res.data.booking, isDemo: false };
      }
    } catch {
      // Backend not reached, create verified demo booking record
    }

    const current = getStoredBookings();
    const newRef = `IMV-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking = {
      ...bookingPayload,
      id: newRef,
      status: 'confirmed',
      paymentStatus: 'paid (demo mode)',
      createdAt: new Date().toISOString(),
      qrCodeData: `IMOVIES-DEMO-TICKET-${newRef}-${Date.now()}`,
      isDemoBooking: true
    };

    const updated = [newBooking, ...current];
    localStorage.setItem(BOOKINGS_LOCAL_KEY, JSON.stringify(updated));
    return { success: true, booking: newBooking, isDemo: true };
  },

  // Get user bookings
  getUserBookings: async (userId = null) => {
    try {
      const res = await api.get('/bookings/my-bookings');
      if (res.data?.bookings) {
        return { bookings: res.data.bookings, isDemo: false };
      }
    } catch {
      // Backend fallback
    }

    const all = getStoredBookings();
    const userBookings = userId ? all.filter((b) => b.userId === userId || b.userId === 'usr-001') : all;
    return { bookings: userBookings, isDemo: true };
  },

  // Get booking by ID
  getBookingById: async (bookingId) => {
    try {
      const res = await api.get(`/bookings/${bookingId}`);
      if (res.data?.booking) {
        return { booking: res.data.booking, isDemo: false };
      }
    } catch {
      // Backend fallback
    }

    const all = getStoredBookings();
    const found = all.find((b) => b.id === bookingId);
    return { booking: found || null, isDemo: true };
  },

  // Cancel booking
  cancelBooking: async (bookingId, reason = 'Cancelled by customer') => {
    try {
      const res = await api.post(`/bookings/${bookingId}/cancel`, { reason });
      if (res.data?.success) {
        return { success: true, message: res.data.message };
      }
    } catch {
      // Demo fallback
    }

    const all = getStoredBookings();
    const idx = all.findIndex((b) => b.id === bookingId);
    if (idx !== -1) {
      all[idx].status = 'cancelled';
      all[idx].paymentStatus = 'refunded (demo)';
      all[idx].cancellationReason = reason;
      localStorage.setItem(BOOKINGS_LOCAL_KEY, JSON.stringify(all));
      return { success: true, isDemo: true, booking: all[idx] };
    }
    return { success: false, message: 'Booking reference not found' };
  },

  // Admin: Get all bookings
  getAllBookingsAdmin: async () => {
    try {
      const res = await api.get('/admin/bookings');
      if (res.data?.bookings) return { bookings: res.data.bookings, isDemo: false };
    } catch {
      // Demo
    }
    return { bookings: getStoredBookings(), isDemo: true };
  }
};
