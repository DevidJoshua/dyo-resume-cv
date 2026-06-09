import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Certification } from '../../types';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiExternalLink } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminCertification = () => {
  const [items, setItems] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Certification | null>(null);
  const [form, setForm] = useState({ name: '', organization: '', issuedDate: '', expirationDate: '', credentialUrl: '', credentialId: '', description: '', isActive: true, displayOrder: 0 });

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { const r = await api.get('/resume/certifications'); setItems(r.data); }
    catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', organization: '', issuedDate: '', expirationDate: '', credentialUrl: '', credentialId: '', description: '', isActive: true, displayOrder: 0 });
    setShowModal(true);
  };

  const openEdit = (item: Certification) => {
    setEditing(item);
    setForm({
      name: item.name, organization: item.organization || '',
      issuedDate: item.issuedDate ? item.issuedDate.split('T')[0] : '',
      expirationDate: item.expirationDate ? item.expirationDate.split('T')[0] : '',
      credentialUrl: item.credentialUrl || '', credentialId: item.credentialId || '',
      description: item.description || '', isActive: item.isActive, displayOrder: item.displayOrder,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/resume/certifications/${editing.id}`, form); toast.success('Updated'); }
      else { await api.post('/resume/certifications', form); toast.success('Created'); }
      setShowModal(false); load();
    } catch { toast.error('Operation failed'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this certification?')) return;
    try { await api.delete(`/resume/certifications/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-crud-page">
      <div className="admin-crud-header">
        <h1 className="admin-page-title">Certifications</h1>
        <button className="btn btn-primary" onClick={openCreate}><FiPlus /> Add Certification</button>
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Certification</th><th>Organization</th><th>Issued</th><th>Active</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.name}</strong></td>
                <td>{item.organization || '-'}</td>
                <td><small>{item.issuedDate?.split('T')[0] || '-'}</small></td>
                <td><span className={`badge ${item.isActive ? 'badge-success' : 'badge-danger'}`}>{item.isActive ? 'Yes' : 'No'}</span></td>
                <td className="admin-actions">
                  {item.credentialUrl && <a href={item.credentialUrl} target="_blank" rel="noopener noreferrer" className="btn-icon"><FiExternalLink /></a>}
                  <button className="btn-icon edit" onClick={() => openEdit(item)}><FiEdit2 /></button>
                  <button className="btn-icon delete" onClick={() => handleDelete(item.id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: '#8A8A8A', padding: 40 }}>No certifications yet</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editing ? 'Edit Certification' : 'Add Certification'}</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Certification Name</label><input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="form-group"><label>Issuing Organization</label><input className="form-input" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group"><label>Issued Date</label><input type="date" className="form-input" value={form.issuedDate} onChange={(e) => setForm({ ...form, issuedDate: e.target.value })} /></div>
                <div className="form-group"><label>Expiration Date</label><input type="date" className="form-input" value={form.expirationDate} onChange={(e) => setForm({ ...form, expirationDate: e.target.value })} /></div>
              </div>
              <div className="form-group"><label>Credential URL</label><input className="form-input" value={form.credentialUrl} onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })} placeholder="https://..." /></div>
              <div className="form-group"><label>Credential ID</label><input className="form-input" value={form.credentialId} onChange={(e) => setForm({ ...form, credentialId: e.target.value })} /></div>
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

export default AdminCertification;
