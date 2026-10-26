import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { mockMovies } from '../data/mockMovies';

const FavoritesContext = createContext(null);
const FAVORITES_STORAGE_KEY = 'imovies_favorites';

export const FavoritesProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ["mov-001", "mov-002"];
    } catch {
      return ["mov-001", "mov-002"];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch (err) {
      console.error('Failed to save favorites to localStorage', err);
    }
  }, [favoriteIds]);

  const isFavorite = (movieId) => favoriteIds.includes(movieId);

  const toggleFavorite = (movie) => {
    if (!movie?.id) return;
    if (favoriteIds.includes(movie.id)) {
      setFavoriteIds((prev) => prev.filter((id) => id !== movie.id));
      toast.info(`Removed "${movie.title}" from your favorites`);
    } else {
      setFavoriteIds((prev) => [...prev, movie.id]);
      toast.success(`Added "${movie.title}" to your favorites!`);
    }
  };

  const getFavoriteMovies = () => {
    return mockMovies.filter((m) => favoriteIds.includes(m.id));
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        isFavorite,
        toggleFavorite,
        getFavoriteMovies,
        favoriteCount: favoriteIds.length
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider');
  return ctx;
};
