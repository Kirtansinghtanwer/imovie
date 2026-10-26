import { genresList, languagesList } from '../../data/mockMovies';
import { IconSearch, IconX } from '../common/Icons';

export const MovieFilter = ({
  search,
  setSearch,
  genre,
  setGenre,
  language,
  setLanguage,
  status,
  setStatus,
  sortBy,
  setSortBy,
  totalResults,
  onReset
}) => {
  const hasActiveFilters = search || genre !== 'All' || language !== 'All' || status !== 'all' || sortBy !== 'popularity';

  return (
    <div
      className="p-4 rounded-4 mb-4"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)'
      }}
    >
      {/* Top Search Bar & Sort Selector */}
      <div className="row g-3 align-items-center mb-3">
        {/* Search Input */}
        <div className="col-12 col-md-6 col-lg-5">
          <div className="position-relative">
            <input
              type="text"
              placeholder="Search by title, director, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="cinema-input form-control text-white ps-5"
            />
            <div className="position-absolute top-50 start-0 translate-middle-y ms-3 text-white-50 pointer-events-none d-flex align-items-center">
              <IconSearch size={18} />
            </div>
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2 text-white-50 p-1"
              >
                <IconX size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Status Pills */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="btn-group w-100" role="group" aria-label="Movie status">
            <button
              type="button"
              className={`btn btn-sm ${status === 'all' ? 'btn-cinema' : 'btn-cinema-secondary'}`}
              onClick={() => setStatus('all')}
            >
              All Movies
            </button>
            <button
              type="button"
              className={`btn btn-sm ${status === 'now_showing' ? 'btn-cinema' : 'btn-cinema-secondary'}`}
              onClick={() => setStatus('now_showing')}
            >
              Now Showing
            </button>
            <button
              type="button"
              className={`btn btn-sm ${status === 'coming_soon' ? 'btn-cinema' : 'btn-cinema-secondary'}`}
              onClick={() => setStatus('coming_soon')}
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="col-12 col-lg-3 d-flex align-items-center gap-2">
          <label htmlFor="sortSelect" className="text-white-50 small mb-0 text-nowrap">Sort by:</label>
          <select
            id="sortSelect"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="cinema-select form-select form-select-sm"
          >
            <option value="popularity">Most Popular</option>
            <option value="rating">Top Rated</option>
            <option value="releaseDate">Release Date</option>
            <option value="title">Movie Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Secondary Row: Genre & Language selectors */}
      <div className="row g-3 align-items-center pt-3 border-top border-secondary border-opacity-25">
        <div className="col-12 col-md-5">
          <div className="d-flex align-items-center gap-2">
            <span className="text-white-50 small text-nowrap">Genre:</span>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="cinema-select form-select form-select-sm"
            >
              {genresList.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="d-flex align-items-center gap-2">
            <span className="text-white-50 small text-nowrap">Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="cinema-select form-select form-select-sm"
            >
              {languagesList.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-12 col-md-3 d-flex align-items-center justify-content-between justify-content-md-end gap-2">
          <span className="text-white-50 small">
            <strong>{totalResults}</strong> {totalResults === 1 ? 'movie' : 'movies'}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="btn btn-sm btn-outline-secondary text-white-50 py-1 px-2 d-inline-flex align-items-center gap-1"
              style={{ fontSize: '0.8rem' }}
            >
              <IconX size={14} />
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
