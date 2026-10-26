import api from './api';
import { mockTheatres } from '../data/mockTheatres';

const THEATRES_LOCAL_KEY = 'imovies_theatres_cache';

const getStoredTheatres = () => {
  try {
    const cached = localStorage.getItem(THEATRES_LOCAL_KEY);
    if (cached) return JSON.parse(cached);
  } catch (err) {
    console.error('Failed reading theatres from storage', err);
  }
  localStorage.setItem(THEATRES_LOCAL_KEY, JSON.stringify(mockTheatres));
  return mockTheatres;
};

export const theatreService = {
  // Get all theatres, optionally filtered by city
  getTheatres: async (city = null) => {
    try {
      const res = await api.get('/theatres', { params: { city } });
      if (res.data?.theatres) {
        return { theatres: res.data.theatres, isDemo: false };
      }
    } catch {
      // Backend fallback
    }

    let list = [...getStoredTheatres()];
    if (city && city !== 'All') {
      list = list.filter((t) => t.city.toLowerCase() === city.toLowerCase());
    }
    return { theatres: list, isDemo: true };
  },

  getTheatreById: async (id) => {
    try {
      const res = await api.get(`/theatres/${id}`);
      if (res.data?.theatre) return { theatre: res.data.theatre, isDemo: false };
    } catch {
      // Demo
    }
    const list = getStoredTheatres();
    const theatre = list.find((t) => t.id === id);
    return { theatre: theatre || null, isDemo: true };
  },

  createTheatre: async (theatreData) => {
    try {
      const res = await api.post('/theatres', theatreData);
      if (res.data?.theatre) return { success: true, theatre: res.data.theatre };
    } catch {
      // Demo
    }
    const current = getStoredTheatres();
    const newTheatre = {
      ...theatreData,
      id: `th-${Date.now().toString().slice(-3)}`,
      screensCount: Number(theatreData.screensCount) || 4,
      status: 'active',
      rating: 4.8,
      amenities: Array.isArray(theatreData.amenities) ? theatreData.amenities : ["Dolby Atmos", "Recliners"]
    };
    const updated = [newTheatre, ...current];
    localStorage.setItem(THEATRES_LOCAL_KEY, JSON.stringify(updated));
    return { success: true, theatre: newTheatre, isDemo: true };
  },

  updateTheatre: async (id, updatedFields) => {
    try {
      const res = await api.put(`/theatres/${id}`, updatedFields);
      if (res.data?.theatre) return { success: true, theatre: res.data.theatre };
    } catch {
      // Demo
    }
    const current = getStoredTheatres();
    const idx = current.findIndex((t) => t.id === id);
    if (idx !== -1) {
      current[idx] = { ...current[idx], ...updatedFields };
      localStorage.setItem(THEATRES_LOCAL_KEY, JSON.stringify(current));
      return { success: true, theatre: current[idx], isDemo: true };
    }
    return { success: false, message: 'Theatre not found' };
  },

  deleteTheatre: async (id) => {
    try {
      await api.delete(`/theatres/${id}`);
      return { success: true };
    } catch {
      // Demo
    }
    const current = getStoredTheatres();
    const filtered = current.filter((t) => t.id !== id);
    localStorage.setItem(THEATRES_LOCAL_KEY, JSON.stringify(filtered));
    return { success: true, isDemo: true };
  }
};
