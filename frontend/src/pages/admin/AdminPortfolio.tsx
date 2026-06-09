import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Portfolio } from '../../types';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiExternalLink, FiGithub } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminPortfolio = () => {
  const [items, setItems] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Portfolio | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', imageUrl: '', category: '', technologies: '',
    projectUrl: '', githubUrl: '', featured: false, displayOrder: 0
  });

  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    try {
      const res = await api.get('/portfolio?limit=100');
      setItems(res.data.data || []);
    } catch { toast.error('Failed to load portfolio'); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', description: '', imageUrl: '', category: '', technologies: '', projectUrl: '', githubUrl: '', featured: false, displayOrder: 0 });
    setShowModal(true);
  };

  const openEdit = (item: Portfolio) => {
    setEditing(item);
    setForm({
      title: item.title, description: item.description || '', imageUrl: item.imageUrl || '',
      category: item.category || '', technologies: item.technologies || '',
      projectUrl: item.projectUrl || '', githubUrl: item.githubUrl || '',
      featured: item.featured, displayOrder: item.displayOrder
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/portfolio/${editing.id}`, form);
        toast.success('Portfolio updated');
      } else {
        await api.post('/portfolio', form);
        toast.success('Portfolio created');
      }
      setShowModal(false);
      loadItems();
    } catch { toast.error('Operation failed'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this portfolio item?')) return;
    try {
      await api.delete(`/portfolio/${id}`);
      toast.success('Portfolio deleted');
      loadItems();
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-crud-page">
      <div className="admin-crud-header">
        <h1 className="admin-page-title">Portfolio Management</h1>
        <button className="btn btn-primary" onClick={openCreate}><FiPlus /> Add Project</button>
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Technologies</th>
              <th>Featured</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.title}</strong></td>
                <td><span className="badge badge-primary">{item.category || '-'}</span></td>
                <td style={{ maxWidth: 200 }}><small>{item.technologies}</small></td>
                <td><span className={`badge ${item.featured ? 'badge-success' : 'badge-danger'}`}>{item.featured ? 'Yes' : 'No'}</span></td>
                <td>{item.displayOrder}</td>
                <td className="admin-actions">
                  <button className="btn-icon edit" onClick={() => openEdit(item)}><FiEdit2 /></button>
                  <button className="btn-icon delete" onClick={() => handleDelete(item.id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div className="admin-modal-header">
              <h2>{editing ? 'Edit Project' : 'Add Project'}</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input className="form-input" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
              </div>
              <div className="grid-2" style={{ gap: 16 }}>
                <div className="form-group">
                  <label>Category</label>
                  <input className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Display Order</label>
                  <input type="number" className="form-input" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} />
                </div>
              </div>
              <div className="form-group">
                <label>Technologies (comma separated)</label>
                <input className="form-input" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="React, Node.js, TypeScript" />
              </div>
              <div className="grid-2" style={{ gap: 16 }}>
                <div className="form-group">
                  <label>Project URL</label>
                  <input className="form-input" value={form.projectUrl} onChange={(e) => setForm({ ...form, projectUrl: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>GitHub URL</label>
                  <input className="form-input" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  {' '}Featured
                </label>
              </div>
              <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'} Project</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortfolio;
