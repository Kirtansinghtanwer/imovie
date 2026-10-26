import api from './api';
import { mockShowsList, generateSeatLayout } from '../data/mockShows';
import { mockTheatres } from '../data/mockTheatres';

const SHOWS_LOCAL_KEY = 'imovies_shows_cache';

const getStoredShows = () => {
  try {
    const cached = localStorage.getItem(SHOWS_LOCAL_KEY);
    if (cached) return JSON.parse(cached);
  } catch (err) {
    console.error('Failed reading shows from storage', err);
  }
  localStorage.setItem(SHOWS_LOCAL_KEY, JSON.stringify(mockShowsList));
  return mockShowsList;
};

export const showService = {
  // Get shows grouped by theatre for a movie, city, and date
  getShowsGroupedByTheatre: async (movieId, city = null, date = null) => {
    try {
      const res = await api.get('/shows', { params: { movieId, city, date } });
      if (res.data?.theatreShows) {
        return { theatreShows: res.data.theatreShows, isDemo: false };
      }
    } catch {
      // Backend fallback
    }

    const allShows = getStoredShows();
    // Filter shows for this movie
    const matchingShows = allShows.filter((s) => s.movieId === movieId);

    // Group by theatre
    const grouped = [];
    const relevantTheatres = city
      ? mockTheatres.filter((t) => t.city.toLowerCase() === city.toLowerCase())
      : mockTheatres;

    for (const theatre of relevantTheatres) {
      const showsForTheatre = matchingShows.filter((s) => s.theatreId === theatre.id);
      if (showsForTheatre.length > 0) {
        grouped.push({
          theatre,
          shows: showsForTheatre
        });
      }
    }

    // If no specific shows exist for this movie yet, provide generated realistic demo shows
    if (grouped.length === 0 && relevantTheatres.length > 0) {
      const sampleTimes = [
        { time: "11:00 AM", format: "IMAX 3D", screen: "Screen 1 - Laser", standardPrice: 15.50, premiumPrice: 22.00 },
        { time: "02:30 PM", format: "Dolby Atmos", screen: "Screen 2 - Atmos", standardPrice: 14.50, premiumPrice: 21.00 },
        { time: "06:15 PM", format: "Dolby Cinema", screen: "Screen 1 - Laser", standardPrice: 16.00, premiumPrice: 23.50 },
        { time: "09:45 PM", format: "2D 4K", screen: "Screen 3 - Prime", standardPrice: 13.50, premiumPrice: 19.50 }
      ];

      relevantTheatres.slice(0, 3).forEach((th, idx) => {
        grouped.push({
          theatre: th,
          shows: sampleTimes.map((st, sIdx) => ({
            id: `show-${th.id}-${idx}-${sIdx}`,
            movieId,
            theatreId: th.id,
            screenName: st.screen,
            format: st.format,
            language: "English",
            time: st.time,
            standardPrice: st.standardPrice,
            premiumPrice: st.premiumPrice,
            status: sIdx === 1 ? "filling_fast" : "available"
          }))
        });
      });
    }

    return { theatreShows: grouped, isDemo: true };
  },

  // Get single show by ID
  getShowById: async (showId) => {
    try {
      const res = await api.get(`/shows/${showId}`);
      if (res.data?.show) return { show: res.data.show, isDemo: false };
    } catch {
      // Backend fallback
    }

    const allShows = getStoredShows();
    let found = allShows.find((s) => s.id === showId);

    // If dynamic ID
    if (!found) {
      found = {
        id: showId,
        movieId: "mov-001",
        theatreId: "th-101",
        screenName: "Screen 1 - IMAX Laser",
        format: "IMAX 3D",
        language: "English",
        time: "06:00 PM",
        standardPrice: 16.50,
        premiumPrice: 24.00,
        status: "available"
      };
    }

    return { show: found, isDemo: true };
  },

  // Get seat map for a show
  getSeatLayoutForShow: async (showId) => {
    try {
      const res = await api.get(`/shows/${showId}/seats`);
      if (res.data?.seatLayout) {
        return { seatLayout: res.data.seatLayout, isDemo: false };
      }
    } catch {
      // Fallback
    }
    const layout = generateSeatLayout(showId);
    return { seatLayout: layout, isDemo: true };
  },

  // Admin: Get all shows flat list
  getAllShows: async () => {
    try {
      const res = await api.get('/shows');
      if (res.data?.shows) return { shows: res.data.shows, isDemo: false };
    } catch {
      // Demo
    }
    return { shows: getStoredShows(), isDemo: true };
  },

  // Admin: Create show
  createShow: async (showData) => {
    try {
      const res = await api.post('/shows', showData);
      if (res.data?.show) return { success: true, show: res.data.show };
    } catch {
      // Demo
    }
    const current = getStoredShows();
    const newShow = {
      ...showData,
      id: `show-${Date.now().toString().slice(-4)}`,
      status: 'available'
    };
    const updated = [newShow, ...current];
    localStorage.setItem(SHOWS_LOCAL_KEY, JSON.stringify(updated));
    return { success: true, show: newShow, isDemo: true };
  },

  // Admin: Delete show
  deleteShow: async (id) => {
    try {
      await api.delete(`/shows/${id}`);
      return { success: true };
    } catch {
      // Demo
    }
    const current = getStoredShows();
    const filtered = current.filter((s) => s.id !== id);
    localStorage.setItem(SHOWS_LOCAL_KEY, JSON.stringify(filtered));
    return { success: true, isDemo: true };
  }
};
