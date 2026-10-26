import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { movieService } from '../services/movieService';
import { MovieCard } from '../components/movies/MovieCard';
import { MovieFilter } from '../components/movies/MovieFilter';
import { EmptyState } from '../components/common/EmptyState';
import { IconFilm } from '../components/common/Icons';

export const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [genre, setGenre] = useState(searchParams.get('genre') || 'All');
  const [language, setLanguage] = useState(searchParams.get('language') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [sortBy, setSortBy] = useState('popularity');

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);

  // Sync state with query parameters if changed externally
  useEffect(() => {
    if (searchParams.get('search') !== null) setSearch(searchParams.get('search'));
    if (searchParams.get('genre') !== null) setGenre(searchParams.get('genre'));
    if (searchParams.get('language') !== null) setLanguage(searchParams.get('language'));
    if (searchParams.get('status') !== null) setStatus(searchParams.get('status'));
  }, [searchParams]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await movieService.getMovies({
          search,
          genre,
          language,
          status,
          sortBy
        });
        setMovies(res.movies);
      } catch (err) {
        console.error('Failed fetching movies', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [search, genre, language, status, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setGenre('All');
    setLanguage('All');
    setStatus('all');
    setSortBy('popularity');
    setSearchParams({});
  };

  const visibleMovies = movies.slice(0, visibleCount);
  const hasMore = visibleCount < movies.length;

  return (
    <div className="container-fluid px-3 px-lg-5 py-5">
      {/* Page Header */}
      <div className="mb-4">
        <span className="badge bg-danger rounded-pill px-3 py-1 mb-2">Cinema Catalogue</span>
        <h1 className="fw-extrabold text-white mb-2">Explore Movies & Premieres</h1>
        <p className="text-white-50 fs-6" style={{ maxWidth: '640px' }}>
          Discover the latest releases, upcoming blockbusters, and timeless cinematic masterpieces. Filter by genre, language, or format to book your seats.
        </p>
      </div>

      {/* Filter Component */}
      <MovieFilter
        search={search}
        setSearch={setSearch}
        genre={genre}
        setGenre={setGenre}
        language={language}
        setLanguage={setLanguage}
        status={status}
        setStatus={setStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
        totalResults={movies.length}
        onReset={handleResetFilters}
      />

      {/* Movies Grid or Empty State */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading movies...</span>
          </div>
          <p className="text-white-50 mt-3 small">Loading movies catalog...</p>
        </div>
      ) : movies.length === 0 ? (
        <EmptyState
          icon={IconFilm}
          title="No movies found"
          message={`We couldn't find any movies matching your current criteria. Try adjusting your search query or reset the filters.`}
          actionLabel="Clear All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <>
          <div className="row g-4">
            {visibleMovies.map((movie) => (
              <div key={movie.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>

          {/* Load More Pagination Button */}
          {hasMore && (
            <div className="text-center mt-5">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 4)}
                className="btn btn-cinema-secondary px-4 py-2"
              >
                Load More Movies ({movies.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
