import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import { IconSearch } from '../../components/common/Icons';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    const res = await adminService.getUsers();
    setUsers(res.users || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId) => {
    const res = await adminService.toggleUserStatus(userId);
    if (res.success) {
      toast.info(`Updated user status to ${res.user.status}.`);
      fetchUsers();
    }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-users-page">
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-extrabold text-white mb-1">User & Role Management</h2>
          <p className="text-white-50 small mb-0">View registered moviegoers, administrators, and manage account statuses.</p>
        </div>

        <span className="badge bg-danger rounded-pill px-3 py-2">
          {filtered.length} Registered Accounts
        </span>
      </div>

      <div className="p-3 rounded-4 mb-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
        <div className="position-relative" style={{ maxWidth: '360px' }}>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="cinema-input form-control text-white ps-5"
          />
          <div className="position-absolute top-50 start-0 translate-middle-y ms-3 text-white-50 pointer-events-none d-flex align-items-center">
            <IconSearch size={16} />
          </div>
        </div>
      </div>

      <div className="p-4 rounded-4 shadow" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
        <div className="table-responsive">
          <table className="table table-cinema mb-0">
            <thead>
              <tr>
                <th>User Profile</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Member Since</th>
                <th>System Role</th>
                <th>Account Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="rounded-circle object-fit-cover shadow-sm"
                        width="34"
                        height="34"
                      />
                      <span className="fw-bold text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="text-white-50">{u.email}</td>
                  <td className="text-white-50 small">{u.phone || 'N/A'}</td>
                  <td className="text-white-50 small">{u.memberSince || '2024'}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                      {u.role === 'admin' ? 'Administrator' : 'Customer'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(u.id)}
                      className={`btn btn-sm ${u.status === 'active' ? 'btn-outline-warning' : 'btn-outline-success'} py-1 px-2`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      {u.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
