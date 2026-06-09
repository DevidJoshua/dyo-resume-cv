import { useState, useEffect } from 'react';
import api from '../../services/api';
import { DashboardData } from '../../types';
import { FiBookOpen, FiMessageSquare, FiCode, FiClock } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/site/dashboard')
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const stats = [
    { icon: <FiBookOpen />, label: 'Portfolio Items', value: data?.portfolioCount || 0, color: '#FF8473' },
    { icon: <FiMessageSquare />, label: 'Contact Messages', value: data?.messageCount || 0, color: '#7152E1' },
    { icon: <FiCode />, label: 'Skills', value: data?.skillCount || 0, color: '#4CAF50' },
  ];

  return (
    <div className="admin-dashboard">
      <h1 className="admin-page-title">Dashboard</h1>
      <div className="dashboard-stats">
        {stats.map((stat) => (
          <div key={stat.label} className="dashboard-stat-card">
            <div className="dashboard-stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="dashboard-stat-info">
              <span className="dashboard-stat-value">{stat.value}</span>
              <span className="dashboard-stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-recent">
        <h2><FiClock /> Recent Messages</h2>
        {data?.recentMessages && data.recentMessages.length > 0 ? (
          <div className="dashboard-messages-list">
            {data.recentMessages.map((msg) => (
              <div key={msg.id} className="dashboard-message-item">
                <strong>{msg.name}</strong>
                <span className="msg-subject">{msg.subject || 'No subject'}</span>
                <span className="msg-date">{new Date(msg.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No messages yet</p>
        )}
      </div>
      <style>{`
        .admin-page-title { font-size: 1.8rem; margin-bottom: 30px; font-family: 'Inter', sans-serif; }
        .dashboard-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .dashboard-stat-card {
          background: #fff; border-radius: 12px; padding: 24px;
          display: flex; align-items: center; gap: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .dashboard-stat-icon {
          width: 50px; height: 50px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
        }
        .dashboard-stat-info { display: flex; flex-direction: column; }
        .dashboard-stat-value { font-size: 1.6rem; font-weight: 700; font-family: 'Inter', sans-serif; }
        .dashboard-stat-label { font-size: 13px; color: #8A8A8A; }
        .dashboard-recent {
          background: #fff; border-radius: 12px; padding: 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .dashboard-recent h2 { font-size: 1.2rem; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
        .dashboard-messages-list { display: flex; flex-direction: column; gap: 12px; }
        .dashboard-message-item {
          display: flex; align-items: center; gap: 16px;
          padding: 12px 16px; background: #f9f9f9; border-radius: 8px;
          font-size: 14px;
        }
        .dashboard-message-item strong { min-width: 120px; }
        .msg-subject { flex: 1; color: #8A8A8A; }
        .msg-date { color: #8A8A8A; font-size: 12px; }
        .no-data { color: #8A8A8A; text-align: center; padding: 40px; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
