import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { movieService } from '../services/movieService';
import { showService } from '../services/showService';
import { sampleCities } from '../data/mockTheatres';
import { generateShowDates } from '../data/mockShows';
import { EmptyState } from '../components/common/EmptyState';
import {
  IconMapPin,
  IconCalendar,
  IconClock,
  IconTicket
} from '../components/common/Icons';

export const ShowSelection = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [dates] = useState(generateShowDates());
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedCity, setSelectedCity] = useState(sampleCities[0]);
  const [theatreShows, setTheatreShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await movieService.getMovieById(movieId);
      if (res.movie) {
        setMovie(res.movie);
      }
    };
    fetchMovie();
  }, [movieId]);

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      try {
        const res = await showService.getShowsGroupedByTheatre(
          movieId,
          selectedCity,
          selectedDate.isoDate
        );
        setTheatreShows(res.theatreShows || []);
      } catch (err) {
        console.error('Failed fetching shows', err);
      } finally {
        setLoading(false);
      }
    };
    if (movieId) {
      fetchShows();
    }
  }, [movieId, selectedCity, selectedDate]);

  const handleSelectShow = (theatre, show) => {
    // Navigate to seat selection passing state so the booking context is 100% consistent
    navigate(`/shows/${show.id}/seats`, {
      state: {
        movie,
        theatre,
        show,
        date: selectedDate
      }
    });
  };

  return (
    <div className="container-fluid px-3 px-lg-5 py-5">
      {/* 1. MOVIE SUMMARY STRIP */}
      {movie && (
        <div
          className="p-4 rounded-4 mb-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-4 shadow-lg"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-strong)'
          }}
        >
          <div className="d-flex align-items-center gap-4">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="rounded-3 shadow object-fit-cover"
              width="80"
              height="115"
            />
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-danger rounded-pill px-2 py-0" style={{ fontSize: '0.7rem' }}>
                  {movie.language}
                </span>
                <span className="text-white-50 small d-flex align-items-center gap-1">
                  <IconClock size={13} />
                  {movie.durationFormatted}
                </span>
              </div>
              <h3 className="fw-bold text-white mb-1">{movie.title}</h3>
              <p className="text-white-50 small mb-0">
                {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre} • Directed by {movie.director}
              </p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link to={`/movies/${movie.id}`} className="btn btn-cinema-secondary btn-sm">
              Movie Details
            </Link>
          </div>
        </div>
      )}

      {/* 2. CITY SELECTOR & DATE TABS */}
      <div
        className="p-4 rounded-4 mb-4"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div className="row g-3 align-items-center mb-4">
          <div className="col-12 col-md-5 col-lg-4">
            <label className="cinema-label d-flex align-items-center gap-1">
              <IconMapPin size={16} className="text-danger" />
              Select Cinema City:
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="cinema-select form-select"
            >
              {sampleCities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-7 col-lg-8">
            <label className="cinema-label d-flex align-items-center gap-1">
              <IconCalendar size={16} className="text-danger" />
              Select Showtime Date:
            </label>
            <div className="d-flex align-items-center gap-2 overflow-x-auto pb-1">
              {dates.map((d) => {
                const isSelected = selectedDate.isoDate === d.isoDate;
                return (
                  <button
                    key={d.isoDate}
                    type="button"
                    onClick={() => setSelectedDate(d)}
                    className={`btn text-center py-2 px-3 rounded-3 text-nowrap transition-all ${
                      isSelected
                        ? 'btn-cinema shadow'
                        : 'btn-cinema-secondary'
                    }`}
                    style={{ minWidth: '95px' }}
                  >
                    <div className="small fw-semibold text-uppercase" style={{ fontSize: '0.7rem' }}>
                      {d.dayName}
                    </div>
                    <div className="fs-5 fw-extrabold">{d.dayNum}</div>
                    <div className="small" style={{ fontSize: '0.65rem' }}>{d.monthName}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. THEATRES & SHOWTIMES LIST */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="fw-bold text-white mb-0">
          Available Theatres & Timings in {selectedCity}
        </h4>
        <span className="text-white-50 small">
          Showing for: <strong>{selectedDate.label}</strong>
        </span>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status" />
          <p className="text-white-50 mt-3 small">Checking show schedules across cinemas...</p>
        </div>
      ) : theatreShows.length === 0 ? (
        <EmptyState
          icon={IconTicket}
          title="No showtimes found in this city"
          message={`There are no scheduled screenings for ${movie?.title || 'this movie'} in ${selectedCity} on ${selectedDate.label}. Try picking another date or nearby city.`}
          actionLabel="Switch to New York"
          onAction={() => setSelectedCity("New York")}
        />
      ) : (
        <div className="d-flex flex-column gap-4">
          {theatreShows.map(({ theatre, shows }) => (
            <div
              key={theatre.id}
              className="p-4 rounded-4 shadow"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div className="row g-3 align-items-start justify-content-between mb-3 pb-3 border-bottom border-secondary border-opacity-25">
                <div className="col-12 col-md-8">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h5 className="fw-bold text-white mb-0">{theatre.name}</h5>
                    <span className="badge bg-dark border border-secondary text-white-50 px-2 py-0" style={{ fontSize: '0.7rem' }}>
                      {theatre.screensCount} Screens
                    </span>
                  </div>
                  <p className="text-white-50 small mb-2 d-flex align-items-center gap-1">
                    <IconMapPin size={13} className="text-danger" />
                    {theatre.location} — {theatre.address}
                  </p>
                  <div className="d-flex flex-wrap gap-1">
                    {theatre.amenities?.map((am, i) => (
                      <span key={i} className="badge bg-black text-white-50 border border-secondary border-opacity-25 px-2 py-1" style={{ fontSize: '0.65rem' }}>
                        {am}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="col-12 col-md-4 text-md-end text-white-50 small">
                  <div>Cancellable up to 2h before show</div>
                  <div className="text-success fw-medium">Instant M-Ticket Delivery</div>
                </div>
              </div>

              {/* Showtimes Pills */}
              <div>
                <span className="text-white-50 small fw-bold text-uppercase d-block mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                  Available Showtimes:
                </span>
                <div className="d-flex flex-wrap gap-3">
                  {shows.map((show) => {
                    const isFillingFast = show.status === 'filling_fast';
                    return (
                      <button
                        key={show.id}
                        type="button"
                        onClick={() => handleSelectShow(theatre, show)}
                        className="btn btn-cinema-secondary p-3 text-start rounded-3 d-flex flex-column gap-1 transition-all"
                        style={{ minWidth: '150px' }}
                      >
                        <div className="d-flex align-items-center justify-content-between gap-2">
                          <span className="fw-bold text-white fs-6">{show.time}</span>
                          <span className="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-25" style={{ fontSize: '0.65rem' }}>
                            {show.format}
                          </span>
                        </div>
                        <small className="text-white-50 text-truncate" style={{ fontSize: '0.72rem' }}>
                          {show.screenName || 'Main Auditorium'}
                        </small>
                        <div className="d-flex align-items-center justify-content-between mt-1 pt-1 border-top border-secondary border-opacity-25 text-white-50" style={{ fontSize: '0.7rem' }}>
                          <span>From ${show.standardPrice?.toFixed(2)}</span>
                          {isFillingFast && (
                            <span className="text-warning fw-semibold">Fast Filling</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
