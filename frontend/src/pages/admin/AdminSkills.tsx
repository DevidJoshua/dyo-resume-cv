import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Skill } from '../../types';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState({ name: '', category: '', proficiency: 50, icon: '', displayOrder: 0, isActive: true });

  useEffect(() => { loadSkills(); }, []);

  const loadSkills = async () => {
    try {
      const res = await api.get('/skills');
      setSkills(res.data);
    } catch { toast.error('Failed to load skills'); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', category: '', proficiency: 50, icon: '', displayOrder: 0, isActive: true });
    setShowModal(true);
  };

  const openEdit = (skill: Skill) => {
    setEditing(skill);
    setForm({ name: skill.name, category: skill.category || '', proficiency: skill.proficiency, icon: skill.icon || '', displayOrder: skill.displayOrder, isActive: skill.isActive });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/skills/${editing.id}`, form);
        toast.success('Skill updated');
      } else {
        await api.post('/skills', form);
        toast.success('Skill created');
      }
      setShowModal(false);
      loadSkills();
    } catch { toast.error('Operation failed'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this skill?')) return;
    try {
      await api.delete(`/skills/${id}`);
      toast.success('Skill deleted');
      loadSkills();
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-crud-page">
      <div className="admin-crud-header">
        <h1 className="admin-page-title">Skills Management</h1>
        <button className="btn btn-primary" onClick={openCreate}><FiPlus /> Add Skill</button>
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Proficiency</th>
              <th>Order</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill.id}>
                <td><strong>{skill.name}</strong></td>
                <td><span className="badge badge-primary">{skill.category || '-'}</span></td>
                <td>
                  <div className="admin-progress"><div className="admin-progress-fill" style={{ width: `${skill.proficiency}%` }} /></div>
                  <small>{skill.proficiency}%</small>
                </td>
                <td>{skill.displayOrder}</td>
                <td><span className={`badge ${skill.isActive ? 'badge-success' : 'badge-danger'}`}>{skill.isActive ? 'Yes' : 'No'}</span></td>
                <td className="admin-actions">
                  <button className="btn-icon edit" onClick={() => openEdit(skill)}><FiEdit2 /></button>
                  <button className="btn-icon delete" onClick={() => handleDelete(skill.id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editing ? 'Edit Skill' : 'Add Skill'}</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Skill Name</label>
                <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Proficiency ({form.proficiency}%)</label>
                <input type="range" min="0" max="100" value={form.proficiency} onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Icon (Font Awesome class)</label>
                <input className="form-input" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="fab fa-react" />
              </div>
              <div className="form-group">
                <label>Display Order</label>
                <input type="number" className="form-input" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                  {' '}Active
                </label>
              </div>
              <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'} Skill</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-crud-page { max-width: 1200px; }
        .admin-crud-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
        .admin-table-wrapper { background: #fff; border-radius: 12px; overflow-x: auto; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { text-align: left; padding: 16px 20px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #8A8A8A; border-bottom: 2px solid #f0f0f0; font-family: 'Inter', sans-serif; }
        .admin-table td { padding: 14px 20px; border-bottom: 1px solid #f5f5f5; font-size: 14px; }
        .admin-table tr:hover td { background: #f9f9f9; }
        .badge { padding: 3px 10px; border-radius: 50px; font-size: 12px; font-weight: 600; }
        .badge-primary { background: #FF847320; color: #FF8473; }
        .badge-success { background: #4CAF5020; color: #4CAF50; }
        .badge-danger { background: #f4433620; color: #f44336; }
        .admin-progress { height: 6px; background: #f0f0f0; border-radius: 3px; width: 100px; display: inline-block; vertical-align: middle; margin-right: 8px; }
        .admin-progress-fill { height: 100%; background: linear-gradient(90deg, #FF8473, #7152E1); border-radius: 3px; }
        .admin-actions { display: flex; gap: 8px; }
        .btn-icon { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px; display: flex; align-items: center; font-size: 16px; color: #8A8A8A; transition: all 0.2s; }
        .btn-icon.edit:hover { background: #7152E120; color: #7152E1; }
        .btn-icon.delete:hover { background: #f4433620; color: #f44336; }
        .admin-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 20px;
        }
        .admin-modal {
          background: #fff; border-radius: 16px; padding: 30px;
          width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto;
        }
        .admin-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .admin-modal-header h2 { font-size: 1.3rem; font-family: 'Inter', sans-serif; }
        .admin-modal .form-group { margin-bottom: 16px; }
      `}</style>
    </div>
  );
};

export default AdminSkills;
