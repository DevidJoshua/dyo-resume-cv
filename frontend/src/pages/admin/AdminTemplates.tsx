import { useState, useEffect } from 'react';
import api from '../../services/api';
import { HomepageTemplate } from '../../types';
import { toast } from 'react-toastify';
import { FiCheck, FiEye } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const templatePreview: Record<string, string> = {
  professional: 'Clean professional layout with focus on experience and skills. Features a hero section, skill bars, and timeline for experience.',
  modern: 'Bold modern design with full-width sections, circular skill indicators, gradient shapes, and overlay portfolio cards.',
  minimalist: 'Simple, clean, and minimal design. Focuses on content with a centered layout, project list, and minimal contact section.',
  creative: 'Creative layout with large background typography, alternating project layouts, and bold visual hierarchy.',
  developer: 'Developer-themed design with code window hero, terminal-style headings, monospace fonts, and tech badges.',
};

const AdminTemplates = () => {
  const [templates, setTemplates] = useState<HomepageTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadTemplates(); }, []);

  const loadTemplates = async () => {
    try {
      const res = await api.get('/templates');
      setTemplates(res.data);
    } catch { toast.error('Failed to load templates'); }
    finally { setLoading(false); }
  };

  const activateTemplate = async (id: number) => {
    try {
      await api.put(`/templates/${id}/activate`);
      toast.success('Template activated');
      loadTemplates();
    } catch { toast.error('Failed to activate template'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-crud-page">
      <h1 className="admin-page-title">Homepage Templates</h1>
      <p style={{ color: '#8A8A8A', marginBottom: 24 }}>Select which homepage template is active. Switch anytime without redeployment.</p>
      <div className="atm-grid">
        {templates.map((tmpl) => (
          <div key={tmpl.id} className={`atm-card ${tmpl.isActive ? 'active' : ''}`}>
            <div className="atm-preview">
              <div className="atm-preview-placeholder">
                <span className="atm-code">{tmpl.code}</span>
              </div>
            </div>
            <div className="atm-body">
              <div className="atm-header">
                <h3>{tmpl.name}</h3>
                {tmpl.isActive && <span className="atm-badge">Active</span>}
              </div>
              <p className="atm-desc">{tmpl.description}</p>
              <div className="atm-detail">
                <strong>Layout:</strong> {templatePreview[tmpl.code] || 'Custom layout'}
              </div>
              {!tmpl.isActive && (
                <button className="btn btn-primary atm-activate" onClick={() => activateTemplate(tmpl.id)}>
                  <FiCheck /> Activate Template
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .atm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
        .atm-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 2px solid transparent; transition: all 0.3s; }
        .atm-card.active { border-color: #4CAF50; }
        .atm-preview { height: 180px; background: linear-gradient(135deg, #1a1a2e, #16213e); display: flex; align-items: center; justify-content: center; }
        .atm-preview-placeholder { text-align: center; color: rgba(255,255,255,0.3); }
        .atm-code { font-size: 1.2rem; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; }
        .atm-body { padding: 20px; }
        .atm-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .atm-header h3 { font-size: 1.1rem; }
        .atm-badge { padding: 3px 10px; border-radius: 50px; font-size: 11px; font-weight: 600; background: #4CAF5020; color: #4CAF50; }
        .atm-desc { color: #8A8A8A; font-size: 13px; margin-bottom: 12px; }
        .atm-detail { font-size: 13px; color: #555; margin-bottom: 16px; }
        .atm-activate { width: 100%; justify-content: center; }
      `}</style>
    </div>
  );
};

export default AdminTemplates;
