import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiGrid, FiBookOpen, FiCode, FiMessageSquare, FiSettings, FiLogOut, FiMenu, FiX, FiLayout, FiFileText, FiImage, FiFile, FiHeart, FiAward, FiBook } from 'react-icons/fi';
import { useState } from 'react';

const AdminLayout = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated && location.pathname !== '/admin/login') {
    return <Navigate to="/admin/login" />;
  }

  if (location.pathname === '/admin/login') {
    return <Outlet />;
  }

  const navItems = [
    { path: '/admin', icon: <FiGrid />, label: 'Dashboard' },
    { path: '/admin/templates', icon: <FiLayout />, label: 'Home Templates' },
    { path: '/admin/pages', icon: <FiFileText />, label: 'Pages' },
    { path: '/admin/portfolio', icon: <FiBookOpen />, label: 'Portfolio' },
    { path: '/admin/skills', icon: <FiCode />, label: 'Skills' },
    { path: '/admin/education', icon: <FiBook />, label: 'Education' },
    { path: '/admin/volunteer', icon: <FiHeart />, label: 'Volunteer' },
    { path: '/admin/publications', icon: <FiFileText />, label: 'Publications' },
    { path: '/admin/courses', icon: <FiAward />, label: 'Courses' },
    { path: '/admin/certifications', icon: <FiAward />, label: 'Certifications' },
    { path: '/admin/cv-resume', icon: <FiFile />, label: 'CV / Resume' },
    { path: '/admin/media', icon: <FiImage />, label: 'Media Library' },
    { path: '/admin/messages', icon: <FiMessageSquare />, label: 'Messages' },
    { path: '/admin/settings', icon: <FiSettings />, label: 'Settings' },
  ];

  return (
    <div className="admin-layout">
      <button className="admin-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <FiX /> : <FiMenu />}
      </button>
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-logo">DJ Admin</Link>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-item">
            <FiBookOpen /> <span>View Site</span>
          </Link>
          <button className="admin-nav-item admin-logout-btn" onClick={logout}>
            <FiLogOut /> <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #f5f5f5;
        }
        .admin-sidebar {
          width: 250px;
          background: #1a1a2e;
          color: #fff;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 100;
          transition: transform 0.3s ease;
        }
        .admin-sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .admin-logo {
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: 1.3rem;
          color: #FF8473;
        }
        .admin-nav {
          flex: 1;
          padding: 16px 0;
        }
        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          transition: all 0.2s;
          border: none;
          background: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
        }
        .admin-nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .admin-nav-item.active {
          background: rgba(255,132,115,0.15);
          color: #FF8473;
          border-right: 3px solid #FF8473;
        }
        .admin-sidebar-footer {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding: 12px 0;
        }
        .admin-logout-btn:hover { color: #ff4444 !important; }
        .admin-main {
          flex: 1;
          margin-left: 250px;
          padding: 30px;
        }
        .admin-sidebar-toggle {
          display: none;
          position: fixed;
          top: 15px;
          left: 15px;
          z-index: 200;
          background: #1a1a2e;
          color: #fff;
          border: none;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 20px;
        }
        @media (max-width: 768px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar.open { transform: translateX(0); }
          .admin-main { margin-left: 0; padding: 20px; padding-top: 70px; }
          .admin-sidebar-toggle { display: flex; }
        }

        /* ===== Shared Admin Component Styles ===== */
        .admin-code {
          background: #f0f0f0; color: #7152E1; padding: 2px 8px;
          border-radius: 4px; font-size: 13px; font-family: 'Courier New', monospace;
        }
        .admin-help-text {
          color: #8A8A8A; font-size: 13px; display: block; margin-top: 4px;
        }
        .admin-subtitle {
          color: #8A8A8A; margin-bottom: 24px; font-size: 14px;
        }
        .admin-empty-state {
          text-align: center; padding: 60px 20px; color: #8A8A8A;
        }
        .admin-empty-state svg { margin-bottom: 12px; }

        /* Form element refinements */
        .admin-crud-page input[type="range"] {
          width: 100%; height: 6px; -webkit-appearance: none; appearance: none;
          background: #f0f0f0; border-radius: 3px; outline: none; margin: 8px 0;
        }
        .admin-crud-page input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 18px; height: 18px;
          background: linear-gradient(135deg, #FF8473, #7152E1);
          border-radius: 50%; cursor: pointer; border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .admin-crud-page input[type="range"]::-moz-range-thumb {
          width: 18px; height: 18px;
          background: linear-gradient(135deg, #FF8473, #7152E1);
          border-radius: 50%; cursor: pointer; border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .admin-crud-page input[type="date"],
        .admin-crud-page input[type="color"] {
          cursor: pointer;
        }
        .admin-crud-page input[type="checkbox"] {
          accent-color: #FF8473; width: 16px; height: 16px; cursor: pointer;
        }
        .admin-crud-page select.form-select {
          cursor: pointer;
        }
        .admin-crud-page select.form-select[multiple] {
          min-height: 80px;
        }
        .admin-crud-page option {
          padding: 4px 8px;
        }

        /* Button refinements */
        .btn-icon {
          background: none; border: none; cursor: pointer; padding: 6px;
          border-radius: 6px; display: inline-flex; align-items: center;
          font-size: 16px; color: #8A8A8A; transition: all 0.2s;
          text-decoration: none;
        }
        .btn-icon:hover { background: #f0f0f0; color: #555; }
        .btn-icon.edit:hover { background: #7152E120; color: #7152E1; }
        .btn-icon.delete:hover { background: #f4433620; color: #f44336; }

        /* Shared admin page layout */
        .admin-crud-page { max-width: 1200px; }
        .admin-crud-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 24px; flex-wrap: wrap; gap: 16px;
        }
        .admin-page-title {
          font-size: 1.8rem; font-family: 'Inter', sans-serif;
        }

        /* Shared admin table */
        .admin-table-wrapper {
          background: #fff; border-radius: 12px; overflow-x: auto;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th {
          text-align: left; padding: 16px 20px; font-size: 12px;
          text-transform: uppercase; letter-spacing: 1px; color: #8A8A8A;
          border-bottom: 2px solid #f0f0f0; font-family: 'Inter', sans-serif;
        }
        .admin-table td { padding: 14px 20px; border-bottom: 1px solid #f5f5f5; font-size: 14px; }
        .admin-table tr:hover td { background: #f9f9f9; }

        /* Shared admin badges */
        .badge { padding: 3px 10px; border-radius: 50px; font-size: 12px; font-weight: 600; }
        .badge-primary { background: #FF847320; color: #FF8473; }
        .badge-success { background: #4CAF5020; color: #4CAF50; }
        .badge-danger { background: #f4433620; color: #f44336; }

        /* Shared admin actions */
        .admin-actions { display: flex; gap: 8px; }
        .admin-progress { height: 6px; background: #f0f0f0; border-radius: 3px; width: 100px; display: inline-block; vertical-align: middle; margin-right: 8px; }
        .admin-progress-fill { height: 100%; background: linear-gradient(90deg, #FF8473, #7152E1); border-radius: 3px; }

        /* Shared admin modal */
        .admin-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 20px;
        }
        .admin-modal {
          background: #fff; border-radius: 16px; padding: 30px;
          width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto;
        }
        .admin-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .admin-modal-header h2 { font-size: 1.3rem; font-family: 'Inter', sans-serif; }
        .admin-modal .form-group { margin-bottom: 16px; }

        /* Tech badge */
        .tech-badge-lg {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 12px; background: #7152E115; color: #7152E1;
          border-radius: 50px; font-size: 12px; font-weight: 600;
        }

        /* Admin card component */
        .admin-card {
          background: #fff; border-radius: 12px; padding: 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .admin-card-title {
          font-size: 1.1rem; margin-bottom: 6px; font-family: 'Inter', sans-serif;
        }
        .admin-card-desc {
          color: #8A8A8A; font-size: 13px; margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
