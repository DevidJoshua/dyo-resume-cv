import { useState, useEffect } from 'react';
import api from '../../services/api';
import { HomeSetting, SiteSetting } from '../../types';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminSettings = () => {
  const [home, setHome] = useState<HomeSetting | null>(null);
  const [site, setSite] = useState<SiteSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [homeForm, setHomeForm] = useState({
    heroTitle: '', heroSubtitle: '', profileImage: '', backgroundImage: '',
    ctaText: '', ctaUrl: '', aboutText: ''
  });

  const [siteForm, setSiteForm] = useState({
    siteName: '', primaryColor: '#FF8473', secondaryColor: '#7152E1',
    darkModeEnabled: false, instagramEnabled: false, instagramPostLimit: 6,
    layoutMode: 'single',
    showSkillProficiency: true,
    enablePages: true,
    resumeLayout: 'classic',
    showEducation: true,
    showVolunteer: true,
    showPublication: true,
    showCourse: true,
    showCertification: true,
    email: '', phone: '', whatsapp: '', linkedinUrl: '', githubUrl: ''
  });

  useEffect(() => {
    Promise.all([api.get('/home'), api.get('/site')])
      .then(([h, s]) => {
        const hd = h.data;
        const sd = s.data;
        setHome(hd);
        setSite(sd);
        setHomeForm({
          heroTitle: hd.heroTitle || '', heroSubtitle: hd.heroSubtitle || '',
          profileImage: hd.profileImage || '', backgroundImage: hd.backgroundImage || '',
          ctaText: hd.ctaText || '', ctaUrl: hd.ctaUrl || '', aboutText: hd.aboutText || ''
        });
        setSiteForm({
          siteName: sd.siteName || '', primaryColor: sd.primaryColor || '#FF8473',
          secondaryColor: sd.secondaryColor || '#7152E1',
          darkModeEnabled: sd.darkModeEnabled || false,
          instagramEnabled: sd.instagramEnabled || false,
          instagramPostLimit: sd.instagramPostLimit || 6,
          layoutMode: sd.layoutMode || 'single',
          showSkillProficiency: sd.showSkillProficiency !== false,
          enablePages: sd.enablePages !== false,
          resumeLayout: sd.resumeLayout || 'classic',
          showEducation: sd.showEducation !== false,
          showVolunteer: sd.showVolunteer !== false,
          showPublication: sd.showPublication !== false,
          showCourse: sd.showCourse !== false,
          showCertification: sd.showCertification !== false,
          email: sd.email || '', phone: sd.phone || '', whatsapp: sd.whatsapp || '',
          linkedinUrl: sd.linkedinUrl || '', githubUrl: sd.githubUrl || ''
        });
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const saveHome = async () => {
    setSaving(true);
    try {
      await api.put('/home', homeForm);
      toast.success('Home settings saved');
    } catch { toast.error('Failed to save home settings'); }
    finally { setSaving(false); }
  };

  const saveSite = async () => {
    setSaving(true);
    try {
      await api.put('/site', siteForm);
      toast.success('Site settings saved');
    } catch { toast.error('Failed to save site settings'); }
    finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-crud-page">
      <h1 className="admin-page-title">Settings</h1>
      <div className="admin-settings-grid">
        <div className="admin-settings-card">
          <h2>Home Page Settings</h2>
          <div className="form-group">
            <label>Hero Title</label>
            <input className="form-input" value={homeForm.heroTitle} onChange={(e) => setHomeForm({ ...homeForm, heroTitle: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Hero Subtitle</label>
            <input className="form-input" value={homeForm.heroSubtitle} onChange={(e) => setHomeForm({ ...homeForm, heroSubtitle: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Profile Image URL</label>
            <input className="form-input" value={homeForm.profileImage} onChange={(e) => setHomeForm({ ...homeForm, profileImage: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Background Image URL</label>
            <input className="form-input" value={homeForm.backgroundImage} onChange={(e) => setHomeForm({ ...homeForm, backgroundImage: e.target.value })} />
          </div>
          <div className="grid-2" style={{ gap: 16 }}>
            <div className="form-group">
              <label>CTA Button Text</label>
              <input className="form-input" value={homeForm.ctaText} onChange={(e) => setHomeForm({ ...homeForm, ctaText: e.target.value })} />
            </div>
            <div className="form-group">
              <label>CTA Button URL</label>
              <input className="form-input" value={homeForm.ctaUrl} onChange={(e) => setHomeForm({ ...homeForm, ctaUrl: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>About Text</label>
            <textarea className="form-textarea" rows={5} value={homeForm.aboutText} onChange={(e) => setHomeForm({ ...homeForm, aboutText: e.target.value })} />
          </div>
          <button className="btn btn-primary" onClick={saveHome} disabled={saving}>{saving ? 'Saving...' : 'Save Home Settings'}</button>
        </div>

        <div className="admin-settings-card">
          <h2>Site Settings</h2>
          <div className="form-group">
            <label>Site Name</label>
            <input className="form-input" value={siteForm.siteName} onChange={(e) => setSiteForm({ ...siteForm, siteName: e.target.value })} />
          </div>
          <div className="grid-2" style={{ gap: 16 }}>
            <div className="form-group">
              <label>Primary Color</label>
              <input type="color" className="form-input" value={siteForm.primaryColor} onChange={(e) => setSiteForm({ ...siteForm, primaryColor: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Secondary Color</label>
              <input type="color" className="form-input" value={siteForm.secondaryColor} onChange={(e) => setSiteForm({ ...siteForm, secondaryColor: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" checked={siteForm.darkModeEnabled} onChange={(e) => setSiteForm({ ...siteForm, darkModeEnabled: e.target.checked })} />
              {' '}Dark Mode Default
            </label>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" checked={siteForm.instagramEnabled} onChange={(e) => setSiteForm({ ...siteForm, instagramEnabled: e.target.checked })} />
              {' '}Enable Instagram Section
            </label>
          </div>
          <div className="form-group">
            <label>Instagram Post Limit</label>
            <input type="number" className="form-input" value={siteForm.instagramPostLimit} onChange={(e) => setSiteForm({ ...siteForm, instagramPostLimit: Number(e.target.value) })} />
          </div>
          <div className="form-group">
            <label>Layout Mode</label>
            <div style={{ display: 'flex', gap: 20, marginTop: 6 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="radio" name="layoutMode" value="single" checked={siteForm.layoutMode === 'single'} onChange={(e) => setSiteForm({ ...siteForm, layoutMode: e.target.value })} />
                Single Page (all sections on one page)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="radio" name="layoutMode" value="multiple" checked={siteForm.layoutMode === 'multiple'} onChange={(e) => setSiteForm({ ...siteForm, layoutMode: e.target.value })} />
                Multiple Pages (each section on its own page)
              </label>
            </div>
            <small style={{ color: '#8A8A8A', display: 'block', marginTop: 4 }}>Changes apply immediately without redeployment.</small>
          </div>
          <div className="form-group" style={{ borderTop: '1px solid #eee', paddingTop: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 12 }}>
              <input type="checkbox" checked={siteForm.showSkillProficiency} onChange={(e) => setSiteForm({ ...siteForm, showSkillProficiency: e.target.checked })} />
              Show Skill Proficiency (bars & percentages)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={siteForm.enablePages} onChange={(e) => setSiteForm({ ...siteForm, enablePages: e.target.checked })} />
              Enable Dynamic Pages
            </label>
          </div>
          <h3 style={{ margin: '20px 0 16px', fontSize: '1rem' }}>Contact Information</h3>
          <div className="grid-2" style={{ gap: 16 }}>
            <div className="form-group">
              <label>Email</label>
              <input className="form-input" value={siteForm.email} onChange={(e) => setSiteForm({ ...siteForm, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input className="form-input" value={siteForm.phone} onChange={(e) => setSiteForm({ ...siteForm, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label>WhatsApp</label>
              <input className="form-input" value={siteForm.whatsapp} onChange={(e) => setSiteForm({ ...siteForm, whatsapp: e.target.value })} />
            </div>
            <div className="form-group">
              <label>LinkedIn URL</label>
              <input className="form-input" value={siteForm.linkedinUrl} onChange={(e) => setSiteForm({ ...siteForm, linkedinUrl: e.target.value })} />
            </div>
            <div className="form-group">
              <label>GitHub URL</label>
              <input className="form-input" value={siteForm.githubUrl} onChange={(e) => setSiteForm({ ...siteForm, githubUrl: e.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={saveSite} disabled={saving} style={{ marginTop: 8 }}>{saving ? 'Saving...' : 'Save Site Settings'}</button>
        </div>
      </div>
      <style>{`
        .admin-settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
        .admin-settings-card {
          background: #fff; border-radius: 12px; padding: 28px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .admin-settings-card h2 { font-size: 1.2rem; margin-bottom: 20px; font-family: 'Inter', sans-serif; }
        .admin-settings-card .form-group { margin-bottom: 16px; }
        input[type="color"] { padding: 4px; height: 40px; cursor: pointer; }
        @media (max-width: 992px) {
          .admin-settings-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AdminSettings;
