import api from './api';

export const paymentService = {
  // Initiate payment with backend order creation
  initiatePayment: async (paymentDetails) => {
    try {
      const res = await api.post('/payments/create-order', {
        amount: paymentDetails.amount,
        currency: 'USD',
        bookingId: paymentDetails.bookingId,
        paymentMethod: paymentDetails.method
      });
      if (res.data?.orderId) {
        return { success: true, orderId: res.data.orderId, isLive: true };
      }
    } catch {
      // Backend payment gateway not active
    }

    // Explicit demo checkout state simulation
    return {
      success: true,
      orderId: `DEMO-PAY-${Date.now()}`,
      isLive: false,
      message: 'Demo payment simulated. No financial charge was made.'
    };
  },

  // Verify payment status
  verifyPayment: async (orderId, paymentResponse) => {
    try {
      const res = await api.post('/payments/verify', {
        orderId,
        paymentResponse
      });
      if (res.data?.verified) {
        return { verified: true, isLive: true };
      }
    } catch {
      // Demo fallback
    }

    return {
      verified: true,
      isLive: false,
      status: 'confirmed_demo'
    };
  }
};
