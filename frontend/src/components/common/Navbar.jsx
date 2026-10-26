import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import {
  IconFilm,
  IconTicket,
  IconHeart,
  IconSearch,
  IconUser,
  IconShield,
  IconLogOut,
  IconMenu,
  IconX
} from './Icons';

export const Navbar = () => {
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const { favoriteCount } = useFavorites();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={{ backgroundColor: 'rgba(11, 11, 15, 0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-subtle)', zIndex: 1020 }}>
      <div className="container-fluid px-3 px-lg-5">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2" onClick={closeMenus}>
          <div
            className="d-flex align-items-center justify-content-center rounded-3 shadow"
            style={{
              width: '38px',
              height: '38px',
              background: 'linear-gradient(135deg, #FF2E3B 0%, #E50914 100%)',
              color: '#ffffff'
            }}
          >
            <IconFilm size={22} />
          </div>
          <span className="fw-bold fs-4 tracking-tight" style={{ letterSpacing: '-0.5px' }}>
            <span style={{ color: '#ffffff' }}>I</span>
            <span style={{ color: 'var(--accent-primary)' }}>Movies</span>
          </span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 text-white p-1 d-lg-none"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <IconX size={26} /> : <IconMenu size={26} />}
        </button>

        {/* Desktop & Collapsible Nav Links */}
        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show mt-3 mt-lg-0' : ''}`}>
          {/* Main Navigation Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-1">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) => `nav-link px-3 py-2 fw-medium ${isActive ? 'text-white border-bottom border-danger border-2' : 'text-white-50'}`}
                onClick={closeMenus}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/movies"
                className={({ isActive }) => `nav-link px-3 py-2 fw-medium ${isActive ? 'text-white border-bottom border-danger border-2' : 'text-white-50'}`}
                onClick={closeMenus}
              >
                Movies
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/theatres"
                className={({ isActive }) => `nav-link px-3 py-2 fw-medium ${isActive ? 'text-white border-bottom border-danger border-2' : 'text-white-50'}`}
                onClick={closeMenus}
              >
                Theatres
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/my-bookings"
                className={({ isActive }) => `nav-link px-3 py-2 fw-medium ${isActive ? 'text-white border-bottom border-danger border-2' : 'text-white-50'}`}
                onClick={closeMenus}
              >
                <span className="d-flex align-items-center gap-1">
                  <IconTicket size={16} />
                  My Bookings
                </span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/favorites"
                className={({ isActive }) => `nav-link px-3 py-2 fw-medium ${isActive ? 'text-white border-bottom border-danger border-2' : 'text-white-50'}`}
                onClick={closeMenus}
              >
                <span className="d-flex align-items-center gap-1">
                  <IconHeart size={16} filled={favoriteCount > 0} color="var(--accent-primary)" />
                  Favorites
                  {favoriteCount > 0 && (
                    <span className="badge rounded-pill bg-danger ms-1" style={{ fontSize: '0.65rem' }}>
                      {favoriteCount}
                    </span>
                  )}
                </span>
              </NavLink>
            </li>

            {isAdmin && (
              <li className="nav-item">
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `nav-link px-3 py-2 fw-bold text-danger ${isActive ? 'border-bottom border-danger border-2' : ''}`}
                  onClick={closeMenus}
                >
                  <span className="d-flex align-items-center gap-1">
                    <IconShield size={16} />
                    Admin Panel
                  </span>
                </NavLink>
              </li>
            )}
          </ul>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="d-flex align-items-center position-relative me-lg-3 mb-3 mb-lg-0" style={{ maxWidth: '280px', width: '100%' }}>
            <input
              type="search"
              placeholder="Search movies, genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="cinema-input form-control form-control-sm ps-4 pe-3 text-white"
              style={{ fontSize: '0.875rem' }}
            />
            <div className="position-absolute start-0 ms-2 text-white-50 pointer-events-none d-flex align-items-center">
              <IconSearch size={15} />
            </div>
          </form>

          {/* User Auth Section */}
          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <div className="dropdown position-relative">
                <button
                  type="button"
                  className="btn d-flex align-items-center gap-2 text-white p-1 rounded-pill"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid var(--border-subtle)' }}
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                    alt={user?.name}
                    className="rounded-circle object-fit-cover"
                    width="32"
                    height="32"
                  />
                  <span className="d-none d-sm-inline fw-medium pe-2 text-truncate" style={{ maxWidth: '120px', fontSize: '0.875rem' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div
                    className="dropdown-menu dropdown-menu-end show position-absolute end-0 mt-2 p-2 shadow-lg"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-strong)',
                      minWidth: '220px',
                      borderRadius: 'var(--radius-md)',
                      zIndex: 1050
                    }}
                  >
                    <div className="px-3 py-2 border-bottom border-secondary border-opacity-25 mb-1">
                      <p className="fw-bold mb-0 text-white">{user?.name}</p>
                      <small className="text-white-50">{user?.email}</small>
                      <div className="mt-1">
                        <span className={`badge ${isAdmin ? 'bg-danger' : 'bg-secondary'}`} style={{ fontSize: '0.7rem' }}>
                          {isAdmin ? 'Cinema Administrator' : 'Moviegoer'}
                        </span>
                      </div>
                    </div>

                    <Link to="/profile" className="dropdown-item text-white-50 py-2 d-flex align-items-center gap-2 rounded hover-bg-secondary" onClick={closeMenus}>
                      <IconUser size={16} />
                      My Profile
                    </Link>
                    <Link to="/my-bookings" className="dropdown-item text-white-50 py-2 d-flex align-items-center gap-2 rounded hover-bg-secondary" onClick={closeMenus}>
                      <IconTicket size={16} />
                      My Bookings
                    </Link>
                    <Link to="/favorites" className="dropdown-item text-white-50 py-2 d-flex align-items-center gap-2 rounded hover-bg-secondary" onClick={closeMenus}>
                      <IconHeart size={16} />
                      Favorites
                    </Link>

                    {isAdmin && (
                      <Link to="/admin" className="dropdown-item text-danger py-2 d-flex align-items-center gap-2 rounded hover-bg-secondary fw-semibold" onClick={closeMenus}>
                        <IconShield size={16} />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="dropdown-divider border-secondary border-opacity-25 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        closeMenus();
                      }}
                      className="dropdown-item text-danger py-2 d-flex align-items-center gap-2 rounded hover-bg-secondary"
                    >
                      <IconLogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-cinema-secondary btn-sm" onClick={closeMenus}>
                  Log In
                </Link>
                <Link to="/register" className="btn btn-cinema btn-sm" onClick={closeMenus}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
