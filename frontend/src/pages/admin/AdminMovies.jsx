import React, { useState, useEffect } from 'react';
import { movieService } from '../../services/movieService';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { toast } from 'react-toastify';
import {
  IconFilm,
  IconEdit,
  IconTrash,
  IconSearch,
  IconX
} from '../../components/common/Icons';

export const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    synopsis: '',
    genre: 'Action, Sci-Fi',
    language: 'English',
    duration: 150,
    releaseDate: '2024-11-01',
    status: 'now_showing',
    director: '',
    rating: 8.5,
    posterUrl: '',
    backdropUrl: '',
    trailerUrl: ''
  });

  // Delete dialog state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);

  const fetchMovies = async () => {
    setLoading(true);
    const res = await movieService.getMovies({ search });
    setMovies(res.movies || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, [search]);

  const handleOpenCreateModal = () => {
    setEditingMovie(null);
    setFormData({
      title: '',
      synopsis: '',
      genre: 'Action, Sci-Fi',
      language: 'English',
      duration: 150,
      releaseDate: new Date().toISOString().split('T')[0],
      status: 'now_showing',
      director: '',
      rating: 8.5,
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
      trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w'
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      synopsis: movie.synopsis,
      genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre,
      language: movie.language,
      duration: movie.duration,
      releaseDate: movie.releaseDate,
      status: movie.status,
      director: movie.director,
      rating: movie.rating,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl,
      trailerUrl: movie.trailerUrl || ''
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (editingMovie) {
      await movieService.updateMovie(editingMovie.id, {
        ...formData,
        genre: formData.genre.split(',').map((s) => s.trim())
      });
      toast.success(`Updated "${formData.title}" successfully!`);
    } else {
      await movieService.createMovie({
        ...formData,
        genre: formData.genre.split(',').map((s) => s.trim())
      });
      toast.success(`Created movie "${formData.title}"!`);
    }
    setModalOpen(false);
    fetchMovies();
  };

  const handleDeleteClick = (movie) => {
    setMovieToDelete(movie);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!movieToDelete) return;
    await movieService.deleteMovie(movieToDelete.id);
    toast.info(`Deleted movie "${movieToDelete.title}".`);
    setDeleteConfirmOpen(false);
    setMovieToDelete(null);
    fetchMovies();
  };

  return (
    <div className="admin-movies-page">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-extrabold text-white mb-1">Movie Inventory Management</h2>
          <p className="text-white-50 small mb-0">Manage catalogue titles, posters, synopses, and release statuses.</p>
        </div>

        <button onClick={handleOpenCreateModal} className="btn btn-cinema d-flex align-items-center gap-2">
          <IconFilm size={18} />
          Add New Movie
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="p-3 rounded-4 mb-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
        <div className="position-relative" style={{ maxWidth: '380px' }}>
          <input
            type="text"
            placeholder="Search movies by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="cinema-input form-control text-white ps-5"
          />
          <div className="position-absolute top-50 start-0 translate-middle-y ms-3 text-white-50 pointer-events-none d-flex align-items-center">
            <IconSearch size={16} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-4 rounded-4 shadow" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
        <div className="table-responsive">
          <table className="table table-cinema mb-0">
            <thead>
              <tr>
                <th>Poster</th>
                <th>Title & Director</th>
                <th>Genre</th>
                <th>Language</th>
                <th>Release Date</th>
                <th>Status</th>
                <th>Rating</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-white-50">
                    Loading movies...
                  </td>
                </tr>
              ) : movies.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-white-50">
                    No movies found matching your search.
                  </td>
                </tr>
              ) : (
                movies.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <img
                        src={m.posterUrl}
                        alt={m.title}
                        className="rounded-2 object-fit-cover shadow-sm"
                        width="45"
                        height="62"
                      />
                    </td>
                    <td>
                      <div className="fw-bold text-white">{m.title}</div>
                      <small className="text-white-50">Dir: {m.director}</small>
                    </td>
                    <td>
                      <small className="text-white-50">
                        {Array.isArray(m.genre) ? m.genre.slice(0, 2).join(', ') : m.genre}
                      </small>
                    </td>
                    <td className="text-white">{m.language}</td>
                    <td className="text-white-50 small">{m.releaseDate}</td>
                    <td>
                      <span className={`badge ${m.status === 'now_showing' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {m.status === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
                      </span>
                    </td>
                    <td className="text-warning fw-bold small">{m.rating} ★</td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(m)}
                          className="btn btn-sm btn-outline-secondary text-white p-1"
                          title="Edit Movie"
                        >
                          <IconEdit size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(m)}
                          className="btn btn-sm btn-outline-danger p-1"
                          title="Delete Movie"
                        >
                          <IconTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1060 }}
        >
          <div
            className="cinema-modal rounded-4 shadow-2xl p-4 overflow-y-auto"
            style={{
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              backgroundColor: 'var(--bg-modal)',
              border: '1px solid var(--border-strong)'
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom border-secondary border-opacity-25">
              <h5 className="fw-bold text-white mb-0">
                {editingMovie ? `Edit Movie: ${editingMovie.title}` : 'Add New Movie Release'}
              </h5>
              <button onClick={() => setModalOpen(false)} className="btn text-white-50 p-1">
                <IconX size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-8">
                  <label className="cinema-label">Movie Title:</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="cinema-input form-control text-white"
                    required
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="cinema-label">Director:</label>
                  <input
                    type="text"
                    value={formData.director}
                    onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                    className="cinema-input form-control text-white"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="cinema-label">Synopsis:</label>
                <textarea
                  rows="3"
                  value={formData.synopsis}
                  onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                  className="cinema-input form-control text-white"
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-4">
                  <label className="cinema-label">Genres (comma separated):</label>
                  <input
                    type="text"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="cinema-input form-control text-white"
                    required
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="cinema-label">Language:</label>
                  <input
                    type="text"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="cinema-input form-control text-white"
                    required
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="cinema-label">Duration (minutes):</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="cinema-input form-control text-white"
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-4">
                  <label className="cinema-label">Release Date:</label>
                  <input
                    type="date"
                    value={formData.releaseDate}
                    onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                    className="cinema-input form-control text-white"
                    required
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="cinema-label">Release Status:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="cinema-select form-select"
                  >
                    <option value="now_showing">Now Showing</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <label className="cinema-label">Rating (out of 10):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="cinema-input form-control text-white"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="cinema-label">Poster Image URL:</label>
                <input
                  type="url"
                  value={formData.posterUrl}
                  onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                  className="cinema-input form-control text-white"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="cinema-label">Backdrop Image URL:</label>
                <input
                  type="url"
                  value={formData.backdropUrl}
                  onChange={(e) => setFormData({ ...formData, backdropUrl: e.target.value })}
                  className="cinema-input form-control text-white"
                  required
                />
              </div>

              <div className="d-flex align-items-center justify-content-end gap-2 pt-3 border-top border-secondary border-opacity-25">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-cinema-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-cinema btn-sm">
                  {editingMovie ? 'Save Changes' : 'Create Movie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Movie"
        message={`Are you sure you want to permanently delete "${movieToDelete?.title}" from the cinema catalogue? This action cannot be undone.`}
        confirmLabel="Yes, Delete Movie"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setMovieToDelete(null);
        }}
      />
    </div>
  );
};
