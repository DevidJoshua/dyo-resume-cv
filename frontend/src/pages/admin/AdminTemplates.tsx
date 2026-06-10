import { useState, useEffect } from 'react';
import api from '../../services/api';
import { HomepageTemplate } from '../../types';
import { toast } from 'react-toastify';
import { FiCheck, FiEye, FiHelpCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
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
  const [showHelp, setShowHelp] = useState(false);

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
      <div className="admin-crud-header">
        <h1 className="admin-page-title">Homepage Templates</h1>
        <button className="btn btn-outline" onClick={() => setShowHelp(!showHelp)} style={{ fontSize: 13 }}>
          <FiHelpCircle /> {showHelp ? 'Hide' : 'Show'} Documentation
        </button>
      </div>
      <p className="admin-subtitle">Select which homepage template is active. Switch anytime without redeployment.</p>

      {showHelp && (
        <div className="atm-help">
          <h3><FiHelpCircle /> About Homepage Templates</h3>
          <p>Homepage templates control how your portfolio homepage looks and feels. Each template has a unique visual style, layout, and content arrangement.</p>
          <h4>How to switch templates</h4>
          <ol>
            <li>Browse the available templates below.</li>
            <li>Click <strong>Activate Template</strong> on the one you want.</li>
            <li>Changes take effect immediately — no code changes or redeployment needed.</li>
          </ol>
          <h4>Available Templates</h4>
          <div className="atm-help-grid">
            <div className="atm-help-card">
              <strong>Professional</strong>
              <small>Clean professional layout with focus on experience and skills. Features a hero section, skill bars, and timeline for experience. Suitable for corporate and traditional portfolios.</small>
            </div>
            <div className="atm-help-card">
              <strong>Modern</strong>
              <small>Bold modern design with full-width sections, circular skill indicators, gradient shapes, and overlay portfolio cards. Best for creative professionals and designers.</small>
            </div>
            <div className="atm-help-card">
              <strong>Minimalist</strong>
              <small>Simple, clean, and minimal design. Focuses on content with a centered layout, project list, and minimal contact section. Ideal for artists and photographers.</small>
            </div>
            <div className="atm-help-card">
              <strong>Creative</strong>
              <small>Creative layout with large background typography, alternating project layouts, and bold visual hierarchy. Great for storytellers and content creators.</small>
            </div>
            <div className="atm-help-card">
              <strong>Developer</strong>
              <small>Developer-themed design with code window hero, terminal-style headings, monospace fonts, and tech badges. Perfect for software engineers and developers.</small>
            </div>
          </div>
          <h4>Customization</h4>
          <p>While the template defines the overall layout and styling, you can customize the content through the <a href="/admin/settings">Settings</a> page. This includes hero text, profile image, colors, and feature toggles.</p>
        </div>
      )}

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
        .atm-help {
          background: #fff; border-radius: 12px; padding: 28px; margin-bottom: 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05); border-left: 4px solid #7152E1;
        }
        .atm-help h3 { font-size: 1.15rem; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .atm-help h4 { font-size: 0.95rem; margin: 20px 0 8px; color: #555; }
        .atm-help p, .atm-help li { color: #666; font-size: 14px; line-height: 1.7; }
        .atm-help ol { padding-left: 20px; margin: 8px 0; }
        .atm-help ol li { margin-bottom: 4px; }
        .atm-help a { color: #7152E1; text-decoration: underline; }
        .atm-help-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; margin: 12px 0; }
        .atm-help-card {
          background: #f9f9f9; border-radius: 8px; padding: 14px 16px;
          border: 1px solid #f0f0f0;
        }
        .atm-help-card strong { display: block; font-size: 14px; margin-bottom: 4px; color: #333; }
        .atm-help-card small { color: #8A8A8A; font-size: 12px; line-height: 1.5; display: block; }
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
