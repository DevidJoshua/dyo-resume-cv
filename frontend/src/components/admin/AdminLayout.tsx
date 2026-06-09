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
      `}</style>
    </div>
  );
};

export default AdminLayout;
