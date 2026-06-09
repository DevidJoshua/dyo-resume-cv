import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      toast.success('Login successful');
    } catch {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1>Admin Login</h1>
        <p>Sign in to manage your portfolio</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input className="form-input" placeholder="Username or Email" value={username}
              onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <input className="form-input" type="password" placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
      <style>{`
        .admin-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          padding: 20px;
        }
        .admin-login-card {
          background: #fff;
          border-radius: 16px;
          padding: 40px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .admin-login-card h1 {
          font-family: 'Inter', sans-serif;
          font-size: 1.8rem;
          margin-bottom: 5px;
        }
        .admin-login-card p {
          color: #8A8A8A;
          margin-bottom: 30px;
        }
        .admin-login-card .form-group { margin-bottom: 16px; }
        .admin-login-card .form-input {
          border-color: #e5e7eb;
          background: #f9f9f9;
        }
        .admin-login-card .form-input:focus {
          background: #fff;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
