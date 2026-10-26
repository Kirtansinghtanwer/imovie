import { useState, useEffect } from 'react';
import { showService } from '../../services/showService';
import { mockMovies } from '../../data/mockMovies';
import { mockTheatres } from '../../data/mockTheatres';
import { toast } from 'react-toastify';
import {
  IconClock,
  IconTrash,
  IconX
} from '../../components/common/Icons';

export const AdminShows = () => {
  const [shows, setShows] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    movieId: 'mov-001',
    theatreId: 'th-101',
    screenName: 'Screen 1 - IMAX Laser',
    format: 'IMAX 3D',
    language: 'English',
    time: '07:00 PM',
    standardPrice: 15.00,
    premiumPrice: 22.00,
    status: 'available'
  });

  const fetchShows = async () => {
    const res = await showService.getAllShows();
    setShows(res.shows || []);
  };

  useEffect(() => {
    fetchShows();
  }, []);

  const handleOpenCreate = () => {
    setFormData({
      movieId: mockMovies[0]?.id || 'mov-001',
      theatreId: mockTheatres[0]?.id || 'th-101',
      screenName: 'Screen 1 - IMAX Laser',
      format: 'IMAX 3D',
      language: 'English',
      time: '07:00 PM',
      standardPrice: 15.00,
      premiumPrice: 22.00,
      status: 'available'
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await showService.createShow({
      ...formData,
      standardPrice: Number(formData.standardPrice),
      premiumPrice: Number(formData.premiumPrice)
    });
    toast.success('New show scheduled successfully!');
    setModalOpen(false);
    fetchShows();
  };

  const handleDeleteShow = async (id) => {
    await showService.deleteShow(id);
    toast.info('Showtime slot removed from schedules.');
    fetchShows();
  };

  const getMovieTitle = (id) => {
    const m = mockMovies.find((mov) => mov.id === id);
    return m ? m.title : 'Dune: Part Two';
  };

  const getTheatreName = (id) => {
    const th = mockTheatres.find((t) => t.id === id);
    return th ? th.name : 'IMovies Grand Cinema';
  };

  return (
    <div className="admin-shows-page">
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-extrabold text-white mb-1">Showtime Schedules & Pricing</h2>
          <p className="text-white-50 small mb-0">Associate movie titles to cinema screens, schedule dates, and configure seat prices.</p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-cinema d-flex align-items-center gap-2">
          <IconClock size={18} />
          Schedule New Show
        </button>
      </div>

      <div className="p-4 rounded-4 shadow" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
        <div className="table-responsive">
          <table className="table table-cinema mb-0">
            <thead>
              <tr>
                <th>Show Code</th>
                <th>Movie Title</th>
                <th>Theatre & Screen</th>
                <th>Show Time</th>
                <th>Format & Lang</th>
                <th>Standard Rate</th>
                <th>Premium Rate</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shows.map((show) => (
                <tr key={show.id}>
                  <td><span className="fw-mono text-danger fw-bold">{show.id}</span></td>
                  <td className="text-white fw-bold">{getMovieTitle(show.movieId)}</td>
                  <td>
                    <div className="text-white">{getTheatreName(show.theatreId)}</div>
                    <small className="text-white-50">{show.screenName}</small>
                  </td>
                  <td><span className="badge bg-dark border border-secondary text-white px-2 py-1">{show.time}</span></td>
                  <td>
                    <span className="badge bg-danger rounded-pill px-2 py-0 me-1">{show.format}</span>
                    <small className="text-white-50">{show.language}</small>
                  </td>
                  <td className="text-white">${Number(show.standardPrice).toFixed(2)}</td>
                  <td className="text-warning fw-semibold">${Number(show.premiumPrice).toFixed(2)}</td>
                  <td>
                    <span className={`badge ${show.status === 'available' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {show.status === 'available' ? 'Available' : 'Filling Fast'}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      type="button"
                      onClick={() => handleDeleteShow(show.id)}
                      className="btn btn-sm btn-outline-danger p-1"
                      title="Delete Showtime"
                    >
                      <IconTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1060 }}
        >
          <div
            className="cinema-modal rounded-4 shadow-2xl p-4 overflow-y-auto"
            style={{
              maxWidth: '600px',
              width: '100%',
              backgroundColor: 'var(--bg-modal)',
              border: '1px solid var(--border-strong)'
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom border-secondary border-opacity-25">
              <h5 className="fw-bold text-white mb-0">Schedule New Screening</h5>
              <button onClick={() => setModalOpen(false)} className="btn text-white-50 p-1">
                <IconX size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="mb-3">
                <label className="cinema-label">Select Movie Title:</label>
                <select
                  value={formData.movieId}
                  onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
                  className="cinema-select form-select"
                >
                  {mockMovies.map((m) => (
                    <option key={m.id} value={m.id}>{m.title} ({m.language})</option>
                  ))}
                </select>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-sm-6">
                  <label className="cinema-label">Select Theatre:</label>
                  <select
                    value={formData.theatreId}
                    onChange={(e) => setFormData({ ...formData, theatreId: e.target.value })}
                    className="cinema-select form-select"
                  >
                    {mockTheatres.map((th) => (
                      <option key={th.id} value={th.id}>{th.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-sm-6">
                  <label className="cinema-label">Screen Auditorium:</label>
                  <input
                    type="text"
                    value={formData.screenName}
                    onChange={(e) => setFormData({ ...formData, screenName: e.target.value })}
                    className="cinema-input form-control text-white"
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-sm-6">
                  <label className="cinema-label">Format (e.g. IMAX 3D, Dolby):</label>
                  <input
                    type="text"
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="cinema-input form-control text-white"
                    required
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="cinema-label">Start Showtime (e.g. 07:15 PM):</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="cinema-input form-control text-white"
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6">
                  <label className="cinema-label">Standard Ticket Price ($):</label>
                  <input
                    type="number"
                    step="0.50"
                    value={formData.standardPrice}
                    onChange={(e) => setFormData({ ...formData, standardPrice: parseFloat(e.target.value) })}
                    className="cinema-input form-control text-white"
                    required
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="cinema-label">Premium Recliner Price ($):</label>
                  <input
                    type="number"
                    step="0.50"
                    value={formData.premiumPrice}
                    onChange={(e) => setFormData({ ...formData, premiumPrice: parseFloat(e.target.value) })}
                    className="cinema-input form-control text-white"
                    required
                  />
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-end gap-2 pt-3 border-top border-secondary border-opacity-25">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-cinema-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-cinema btn-sm">
                  Add Showtime Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
