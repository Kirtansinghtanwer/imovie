import api from './api';
import { mockReviews } from '../data/mockReviews';

const REVIEWS_LOCAL_KEY = 'imovies_reviews_cache';

const getStoredReviews = () => {
  try {
    const cached = localStorage.getItem(REVIEWS_LOCAL_KEY);
    if (cached) return JSON.parse(cached);
  } catch (err) {
    console.error('Failed reading reviews from storage', err);
  }
  localStorage.setItem(REVIEWS_LOCAL_KEY, JSON.stringify(mockReviews));
  return mockReviews;
};

export const reviewService = {
  getReviewsByMovie: async (movieId) => {
    try {
      const res = await api.get(`/movies/${movieId}/reviews`);
      if (res.data?.reviews) return { reviews: res.data.reviews, isDemo: false };
    } catch {
      // Backend fallback
    }

    const all = getStoredReviews();
    const movieReviews = all.filter((r) => r.movieId === movieId);
    return { reviews: movieReviews, isDemo: true };
  },

  getAllReviewsAdmin: async () => {
    try {
      const res = await api.get('/admin/reviews');
      if (res.data?.reviews) return { reviews: res.data.reviews, isDemo: false };
    } catch {
      // Demo
    }
    return { reviews: getStoredReviews(), isDemo: true };
  },

  submitReview: async (reviewData) => {
    try {
      const res = await api.post(`/movies/${reviewData.movieId}/reviews`, reviewData);
      if (res.data?.review) return { success: true, review: res.data.review, isDemo: false };
    } catch {
      // Demo fallback
    }

    const all = getStoredReviews();
    const newRev = {
      id: `rev-${Date.now().toString().slice(-4)}`,
      ...reviewData,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      verifiedPurchase: true
    };
    const updated = [newRev, ...all];
    localStorage.setItem(REVIEWS_LOCAL_KEY, JSON.stringify(updated));
    return { success: true, review: newRev, isDemo: true };
  },

  deleteReview: async (reviewId) => {
    try {
      await api.delete(`/admin/reviews/${reviewId}`);
      return { success: true };
    } catch {
      // Demo
    }
    const all = getStoredReviews();
    const filtered = all.filter((r) => r.id !== reviewId);
    localStorage.setItem(REVIEWS_LOCAL_KEY, JSON.stringify(filtered));
    return { success: true, isDemo: true };
  }
};
