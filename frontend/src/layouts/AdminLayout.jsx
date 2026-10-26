import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminNavbar } from '../components/admin/AdminNavbar';
import { DemoBanner } from '../components/common/DemoBanner';
import { useAuth } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AdminLayout = () => {
  const { user, isAdmin, loading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark text-white">
        <div className="spinner-border text-danger" role="status" />
      </div>
    );
  }

  // Frontend route guard: if not admin, redirect to friendly unauthorized page
  if (!user || !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <DemoBanner />
      <div className="d-flex flex-grow-1">
        <AdminSidebar
          mobileOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />
        <div className="d-flex flex-column flex-grow-1 overflow-x-hidden">
          <AdminNavbar onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
          <main className="p-3 p-md-4 flex-grow-1">
            <Outlet />
          </main>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        theme="dark"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};
