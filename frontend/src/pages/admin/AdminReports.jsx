import React, { useState } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import {
  IconDownload,
  IconCalendar,
  IconTrending,
  IconFilm,
  IconBuilding
} from '../../components/common/Icons';

export const AdminReports = () => {
  const [dateRange, setDateRange] = useState('last_30_days');

  const handleExport = (format) => {
    try {
      const result = adminService.exportReport(format, {
        dateRange,
        generatedAt: new Date().toISOString(),
        summary: {
          totalRevenue: 28450.00,
          totalBookings: 184,
          occupancyRate: '78.4%'
        }
      });
      toast.success(`Exported analytics report as ${result.filename}!`);
    } catch {
      toast.error('Failed to generate export file.');
    }
  };

  return (
    <div className="admin-reports-page">
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-extrabold text-white mb-1">Cinema Reports & Financial Analytics</h2>
          <p className="text-white-50 small mb-0">Track box office gross revenue, theatre attendance, and occupancy distribution.</p>
        </div>

        {/* Export Controls */}
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            onClick={() => handleExport('csv')}
            className="btn btn-cinema-secondary btn-sm d-flex align-items-center gap-1"
          >
            <IconDownload size={14} />
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => handleExport('json')}
            className="btn btn-cinema btn-sm d-flex align-items-center gap-1"
          >
            <IconDownload size={14} />
            Export JSON
          </button>
        </div>
      </div>

      {/* Filter range bar */}
      <div className="p-3 rounded-4 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
        <div className="d-flex align-items-center gap-2">
          <IconCalendar size={16} className="text-danger" />
          <span className="text-white-50 small">Date Range:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="cinema-select form-select form-select-sm"
          >
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days (Current Month)</option>
            <option value="last_90_days">Last Quarter (90 Days)</option>
            <option value="year_to_date">Year-to-Date 2026</option>
          </select>
        </div>

        <span className="text-white-50 small">
          Showing calculated metrics from demo sandbox dataset
        </span>
      </div>

      {/* Top Movies & Theatre Performance */}
      <div className="row g-4 mb-4">
        {/* Popular Movies Table */}
        <div className="col-12 col-lg-6">
          <div className="p-4 rounded-4 shadow h-100" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
            <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
              <IconFilm size={18} className="text-danger" />
              Top Grossing Movies
            </h5>
            <div className="table-responsive">
              <table className="table table-cinema mb-0">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Tickets</th>
                    <th>Gross Sales</th>
                    <th>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { title: 'Dune: Part Two', tickets: 74, gross: 11470, share: '40%' },
                    { title: 'Oppenheimer', tickets: 52, gross: 8320, share: '29%' },
                    { title: 'Spider-Man: Across Spider-Verse', tickets: 34, gross: 4930, share: '17%' },
                    { title: 'Kalki 2898 AD', tickets: 24, gross: 3730, share: '14%' }
                  ].map((item, idx) => (
                    <tr key={idx}>
                      <td className="fw-bold text-white">{item.title}</td>
                      <td className="text-white-50">{item.tickets} sold</td>
                      <td className="text-danger fw-bold">${item.gross.toLocaleString()}</td>
                      <td>
                        <span className="badge bg-dark border border-secondary text-white">{item.share}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Theatre Performance */}
        <div className="col-12 col-lg-6">
          <div className="p-4 rounded-4 shadow h-100" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
            <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
              <IconBuilding size={18} className="text-danger" />
              Venue Attendance Performance
            </h5>
            <div className="table-responsive">
              <table className="table table-cinema mb-0">
                <thead>
                  <tr>
                    <th>Cinema Venue</th>
                    <th>City</th>
                    <th>Occupancy</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'IMovies Grand Cinema', city: 'New York', occupancy: '84%', rev: '$12,400' },
                    { name: 'IMovies Starplex & IMAX', city: 'New York', occupancy: '79%', rev: '$8,150' },
                    { name: 'IMovies CineDine Hollywood', city: 'Los Angeles', occupancy: '82%', rev: '$5,200' },
                    { name: 'IMovies Millennium Centre', city: 'Chicago', occupancy: '71%', rev: '$2,700' }
                  ].map((th, idx) => (
                    <tr key={idx}>
                      <td className="fw-bold text-white">{th.name}</td>
                      <td><span className="badge bg-danger rounded-pill px-2 py-0">{th.city}</span></td>
                      <td className="text-success fw-semibold">{th.occupancy}</td>
                      <td className="text-white fw-bold">{th.rev}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Status Distribution */}
      <div className="p-4 rounded-4 shadow" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
        <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
          <IconTrending size={18} className="text-danger" />
          Status Distribution & Operational Health
        </h5>
        <div className="row g-3 text-center">
          <div className="col-12 col-sm-4">
            <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25">
              <span className="text-success fw-bold fs-4 d-block">92.4%</span>
              <span className="text-white-50 small">Confirmed Fulfillment Rate</span>
            </div>
          </div>
          <div className="col-12 col-sm-4">
            <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25">
              <span className="text-warning fw-bold fs-4 d-block">4.8%</span>
              <span className="text-white-50 small">User-Initiated Cancellation Rate</span>
            </div>
          </div>
          <div className="col-12 col-sm-4">
            <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25">
              <span className="text-info fw-bold fs-4 d-block">0.00%</span>
              <span className="text-white-50 small">Payment Gateway Error Ratio</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
