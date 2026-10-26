import { Link } from 'react-router-dom';
import { IconFilm, IconShield } from './Icons';

export const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }} className="pt-5 pb-4 mt-auto">
      <div className="container-fluid px-3 px-lg-5">
        <div className="row g-4 justify-content-between mb-5">
          {/* Brand & mission */}
          <div className="col-lg-4 col-md-6">
            <Link to="/" className="d-flex align-items-center gap-2 mb-3 text-decoration-none">
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{
                  width: '36px',
                  height: '36px',
                  background: 'linear-gradient(135deg, #FF2E3B 0%, #E50914 100%)',
                  color: '#ffffff'
                }}
              >
                <IconFilm size={20} />
              </div>
              <span className="fw-bold fs-4">
                <span style={{ color: '#ffffff' }}>I</span>
                <span style={{ color: 'var(--accent-primary)' }}>Movies</span>
              </span>
            </Link>
            <p className="text-white-50 small pe-lg-4 mb-4" style={{ lineHeight: 1.7 }}>
              IMovies delivers the ultimate cinema discovery and ticket booking experience. Find showtimes, book premium recliner seats, explore IMAX auditoriums, and immerse yourself in the magic of storytelling.
            </p>
            <div className="d-flex align-items-center gap-3">
              <span className="badge bg-dark border border-secondary text-white-50 p-2 d-inline-flex align-items-center gap-2">
                <IconShield size={14} className="text-danger" />
                MERN Ready & REST Compliant
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="text-white fw-bold text-uppercase mb-3" style={{ fontSize: '0.8rem', letterSpacing: '0.08em' }}>
              Explore
            </h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/movies" className="text-white-50 hover-text-white">Now Showing</Link></li>
              <li><Link to="/movies?status=coming_soon" className="text-white-50 hover-text-white">Coming Soon</Link></li>
              <li><Link to="/theatres" className="text-white-50 hover-text-white">Cinemas & Theatres</Link></li>
              <li><Link to="/movies?genre=Sci-Fi" className="text-white-50 hover-text-white">Sci-Fi Blockbusters</Link></li>
              <li><Link to="/movies?genre=Action" className="text-white-50 hover-text-white">Action & Adventure</Link></li>
            </ul>
          </div>

          {/* Account & Bookings */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="text-white fw-bold text-uppercase mb-3" style={{ fontSize: '0.8rem', letterSpacing: '0.08em' }}>
              Account & Help
            </h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/my-bookings" className="text-white-50 hover-text-white">My Bookings</Link></li>
              <li><Link to="/favorites" className="text-white-50 hover-text-white">Saved Favorites</Link></li>
              <li><Link to="/profile" className="text-white-50 hover-text-white">Account Profile</Link></li>
              <li><a href="#help" onClick={(e) => { e.preventDefault(); alert("IMovies Help Desk: Contact support@imovies.com for 24/7 assistance."); }} className="text-white-50 hover-text-white">Help & Support</a></li>
              <li><a href="#faq" onClick={(e) => { e.preventDefault(); alert("IMovies FAQ: Tickets can be cancelled up to 2 hours before showtime."); }} className="text-white-50 hover-text-white">Cancellation FAQ</a></li>
            </ul>
          </div>

          {/* Cinema Technologies & Formats */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold text-uppercase mb-3" style={{ fontSize: '0.8rem', letterSpacing: '0.08em' }}>
              Formats & Audio
            </h6>
            <div className="d-flex flex-wrap gap-2 mb-3">
              <span className="badge bg-dark border border-secondary text-white-50 px-2 py-1">IMAX with Laser</span>
              <span className="badge bg-dark border border-secondary text-white-50 px-2 py-1">Dolby Atmos</span>
              <span className="badge bg-dark border border-secondary text-white-50 px-2 py-1">4DX Motion</span>
              <span className="badge bg-dark border border-secondary text-white-50 px-2 py-1">ScreenX 270°</span>
              <span className="badge bg-dark border border-secondary text-white-50 px-2 py-1">VIP Recliners</span>
            </div>
            <p className="text-white-50 small mb-0">
              Designed with dark cinema aesthetics. Ready for Express backend & MongoDB.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-top border-secondary border-opacity-25 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 text-white-50 small">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} IMovies Cinema Network. All rights reserved. Built with React & Vite.
          </p>
          <div className="d-flex align-items-center gap-4">
            <a href="#terms" onClick={(e) => { e.preventDefault(); alert("IMovies Terms: Tickets are subject to theatre venue guidelines."); }} className="text-white-50 hover-text-white">Terms of Service</a>
            <a href="#privacy" onClick={(e) => { e.preventDefault(); alert("IMovies Privacy: We respect your privacy and never store sensitive financial data in the browser."); }} className="text-white-50 hover-text-white">Privacy Policy</a>
            <a href="#security" onClick={(e) => { e.preventDefault(); alert("IMovies Security: Protected by enterprise TLS and mock sandbox standards."); }} className="text-white-50 hover-text-white">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
