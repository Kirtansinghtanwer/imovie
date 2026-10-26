import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  IconFilm,
  IconDashboard,
  IconBuilding,
  IconTv,
  IconClock,
  IconTicket,
  IconUsers,
  IconMessageSquare,
  IconBarChart,
  IconChevronLeft
} from '../common/Icons';

export const AdminSidebar = ({ mobileOpen, onClose }) => {
  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: IconDashboard, end: true },
    { to: '/admin/movies', label: 'Movies', icon: IconFilm },
    { to: '/admin/theatres', label: 'Theatres', icon: IconBuilding },
    { to: '/admin/screens', label: 'Screens', icon: IconTv },
    { to: '/admin/shows', label: 'Shows Schedule', icon: IconClock },
    { to: '/admin/bookings', label: 'Bookings', icon: IconTicket },
    { to: '/admin/users', label: 'Users', icon: IconUsers },
    { to: '/admin/reviews', label: 'Reviews', icon: IconMessageSquare },
    { to: '/admin/reports', label: 'Analytics & Reports', icon: IconBarChart }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="position-fixed inset-0 w-100 h-100 bg-black bg-opacity-75 d-lg-none"
          style={{ zIndex: 1040 }}
          onClick={onClose}
        />
      )}

      <aside
        className={`admin-sidebar d-flex flex-column ${mobileOpen ? 'position-fixed start-0 top-0 bottom-0 z-3' : 'd-none d-lg-flex'}`}
        style={{
          width: '260px',
          minWidth: '260px',
          backgroundColor: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-subtle)',
          zIndex: 1045
        }}
      >
        {/* Admin Header */}
        <div className="p-3 px-4 border-bottom border-secondary border-opacity-25 d-flex align-items-center justify-content-between">
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <div
              className="d-flex align-items-center justify-content-center rounded-3"
              style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #FF2E3B 0%, #E50914 100%)',
                color: '#ffffff'
              }}
            >
              <IconFilm size={18} />
            </div>
            <span className="fw-bold fs-5 text-white">
              IMovies <span className="badge bg-danger ms-1" style={{ fontSize: '0.65rem' }}>Admin</span>
            </span>
          </Link>
        </div>

        {/* Navigation list */}
        <div className="py-3 flex-grow-1 overflow-y-auto">
          <div className="px-3 pb-2 text-white-50 text-uppercase fw-semibold" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            Management
          </div>
          <nav className="nav flex-column">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Back to Public Cinema link */}
        <div className="p-3 border-top border-secondary border-opacity-25 mt-auto">
          <Link to="/" className="btn btn-cinema-secondary w-100 btn-sm d-flex align-items-center justify-content-center gap-2">
            <IconChevronLeft size={16} />
            Return to Cinema
          </Link>
        </div>
      </aside>
    </>
  );
};
