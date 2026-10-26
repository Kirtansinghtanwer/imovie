# IMovies — Cinema Ticket Booking Platform (Frontend)

IMovies is a modern, responsive online cinema discovery and ticket booking web application built using React and Vite. It features a dark cinematic theme, realistic mock data, interactive frontend flows, and full preparation for Express.js and MongoDB REST API backend integration.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create or edit `.env` in the frontend root:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🎭 Roles & Authentication
The application supports two user roles:
1. **User / Moviegoer**: Discover movies, filter showtimes, book seats, view tickets, manage favorites, write reviews.
2. **Admin**: Manage movies, theatres, screens, shows, view bookings, toggle user statuses, moderate reviews, and export financial reports.

### Quick Demo Switcher
A persistent **DEMO MODE** bar is placed at the top of the application with one-click toggles:
- **Switch to Customer** (`alex@imovies.com` / `password123`)
- **Switch to Admin** (`admin@imovies.com` / `admin123`)

---

## 🎬 Application Routes & Features

### Public & User Routes
| Route | Page | Description |
|---|---|---|
| `/` | `Home.jsx` | Cinematic hero premiere, trailer modal, Now Showing, Coming Soon, Genre pills, Theatres |
| `/movies` | `Movies.jsx` | Catalogue search, genre/language/status filters, sorting (rating, popularity, date), pagination |
| `/movies/:movieId` | `MovieDetails.jsx` | Backdrop hero, poster, synopsis, formats, cast list, trailer modal, reviews & star rating form |
| `/movies/:movieId/shows` | `ShowSelection.jsx` | City selector, 7-day date selector, theatres list with amenities, showtimes |
| `/shows/:showId/seats` | `SeatSelection.jsx` | Curved cinema screen, interactive Rows A-J, live price computation, max seat limits |
| `/checkout` | `Checkout.jsx` | Order breakdown, coupon codes (`IMOVIES5`), demo payment methods, policy terms |
| `/booking-confirmation/:bookingId` | `BookingConfirmation.jsx` | Confirmed e-ticket stub, SVG QR code simulator, print/download action |
| `/theatres` | `Theatres.jsx` | City filter, partner cinema venues, screen capacities, venue amenities |
| `/favorites` | `Favorites.jsx` | Saved movie watchlist, instant removal, direct ticket booking |
| `/my-bookings` | `MyBookings.jsx` | Upcoming, Completed, and Cancelled bookings with confirmation modal |
| `/profile` | `Profile.jsx` | Personal info, cinema preferences, and password change |
| `/login` | `Login.jsx` | 1-Click demo logins, password toggle, client-side validation |
| `/register` | `Register.jsx` | Account registration with form validation |
| `/forgot-password` | `ForgotPassword.jsx` | Password reset request simulation |
| `/unauthorized` | `Unauthorized.jsx` | Friendly 403 access control page with 1-click role switch |
| `*` | `NotFound.jsx` | Cinema-themed 404 page |

### Admin Management Routes (`/admin`)
| Route | Page | Description |
|---|---|---|
| `/admin` | `AdminDashboard.jsx` | KPI summary metrics, monthly revenue trend bar chart, recent bookings |
| `/admin/movies` | `AdminMovies.jsx` | Movie catalogue table, Add Movie modal, Edit Movie modal, Delete confirmation |
| `/admin/theatres` | `AdminTheatres.jsx` | Theatre venue management, location, amenities, screens |
| `/admin/screens` | `AdminScreens.jsx` | Auditorium screens, row ranges, seating capacity, projection types |
| `/admin/shows` | `AdminShows.jsx` | Showtime scheduling connecting movies to theatres and setting prices |
| `/admin/bookings` | `AdminBookings.jsx` | Searchable booking registry with inspection details modal |
| `/admin/users` | `AdminUsers.jsx` | User management with active/inactive status toggles |
| `/admin/reviews` | `AdminReviews.jsx` | Review moderation and deletion |
| `/admin/reports` | `AdminReports.jsx` | Top grossing movies, venue occupancy, working CSV and JSON exports |

---

## 🛠️ Architecture & Backend Integration Contract
- **Centralized Axios Client**: `src/services/api.js` automatically includes JWT bearer tokens from localStorage and handles 401s.
- **Service Layer**: All data calls (`authService`, `movieService`, `theatreService`, `showService`, `bookingService`, `paymentService`, `reviewService`, `adminService`) attempt backend API communication first, with clean fallback to mock storage when the Express server is not yet running.
- **Zero Sensitive Data In Browser**: No credit card details or payment secrets are stored in localStorage.
- **Pure Frontend Implementation**: Preserves existing backend architecture without third-party hosted dependencies (no Supabase/Firebase).
