import { useState, useEffect } from 'react';
import api from '../../services/api';
import { SiteSetting } from '../../types';
import { toast } from 'react-toastify';
import { FiDownload, FiEye } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const LAYOUTS = [
  { value: 'classic', label: 'Classic', desc: 'Traditional two-column layout' },
  { value: 'modern', label: 'Modern', desc: 'Clean single-column with accent header' },
  { value: 'minimal', label: 'Minimal', desc: 'Minimalist with lots of whitespace' },
];

const AdminCvResume = () => {
  const [settings, setSettings] = useState<SiteSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [resumeLayout, setResumeLayout] = useState('classic');
  const [showEducation, setShowEducation] = useState(true);
  const [showVolunteer, setShowVolunteer] = useState(true);
  const [showPublication, setShowPublication] = useState(true);
  const [showCourse, setShowCourse] = useState(true);
  const [showCertification, setShowCertification] = useState(true);

  useEffect(() => {
    api.get('/site').then((res) => {
      const s = res.data;
      setSettings(s);
      setResumeLayout(s.resumeLayout || 'classic');
      setShowEducation(s.showEducation !== false);
      setShowVolunteer(s.showVolunteer !== false);
      setShowPublication(s.showPublication !== false);
      setShowCourse(s.showCourse !== false);
      setShowCertification(s.showCertification !== false);
    }).catch(() => toast.error('Failed to load settings'))
    .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      await api.put('/site', {
        resumeLayout,
        showEducation,
        showVolunteer,
        showPublication,
        showCourse,
        showCertification,
      });
      toast.success('Resume settings saved');
    } catch {
      toast.error('Failed to save');
    }
  };

  const handlePreview = () => {
    window.open('/cv', '_blank');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-crud-page">
      <div className="admin-crud-header">
        <h1 className="admin-page-title">CV / Resume Settings</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-outline" onClick={handlePreview}><FiEye /> Preview CV</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Settings</button>
        </div>
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title">Resume Layout</h3>
        <p className="admin-card-desc">Choose how your CV/resume will be styled when visitors download it.</p>
        <div className="cv-layouts-grid">
          {LAYOUTS.map((l) => (
            <label key={l.value} className={`cv-layout-option ${resumeLayout === l.value ? 'selected' : ''}`}>
              <input type="radio" name="layout" value={l.value} checked={resumeLayout === l.value}
                onChange={(e) => setResumeLayout(e.target.value)} />
              <div className="cv-layout-preview">
                <div className={`cv-layout-thumb thumb-${l.value}`}>
                  <div className="thumb-header" />
                  <div className="thumb-body">
                    <div className="thumb-line w60" />
                    <div className="thumb-line w40" />
                    <div className="thumb-line w80" />
                  </div>
                </div>
              </div>
              <strong>{l.label}</strong>
              <small>{l.desc}</small>
            </label>
          ))}
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: 24 }}>
        <h3 className="admin-card-title">Frontpage Sections Visibility</h3>
        <p className="admin-card-desc">Toggle which sections appear on the homepage.</p>
        <div className="cv-visibility-grid">
          <label className="cv-visibility-item"><input type="checkbox" checked={showEducation} onChange={(e) => setShowEducation(e.target.checked)} /> Education</label>
          <label className="cv-visibility-item"><input type="checkbox" checked={showVolunteer} onChange={(e) => setShowVolunteer(e.target.checked)} /> Volunteer</label>
          <label className="cv-visibility-item"><input type="checkbox" checked={showPublication} onChange={(e) => setShowPublication(e.target.checked)} /> Publications</label>
          <label className="cv-visibility-item"><input type="checkbox" checked={showCourse} onChange={(e) => setShowCourse(e.target.checked)} /> Courses</label>
          <label className="cv-visibility-item"><input type="checkbox" checked={showCertification} onChange={(e) => setShowCertification(e.target.checked)} /> Certifications</label>
        </div>
      </div>

      <style>{`
        .admin-card { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .admin-card-title { font-size: 1.1rem; margin-bottom: 6px; font-family: 'Inter', sans-serif; }
        .admin-card-desc { color: #8A8A8A; font-size: 13px; margin-bottom: 20px; }
        .cv-layouts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }
        .cv-layout-option {
          display: flex; flex-direction: column; gap: 8px;
          padding: 16px; border: 2px solid #f0f0f0; border-radius: 12px;
          cursor: pointer; transition: all 0.2s;
        }
        .cv-layout-option:hover { border-color: #7152E1; }
        .cv-layout-option.selected { border-color: #FF8473; background: #FFF5F3; }
        .cv-layout-option input { display: none; }
        .cv-layout-option strong { font-size: 14px; }
        .cv-layout-option small { color: #8A8A8A; font-size: 11px; }
        .cv-layout-preview { width: 100%; height: 100px; border-radius: 8px; overflow: hidden; background: #f9f9f9; }
        .cv-layout-thumb { width: 100%; height: 100%; padding: 8px; }
        .thumb-classic { display: flex; gap: 4px; }
        .thumb-classic .thumb-header { width: 30%; background: #1a1a2e; border-radius: 4px; }
        .thumb-classic .thumb-body { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .thumb-modern { display: flex; flex-direction: column; gap: 4px; }
        .thumb-modern .thumb-header { height: 25%; background: linear-gradient(90deg, #FF8473, #7152E1); border-radius: 4px; }
        .thumb-modern .thumb-body { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .thumb-minimal { display: flex; flex-direction: column; gap: 4px; align-items: center; justify-content: center; }
        .thumb-minimal .thumb-header { display: none; }
        .thumb-minimal .thumb-body { display: flex; flex-direction: column; gap: 4px; align-items: center; }
        .thumb-line { height: 6px; background: #e0e0e0; border-radius: 3px; }
        .thumb-line.w40 { width: 40%; }
        .thumb-line.w60 { width: 60%; }
        .thumb-line.w80 { width: 80%; }
        .cv-visibility-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
        .cv-visibility-item {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 16px; background: #f9f9f9; border-radius: 8px;
          cursor: pointer; font-size: 14px; transition: background 0.2s;
        }
        .cv-visibility-item:hover { background: #f0f0f0; }
        .cv-visibility-item input { accent-color: #FF8473; }
      `}</style>
    </div>
  );
};

export default AdminCvResume;
