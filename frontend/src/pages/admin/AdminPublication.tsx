import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Publication } from '../../types';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiExternalLink } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminPublication = () => {
  const [items, setItems] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Publication | null>(null);
  const [form, setForm] = useState({ title: '', publisher: '', publishedDate: '', url: '', description: '', isActive: true, displayOrder: 0 });

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { const r = await api.get('/resume/publications'); setItems(r.data); }
    catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', publisher: '', publishedDate: '', url: '', description: '', isActive: true, displayOrder: 0 });
    setShowModal(true);
  };

  const openEdit = (item: Publication) => {
    setEditing(item);
    setForm({
      title: item.title, publisher: item.publisher || '',
      publishedDate: item.publishedDate ? item.publishedDate.split('T')[0] : '',
      url: item.url || '', description: item.description || '',
      isActive: item.isActive, displayOrder: item.displayOrder,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/resume/publications/${editing.id}`, form); toast.success('Updated'); }
      else { await api.post('/resume/publications', form); toast.success('Created'); }
      setShowModal(false); load();
    } catch { toast.error('Operation failed'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this publication?')) return;
    try { await api.delete(`/resume/publications/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-crud-page">
      <div className="admin-crud-header">
        <h1 className="admin-page-title">Publications</h1>
        <button className="btn btn-primary" onClick={openCreate}><FiPlus /> Add Publication</button>
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Publisher</th><th>Date</th><th>Active</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.title}</strong></td>
                <td>{item.publisher || '-'}</td>
                <td><small>{item.publishedDate?.split('T')[0] || '-'}</small></td>
                <td><span className={`badge ${item.isActive ? 'badge-success' : 'badge-danger'}`}>{item.isActive ? 'Yes' : 'No'}</span></td>
                <td className="admin-actions">
                  {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-icon"><FiExternalLink /></a>}
                  <button className="btn-icon edit" onClick={() => openEdit(item)}><FiEdit2 /></button>
                  <button className="btn-icon delete" onClick={() => handleDelete(item.id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: '#8A8A8A', padding: 40 }}>No publications yet</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editing ? 'Edit Publication' : 'Add Publication'}</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Title</label><input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="form-group"><label>Publisher / Journal</label><input className="form-input" value={form.publisher} onChange={(e) => setForm({ ...form, publisher: e.target.value })} /></div>
              <div className="form-group"><label>Published Date</label><input type="date" className="form-input" value={form.publishedDate} onChange={(e) => setForm({ ...form, publishedDate: e.target.value })} /></div>
              <div className="form-group"><label>URL</label><input className="form-input" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></div>
              <div className="form-group"><label>Description</label><textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="form-group"><label>Display Order</label><input type="number" className="form-input" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} /></div>
              <div className="form-group"><label><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label></div>
              <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPublication;
