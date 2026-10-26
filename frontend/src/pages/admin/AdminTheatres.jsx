import { useState, useEffect } from 'react';
import { theatreService } from '../../services/theatreService';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { toast } from 'react-toastify';
import {
  IconBuilding,
  IconEdit,
  IconTrash,
  IconX
} from '../../components/common/Icons';

export const AdminTheatres = () => {
  const [theatres, setTheatres] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTheatre, setEditingTheatre] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    city: 'New York',
    location: '',
    address: '',
    screensCount: 6,
    amenities: 'IMAX, Dolby Atmos, Recliners',
    image: ''
  });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [theatreToDelete, setTheatreToDelete] = useState(null);

  const fetchTheatres = async () => {
    const res = await theatreService.getTheatres();
    setTheatres(res.theatres || []);
  };

  useEffect(() => {
    fetchTheatres();
  }, []);

  const handleOpenCreate = () => {
    setEditingTheatre(null);
    setFormData({
      name: '',
      city: 'New York',
      location: '',
      address: '',
      screensCount: 8,
      amenities: 'IMAX with Laser, Dolby Atmos, Luxury Recliners',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (th) => {
    setEditingTheatre(th);
    setFormData({
      name: th.name,
      city: th.city,
      location: th.location,
      address: th.address,
      screensCount: th.screensCount,
      amenities: Array.isArray(th.amenities) ? th.amenities.join(', ') : th.amenities,
      image: th.image
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      screensCount: Number(formData.screensCount),
      amenities: formData.amenities.split(',').map((s) => s.trim())
    };

    if (editingTheatre) {
      await theatreService.updateTheatre(editingTheatre.id, payload);
      toast.success(`Updated "${formData.name}" successfully!`);
    } else {
      await theatreService.createTheatre(payload);
      toast.success(`Created theatre "${formData.name}"!`);
    }

    setModalOpen(false);
    fetchTheatres();
  };

  const handleDelete = (th) => {
    setTheatreToDelete(th);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!theatreToDelete) return;
    await theatreService.deleteTheatre(theatreToDelete.id);
    toast.info(`Deleted theatre "${theatreToDelete.name}".`);
    setDeleteConfirmOpen(false);
    setTheatreToDelete(null);
    fetchTheatres();
  };

  return (
    <div className="admin-theatres-page">
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-extrabold text-white mb-1">Cinema Theatres & Venues</h2>
          <p className="text-white-50 small mb-0">Manage partner cinemas, address locations, and venue amenities.</p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-cinema d-flex align-items-center gap-2">
          <IconBuilding size={18} />
          Add New Theatre
        </button>
      </div>

      <div className="p-4 rounded-4 shadow" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
        <div className="table-responsive">
          <table className="table table-cinema mb-0">
            <thead>
              <tr>
                <th>Venue Image</th>
                <th>Theatre Name</th>
                <th>City & Location</th>
                <th>Address</th>
                <th>Screens</th>
                <th>Amenities</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {theatres.map((th) => (
                <tr key={th.id}>
                  <td>
                    <img
                      src={th.image}
                      alt={th.name}
                      className="rounded-2 object-fit-cover shadow-sm"
                      width="54"
                      height="38"
                    />
                  </td>
                  <td>
                    <span className="fw-bold text-white">{th.name}</span>
                  </td>
                  <td>
                    <span className="badge bg-danger rounded-pill px-2 py-0 me-1">{th.city}</span>
                    <span className="text-white-50 small">{th.location}</span>
                  </td>
                  <td className="text-white-50 small">{th.address}</td>
                  <td><span className="badge bg-dark border border-secondary text-white">{th.screensCount}</span></td>
                  <td>
                    <small className="text-white-50">
                      {Array.isArray(th.amenities) ? th.amenities.slice(0, 2).join(', ') : th.amenities}
                    </small>
                  </td>
                  <td><span className="badge bg-success">Active</span></td>
                  <td className="text-end">
                    <div className="d-inline-flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(th)}
                        className="btn btn-sm btn-outline-secondary text-white p-1"
                        title="Edit Theatre"
                      >
                        <IconEdit size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(th)}
                        className="btn btn-sm btn-outline-danger p-1"
                        title="Delete Theatre"
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
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
              <h5 className="fw-bold text-white mb-0">
                {editingTheatre ? `Edit Theatre: ${editingTheatre.name}` : 'Register New Cinema Theatre'}
              </h5>
              <button onClick={() => setModalOpen(false)} className="btn text-white-50 p-1">
                <IconX size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="mb-3">
                <label className="cinema-label">Theatre Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. IMovies Cinema City"
                  className="cinema-input form-control text-white"
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="cinema-label">City:</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="cinema-input form-control text-white"
                    required
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="cinema-label">Number of Screens:</label>
                  <input
                    type="number"
                    value={formData.screensCount}
                    onChange={(e) => setFormData({ ...formData, screensCount: Number(e.target.value) })}
                    className="cinema-input form-control text-white"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="cinema-label">Location / Neighborhood:</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Times Square, 42nd St"
                  className="cinema-input form-control text-white"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="cinema-label">Full Physical Address:</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address, Zip code"
                  className="cinema-input form-control text-white"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="cinema-label">Amenities (comma separated):</label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="IMAX, Dolby Atmos, Dine-in"
                  className="cinema-input form-control text-white"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="cinema-label">Venue Image URL:</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="cinema-input form-control text-white"
                  required
                />
              </div>

              <div className="d-flex align-items-center justify-content-end gap-2 pt-3 border-top border-secondary border-opacity-25">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-cinema-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-cinema btn-sm">
                  {editingTheatre ? 'Save Changes' : 'Create Theatre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Theatre Venue"
        message={`Are you sure you want to delete "${theatreToDelete?.name}"? All associated screen schedules will be revoked.`}
        confirmLabel="Yes, Delete Theatre"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setTheatreToDelete(null);
        }}
      />
    </div>
  );
};
