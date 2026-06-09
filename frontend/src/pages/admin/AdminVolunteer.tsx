import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Volunteer } from '../../types';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminVolunteer = () => {
  const [items, setItems] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Volunteer | null>(null);
  const [form, setForm] = useState({ organization: '', role: '', startDate: '', endDate: '', description: '', isActive: true, displayOrder: 0 });

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { const r = await api.get('/resume/volunteer'); setItems(r.data); }
    catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ organization: '', role: '', startDate: '', endDate: '', description: '', isActive: true, displayOrder: 0 });
    setShowModal(true);
  };

  const openEdit = (item: Volunteer) => {
    setEditing(item);
    setForm({
      organization: item.organization, role: item.role,
      startDate: item.startDate ? item.startDate.split('T')[0] : '',
      endDate: item.endDate ? item.endDate.split('T')[0] : '',
      description: item.description || '', isActive: item.isActive, displayOrder: item.displayOrder,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/resume/volunteer/${editing.id}`, form); toast.success('Updated'); }
      else { await api.post('/resume/volunteer', form); toast.success('Created'); }
      setShowModal(false); load();
    } catch { toast.error('Operation failed'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this volunteer entry?')) return;
    try { await api.delete(`/resume/volunteer/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-crud-page">
      <div className="admin-crud-header">
        <h1 className="admin-page-title">Volunteer Experience</h1>
        <button className="btn btn-primary" onClick={openCreate}><FiPlus /> Add Volunteer</button>
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Organization</th><th>Role</th><th>Period</th><th>Active</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.organization}</strong></td>
                <td>{item.role}</td>
                <td><small>{item.startDate?.split('T')[0] || '?'} - {item.endDate?.split('T')[0] || 'Present'}</small></td>
                <td><span className={`badge ${item.isActive ? 'badge-success' : 'badge-danger'}`}>{item.isActive ? 'Yes' : 'No'}</span></td>
                <td className="admin-actions">
                  <button className="btn-icon edit" onClick={() => openEdit(item)}><FiEdit2 /></button>
                  <button className="btn-icon delete" onClick={() => handleDelete(item.id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: '#8A8A8A', padding: 40 }}>No volunteer entries yet</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editing ? 'Edit Volunteer' : 'Add Volunteer'}</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Organization</label><input className="form-input" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} required /></div>
              <div className="form-group"><label>Role</label><input className="form-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group"><label>Start Date</label><input type="date" className="form-input" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
                <div className="form-group"><label>End Date</label><input type="date" className="form-input" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
              </div>
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

export default AdminVolunteer;
