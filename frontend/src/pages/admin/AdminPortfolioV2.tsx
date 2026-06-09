import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Portfolio, PortfolioCategory, MediaFile } from '../../types';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiStar } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminPortfolioV2 = () => {
  const [items, setItems] = useState<Portfolio[]>([]);
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Portfolio | null>(null);
  const [form, setForm] = useState({
    title: '', shortDescription: '', fullDescription: '', categoryId: 0,
    featuredImageId: 0, projectUrl: '', githubUrl: '', isFeatured: false,
    isPublished: true, displayOrder: 0, technologies: [] as string[], gallery: [] as number[]
  });
  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/portfolio-v2?limit=100'),
      api.get('/portfolio-v2/categories'),
      api.get('/media')
    ]).then(([p, c, m]) => {
      setItems(p.data.data || []);
      setCategories(c.data);
      setMedia(m.data);
    }).catch(() => toast.error('Failed to load'))
    .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', shortDescription: '', fullDescription: '', categoryId: 0, featuredImageId: 0, projectUrl: '', githubUrl: '', isFeatured: false, isPublished: true, displayOrder: 0, technologies: [], gallery: [] });
    setShowModal(true);
  };

  const openEdit = (item: Portfolio) => {
    setEditing(item);
    setForm({
      title: item.title, shortDescription: item.shortDescription || '', fullDescription: item.fullDescription || '',
      categoryId: item.categoryId || 0, featuredImageId: item.featuredImageId || 0,
      projectUrl: item.projectUrl || '', githubUrl: item.githubUrl || '',
      isFeatured: item.isFeatured, isPublished: item.isPublished, displayOrder: item.displayOrder,
      technologies: item.technologies?.map(t => t.technologyName) || [],
      gallery: item.gallery?.map(g => g.mediaFileId) || []
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { ...form, categoryId: form.categoryId || null, featuredImageId: form.featuredImageId || null };
      if (editing) {
        await api.put(`/portfolio-v2/${editing.id}`, data);
        toast.success('Portfolio updated');
      } else {
        await api.post('/portfolio-v2', data);
        toast.success('Portfolio created');
      }
      setShowModal(false);
      const res = await api.get('/portfolio-v2?limit=100'); setItems(res.data.data || []);
    } catch { toast.error('Operation failed'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this item?')) return;
    try { await api.delete(`/portfolio-v2/${id}`); toast.success('Deleted'); setItems(await api.get('/portfolio-v2?limit=100').then(r => r.data.data || [])); }
    catch { toast.error('Delete failed'); }
  };

  const addTech = () => {
    if (techInput && !form.technologies.includes(techInput)) {
      setForm({ ...form, technologies: [...form.technologies, techInput] });
      setTechInput('');
    }
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
            <tr><th>Title</th><th>Category</th><th>Status</th><th>Featured</th><th>Order</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.title}</strong></td>
                <td><span className="badge badge-primary">{item.category?.name || '-'}</span></td>
                <td><span className={`badge ${item.isPublished ? 'badge-success' : 'badge-danger'}`}>{item.isPublished ? 'Published' : 'Draft'}</span></td>
                <td>{item.isFeatured ? <FiStar style={{ color: '#FFC107' }} /> : '-'}</td>
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
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 700 }}>
            <div className="admin-modal-header">
              <h2>{editing ? 'Edit Project' : 'Add Project'}</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="grid-2" style={{ gap: 16 }}>
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-select" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}>
                    <option value={0}>None</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Display Order</label>
                  <input type="number" className="form-input" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} />
                </div>
              </div>
              <div className="form-group">
                <label>Short Description</label>
                <textarea className="form-textarea" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Full Description</label>
                <textarea className="form-textarea" rows={4} value={form.fullDescription} onChange={(e) => setForm({ ...form, fullDescription: e.target.value })} />
              </div>
              <div className="grid-2" style={{ gap: 16 }}>
                <div className="form-group">
                  <label>Featured Image</label>
                  <select className="form-select" value={form.featuredImageId} onChange={(e) => setForm({ ...form, featuredImageId: Number(e.target.value) })}>
                    <option value={0}>None</option>
                    {media.map(m => <option key={m.id} value={m.id}>{m.originalFilename}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Gallery Images</label>
                  <select className="form-select" multiple size={3} value={form.gallery.map(String)} onChange={(e) => setForm({ ...form, gallery: Array.from(e.target.selectedOptions, o => Number(o.value)) })}>
                    {media.map(m => <option key={m.id} value={m.id}>{m.originalFilename}</option>)}
                  </select>
                </div>
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
                <label>Technologies</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input className="form-input" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())} placeholder="Add technology..." />
                  <button type="button" className="btn btn-primary" style={{ padding: '8px 16px' }} onClick={addTech}>Add</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {form.technologies.map((t, i) => (
                    <span key={i} className="tech-badge-lg" style={{ cursor: 'pointer' }} onClick={() => setForm({ ...form, technologies: form.technologies.filter((_, j) => j !== i) })}>
                      {t} &times;
                    </span>
                  ))}
                </div>
              </div>
              <div className="form-group" style={{ display: 'flex', gap: 20 }}>
                <label><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured</label>
                <label><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} /> Published</label>
              </div>
              <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'} Project</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortfolioV2;
