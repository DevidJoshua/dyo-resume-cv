import { useState, useEffect } from 'react';
import api from '../../services/api';
import { ContactMessage } from '../../types';
import { toast } from 'react-toastify';
import { FiTrash2, FiMail, FiUser, FiCalendar } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  useEffect(() => { loadMessages(); }, []);

  const loadMessages = async () => {
    try {
      const res = await api.get('/contact?limit=100');
      setMessages(res.data.data || []);
    } catch { toast.error('Failed to load messages'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.delete(`/contact/${id}`);
      toast.success('Message deleted');
      loadMessages();
      if (selected?.id === id) setSelected(null);
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-crud-page">
      <h1 className="admin-page-title">Contact Messages</h1>
      <div className="admin-messages-grid">
        <div className="admin-messages-list">
          {messages.length === 0 ? (
            <p className="no-data">No messages yet</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`admin-msg-card ${selected?.id === msg.id ? 'active' : ''}`} onClick={() => setSelected(msg)}>
                <div className="admin-msg-card-header">
                  <strong>{msg.name}</strong>
                  <span className="msg-date">{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="admin-msg-card-subject">{msg.subject || 'No subject'}</div>
                <div className="admin-msg-card-preview">{msg.message.substring(0, 80)}...</div>
              </div>
            ))
          )}
        </div>
        <div className="admin-msg-detail">
          {selected ? (
            <>
              <div className="admin-msg-detail-header">
                <h2>{selected.subject || 'No Subject'}</h2>
                <button className="btn-icon delete" onClick={() => handleDelete(selected.id)}><FiTrash2 /></button>
              </div>
              <div className="admin-msg-detail-meta">
                <span><FiUser /> {selected.name}</span>
                <span><FiMail /> {selected.email}</span>
                <span><FiCalendar /> {new Date(selected.createdAt).toLocaleString()}</span>
              </div>
              <div className="admin-msg-detail-body">
                <p>{selected.message}</p>
              </div>
              <a href={`mailto:${selected.email}`} className="btn btn-primary" style={{ marginTop: 20 }}>Reply via Email</a>
            </>
          ) : (
            <div className="admin-msg-placeholder">
              <FiMail size={48} />
              <p>Select a message to view</p>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .admin-messages-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 20px; align-items: start; }
        .admin-messages-list { display: flex; flex-direction: column; gap: 10px; max-height: 70vh; overflow-y: auto; }
        .admin-msg-card {
          background: #fff; border-radius: 10px; padding: 16px;
          cursor: pointer; border: 2px solid transparent;
          transition: all 0.2s; box-shadow: 0 1px 5px rgba(0,0,0,0.04);
        }
        .admin-msg-card:hover { border-color: #FF847340; }
        .admin-msg-card.active { border-color: #FF8473; }
        .admin-msg-card-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
        .admin-msg-card-header strong { font-size: 14px; }
        .admin-msg-card-subject { font-size: 13px; color: #7152E1; font-weight: 600; margin-bottom: 4px; }
        .admin-msg-card-preview { font-size: 12px; color: #8A8A8A; }
        .admin-msg-detail {
          background: #fff; border-radius: 12px; padding: 30px;
          min-height: 400px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .admin-msg-detail-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px; }
        .admin-msg-detail-header h2 { font-size: 1.3rem; flex: 1; }
        .admin-msg-detail-meta { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f0f0f0; }
        .admin-msg-detail-meta span { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #8A8A8A; }
        .admin-msg-detail-body p { line-height: 1.8; color: #555; }
        .admin-msg-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; height: 100%; min-height: 300px; color: #8A8A8A; }
        @media (max-width: 768px) {
          .admin-messages-grid { grid-template-columns: 1fr; }
          .admin-messages-list { max-height: 300px; }
        }
      `}</style>
    </div>
  );
};

export default AdminMessages;
