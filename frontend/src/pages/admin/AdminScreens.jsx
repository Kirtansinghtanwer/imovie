import React, { useState } from 'react';
import { mockTheatres } from '../../data/mockTheatres';
import { toast } from 'react-toastify';
import {
  IconTv,
  IconEdit,
  IconTrash,
  IconX
} from '../../components/common/Icons';

export const AdminScreens = () => {
  const [screens, setScreens] = useState([
    { id: 'scr-101', theatreId: 'th-101', theatreName: 'IMovies Grand Cinema', name: 'Screen 1 - IMAX Laser', capacity: 108, rows: 'A - J', technology: 'IMAX 3D Laser', sound: '12-Channel Immersive' },
    { id: 'scr-102', theatreId: 'th-101', theatreName: 'IMovies Grand Cinema', name: 'Screen 2 - Dolby Atmos', capacity: 96, rows: 'A - H', technology: 'Dolby Vision 4K', sound: 'Dolby Atmos 64-Ch' },
    { id: 'scr-103', theatreId: 'th-101', theatreName: 'IMovies Grand Cinema', name: 'Screen 3 - Prime 4K', capacity: 84, rows: 'A - G', technology: 'Barco Laser 4K', sound: 'Dolby 7.1' },
    { id: 'scr-104', theatreId: 'th-102', theatreName: 'IMovies Starplex & IMAX', name: 'Screen 4 - 70mm Auditorium', capacity: 120, rows: 'A - K', technology: 'IMAX 15/70mm Film', sound: 'Dolby Atmos' },
    { id: 'scr-105', theatreId: 'th-103', theatreName: 'IMovies CineDine Hollywood', name: 'Screen 1 - ScreenX 270°', capacity: 88, rows: 'A - H', technology: 'ScreenX Multi-Projection', sound: 'Dolby Atmos' }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingScreen, setEditingScreen] = useState(null);
  const [formData, setFormData] = useState({
    theatreId: 'th-101',
    name: '',
    capacity: 96,
    rows: 'A - H',
    technology: 'IMAX 3D Laser',
    sound: 'Dolby Atmos'
  });

  const handleOpenCreate = () => {
    setEditingScreen(null);
    setFormData({
      theatreId: 'th-101',
      name: '',
      capacity: 96,
      rows: 'A - H',
      technology: 'IMAX 3D Laser',
      sound: 'Dolby Atmos'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (scr) => {
    setEditingScreen(scr);
    setFormData({
      theatreId: scr.theatreId,
      name: scr.name,
      capacity: scr.capacity,
      rows: scr.rows,
      technology: scr.technology,
      sound: scr.sound
    });
    setModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const th = mockTheatres.find((t) => t.id === formData.theatreId);
    const theatreName = th ? th.name : 'IMovies Grand Cinema';

    if (editingScreen) {
      setScreens(screens.map((s) => s.id === editingScreen.id ? { ...s, ...formData, theatreName } : s));
      toast.success(`Updated screen "${formData.name}".`);
    } else {
      const newScreen = {
        id: `scr-${Date.now().toString().slice(-3)}`,
        ...formData,
        theatreName
      };
      setScreens([newScreen, ...screens]);
      toast.success(`Created screen "${formData.name}".`);
    }
    setModalOpen(false);
  };

  const handleDelete = (scrId) => {
    setScreens(screens.filter((s) => s.id !== scrId));
    toast.info('Screen removed from auditorium configuration.');
  };

  return (
    <div className="admin-screens-page">
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-extrabold text-white mb-1">Auditorium Screens & Layouts</h2>
          <p className="text-white-50 small mb-0">Configure auditorium screen capacities, projection formats, and seating layouts.</p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-cinema d-flex align-items-center gap-2">
          <IconTv size={18} />
          Add Auditorium Screen
        </button>
      </div>

      <div className="p-4 rounded-4 shadow" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
        <div className="table-responsive">
          <table className="table table-cinema mb-0">
            <thead>
              <tr>
                <th>Screen Identifier</th>
                <th>Assigned Theatre</th>
                <th>Capacity</th>
                <th>Row Range</th>
                <th>Projection Type</th>
                <th>Sound System</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {screens.map((scr) => (
                <tr key={scr.id}>
                  <td>
                    <div className="fw-bold text-white d-flex align-items-center gap-2">
                      <IconTv size={16} className="text-danger" />
                      {scr.name}
                    </div>
                    <small className="text-white-50 font-monospace">{scr.id}</small>
                  </td>
                  <td className="text-white">{scr.theatreName}</td>
                  <td>
                    <span className="badge bg-danger rounded-pill px-2 py-1">
                      {scr.capacity} Seats
                    </span>
                  </td>
                  <td className="text-white-50">{scr.rows}</td>
                  <td><span className="badge bg-dark border border-secondary text-white">{scr.technology}</span></td>
                  <td className="text-white-50 small">{scr.sound}</td>
                  <td className="text-end">
                    <div className="d-inline-flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(scr)}
                        className="btn btn-sm btn-outline-secondary text-white p-1"
                        title="Edit Screen"
                      >
                        <IconEdit size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(scr.id)}
                        className="btn btn-sm btn-outline-danger p-1"
                        title="Delete Screen"
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
              maxWidth: '560px',
              width: '100%',
              backgroundColor: 'var(--bg-modal)',
              border: '1px solid var(--border-strong)'
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom border-secondary border-opacity-25">
              <h5 className="fw-bold text-white mb-0">
                {editingScreen ? `Edit: ${editingScreen.name}` : 'Configure New Screen'}
              </h5>
              <button onClick={() => setModalOpen(false)} className="btn text-white-50 p-1">
                <IconX size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="mb-3">
                <label className="cinema-label">Assigned Cinema Theatre:</label>
                <select
                  value={formData.theatreId}
                  onChange={(e) => setFormData({ ...formData, theatreId: e.target.value })}
                  className="cinema-select form-select"
                >
                  {mockTheatres.map((th) => (
                    <option key={th.id} value={th.id}>{th.name} ({th.city})</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="cinema-label">Screen Name / Number:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Screen 1 - IMAX Laser"
                  className="cinema-input form-control text-white"
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-sm-6">
                  <label className="cinema-label">Total Seating Capacity:</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="cinema-input form-control text-white"
                    required
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="cinema-label">Row Range (Labels):</label>
                  <input
                    type="text"
                    value={formData.rows}
                    onChange={(e) => setFormData({ ...formData, rows: e.target.value })}
                    placeholder="e.g. A - J"
                    className="cinema-input form-control text-white"
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6">
                  <label className="cinema-label">Projection Tech:</label>
                  <input
                    type="text"
                    value={formData.technology}
                    onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
                    placeholder="e.g. IMAX Laser 4K"
                    className="cinema-input form-control text-white"
                    required
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="cinema-label">Audio System:</label>
                  <input
                    type="text"
                    value={formData.sound}
                    onChange={(e) => setFormData({ ...formData, sound: e.target.value })}
                    placeholder="e.g. Dolby Atmos"
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
                  {editingScreen ? 'Update Screen' : 'Save Screen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
