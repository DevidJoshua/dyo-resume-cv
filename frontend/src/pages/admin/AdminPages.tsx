import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Page, PageTemplate } from '../../types';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiEye, FiCheck } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminPages = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [templates, setTemplates] = useState<PageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Page | null>(null);
  const [form, setForm] = useState({ title: '', slug: '', templateId: 0, seoTitle: '', seoDescription: '', isPublished: false });
  const [contentForm, setContentForm] = useState('{}');

  useEffect(() => {
    Promise.all([api.get('/pages'), api.get('/pages/templates')])
      .then(([p, t]) => { setPages(p.data); setTemplates(t.data); })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', slug: '', templateId: templates[0]?.id || 0, seoTitle: '', seoDescription: '', isPublished: false });
    setContentForm('{}');
    setShowModal(true);
  };

  const openEdit = async (page: Page) => {
    setEditing(page);
    setForm({ title: page.title, slug: page.slug, templateId: page.templateId, seoTitle: page.seoTitle || '', seoDescription: page.seoDescription || '', isPublished: page.isPublished });
    try {
      const res = await api.get(`/pages/${page.id}`);
      setContentForm(res.data.contents?.[0]?.contentJson || '{}');
    } catch { setContentForm('{}'); }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/pages/${editing.id}`, form);
        await api.put(`/pages/${editing.id}/content`, { contentJson: contentForm });
        toast.success('Page updated');
      } else {
        await api.post('/pages', form);
        toast.success('Page created');
      }
      setShowModal(false);
      const res = await api.get('/pages'); setPages(res.data);
    } catch { toast.error('Operation failed'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this page?')) return;
    try { await api.delete(`/pages/${id}`); toast.success('Page deleted'); setPages(await api.get('/pages').then(r => r.data)); }
    catch { toast.error('Delete failed'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-crud-page">
      <div className="admin-crud-header">
        <h1 className="admin-page-title">Pages Management</h1>
        <button className="btn btn-primary" onClick={openCreate}><FiPlus /> Create Page</button>
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr><th>Title</th><th>Slug</th><th>Template</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id}>
                <td><strong>{page.title}</strong></td>
                <td><code className="admin-code">/{page.slug}</code></td>
                <td><span className="badge badge-primary">{page.template?.name || '-'}</span></td>
                <td><span className={`badge ${page.isPublished ? 'badge-success' : 'badge-danger'}`}>{page.isPublished ? 'Published' : 'Draft'}</span></td>
                <td className="admin-actions">
                  <button className="btn-icon edit" onClick={() => openEdit(page)}><FiEdit2 /></button>
                  <button className="btn-icon delete" onClick={() => handleDelete(page.id)}><FiTrash2 /></button>
                  <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" className="btn-icon" style={{ color: '#7152E1' }}><FiEye /></a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 650 }}>
            <div className="admin-modal-header">
              <h2>{editing ? 'Edit Page' : 'Create Page'}</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid-2" style={{ gap: 16 }}>
                <div className="form-group">
                  <label>Title *</label>
                  <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: editing ? form.slug : e.target.value.toLowerCase().replace(/\s+/g, '-') })} required />
                </div>
                <div className="form-group">
                  <label>Slug *</label>
                  <input className="form-input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Template</label>
                <select className="form-select" value={form.templateId} onChange={(e) => setForm({ ...form, templateId: Number(e.target.value) })}>
                  {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>SEO Title</label>
                <input className="form-input" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
              </div>
              <div className="form-group">
                <label>SEO Description</label>
                <textarea className="form-textarea" value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} />
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
                  {' '}Published
                </label>
              </div>
              <div className="form-group">
                <label>Page Content (JSON)</label>
                <textarea className="form-textarea" rows={8} value={contentForm} onChange={(e) => setContentForm(e.target.value)}
                  placeholder='{"sections":[{"type":"text","title":"Section Title","content":"Your content here"}]}' />
                <small style={{ color: '#8A8A8A' }}>Supported types: hero, text, two-column, gallery</small>
              </div>
              <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'} Page</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPages;
