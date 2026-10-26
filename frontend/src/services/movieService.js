import api from './api';
import { mockMovies } from '../data/mockMovies';

const MOVIES_LOCAL_KEY = 'imovies_movies_cache';

// Initialize local mutable storage for mock movies so admin CRUD persists during session
const getStoredMovies = () => {
  try {
    const cached = localStorage.getItem(MOVIES_LOCAL_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    console.error('Failed reading movies from storage', err);
  }
  localStorage.setItem(MOVIES_LOCAL_KEY, JSON.stringify(mockMovies));
  return mockMovies;
};

export const movieService = {
  // Fetch all movies with optional search, genre, language, status, and sorting
  getMovies: async (params = {}) => {
    try {
      const res = await api.get('/movies', { params });
      if (res.data && Array.isArray(res.data.movies)) {
        return { movies: res.data.movies, total: res.data.total || res.data.movies.length, isDemo: false };
      }
    } catch {
      // Backend not yet connected, use mock movies
    }

    let list = [...getStoredMovies()];
    const { search, genre, language, status, sortBy } = params;

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      list = list.filter((m) =>
        m.title.toLowerCase().includes(q) ||
        m.synopsis.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q)
      );
    }

    if (genre && genre !== 'All') {
      list = list.filter((m) => m.genre && m.genre.includes(genre));
    }

    if (language && language !== 'All') {
      list = list.filter((m) => m.language.toLowerCase() === language.toLowerCase());
    }

    if (status && status !== 'all') {
      list = list.filter((m) => m.status === status);
    }

    // Sorting
    if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'releaseDate') {
      list.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    } else if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Default: popularity / rating
      list.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
    }

    return { movies: list, total: list.length, isDemo: true };
  },

  // Get single movie by ID or slug
  getMovieById: async (id) => {
    try {
      const res = await api.get(`/movies/${id}`);
      if (res.data?.movie) {
        return { movie: res.data.movie, isDemo: false };
      }
    } catch {
      // Backend fallback
    }

    const movies = getStoredMovies();
    const movie = movies.find((m) => m.id === id || m.slug === id);
    return { movie: movie || null, isDemo: true };
  },

  // Get featured movies for home banner
  getFeaturedMovies: async () => {
    const { movies } = await movieService.getMovies();
    return movies.filter((m) => m.featured || m.rating >= 8.5);
  },

  // Admin: Create new movie
  createMovie: async (movieData) => {
    try {
      const res = await api.post('/movies', movieData);
      if (res.data?.movie) {
        return { success: true, movie: res.data.movie };
      }
    } catch {
      // Demo fallback
    }

    const currentList = getStoredMovies();
    const newMovie = {
      ...movieData,
      id: `mov-${Date.now().toString().slice(-4)}`,
      rating: movieData.rating || 8.0,
      voteCount: 1,
      formats: movieData.formats || ["2D", "IMAX"],
      genre: Array.isArray(movieData.genre) ? movieData.genre : (movieData.genre ? movieData.genre.split(',').map(s => s.trim()) : ["Action"]),
      durationFormatted: `${Math.floor(movieData.duration / 60)}h ${movieData.duration % 60}m`
    };

    const updated = [newMovie, ...currentList];
    localStorage.setItem(MOVIES_LOCAL_KEY, JSON.stringify(updated));
    return { success: true, movie: newMovie, isDemo: true };
  },

  // Admin: Update movie
  updateMovie: async (id, updatedFields) => {
    try {
      const res = await api.put(`/movies/${id}`, updatedFields);
      if (res.data?.movie) {
        return { success: true, movie: res.data.movie };
      }
    } catch {
      // Demo fallback
    }

    const currentList = getStoredMovies();
    const index = currentList.findIndex((m) => m.id === id);
    if (index !== -1) {
      currentList[index] = { ...currentList[index], ...updatedFields };
      localStorage.setItem(MOVIES_LOCAL_KEY, JSON.stringify(currentList));
      return { success: true, movie: currentList[index], isDemo: true };
    }
    return { success: false, message: 'Movie not found' };
  },

  // Admin: Delete movie
  deleteMovie: async (id) => {
    try {
      await api.delete(`/movies/${id}`);
      return { success: true };
    } catch {
      // Demo fallback
    }

    const currentList = getStoredMovies();
    const filtered = currentList.filter((m) => m.id !== id);
    localStorage.setItem(MOVIES_LOCAL_KEY, JSON.stringify(filtered));
    return { success: true, isDemo: true };
  }
};
