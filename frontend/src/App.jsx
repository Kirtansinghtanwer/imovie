import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public & User Pages
import { Home } from './pages/Home';
import { Movies } from './pages/Movies';
import { MovieDetails } from './pages/MovieDetails';
import { ShowSelection } from './pages/ShowSelection';
import { SeatSelection } from './pages/SeatSelection';
import { Checkout } from './pages/Checkout';
import { BookingConfirmation } from './pages/BookingConfirmation';
import { Theatres } from './pages/Theatres';
import { Favorites } from './pages/Favorites';
import { MyBookings } from './pages/MyBookings';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Unauthorized } from './pages/Unauthorized';
import { NotFound } from './pages/NotFound';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminMovies } from './pages/admin/AdminMovies';
import { AdminTheatres } from './pages/admin/AdminTheatres';
import { AdminScreens } from './pages/admin/AdminScreens';
import { AdminShows } from './pages/admin/AdminShows';
import { AdminBookings } from './pages/admin/AdminBookings';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminReports } from './pages/admin/AdminReports';

// Guards
import { ProtectedRoute } from './components/common/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <Routes>
            {/* Public and Authenticated User Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movies/:movieId" element={<MovieDetails />} />
              <Route path="/movies/:movieId/shows" element={<ShowSelection />} />
              <Route path="/shows/:showId/seats" element={<SeatSelection />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />
              <Route path="/theatres" element={<Theatres />} />
              <Route path="/favorites" element={<Favorites />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected User Pages */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />

              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin Management Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="movies" element={<AdminMovies />} />
              <Route path="theatres" element={<AdminTheatres />} />
              <Route path="screens" element={<AdminScreens />} />
              <Route path="shows" element={<AdminShows />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="reports" element={<AdminReports />} />
            </Route>
          </Routes>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
