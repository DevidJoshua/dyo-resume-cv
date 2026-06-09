import { useState, useEffect } from 'react';
import api from '../services/api';
import { HomeSetting, SiteSetting } from '../types';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const AboutPage = () => {
  const [home, setHome] = useState<HomeSetting | null>(null);
  const [settings, setSettings] = useState<SiteSetting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/home'), api.get('/site')])
      .then(([h, s]) => { setHome(h.data); setSettings(s.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar layoutMode="multiple" /><LoadingSpinner /><Footer /></>;

  return (
    <>
      <Navbar layoutMode="multiple" />
      <main>
        <section className="mp-section">
          <div className="container">
            <div className="mp-header">
              <h1 className="section-title">About Me</h1>
              <p className="section-subtitle">Get to know me better</p>
            </div>
            <div className="mp-about-grid">
              <div className="mp-about-image">
                <div className="mp-about-frame">
                  <img src={home?.profileImage || 'https://via.placeholder.com/500'} alt={home?.heroTitle || ''} />
                </div>
              </div>
              <div className="mp-about-text">
                <h2>{home?.heroTitle || 'Devid Joshua'}</h2>
                <p className="mp-about-role">{home?.heroSubtitle}</p>
                <div className="mp-about-desc">
                  {(home?.aboutText || '').split('\n').map((p, i) => <p key={i}>{p}</p>)}
                </div>
                <div className="about-info">
                  <div className="about-info-item"><FiMapPin /> <span>Remote / Worldwide</span></div>
                  {settings?.email && <div className="about-info-item"><FiMail /> <span>{settings.email}</span></div>}
                  {settings?.phone && <div className="about-info-item"><FiPhone /> <span>{settings.phone}</span></div>}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <style>{`
        .mp-section { padding: 140px 0 80px; }
        .mp-header { text-align: center; margin-bottom: 50px; }
        .mp-about-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 60px; align-items: center; }
        .mp-about-frame { border-radius: 20px; overflow: hidden; background: var(--bg-secondary); }
        .mp-about-frame img { width: 100%; display: block; }
        .mp-about-text h2 { font-size: 2rem; margin-bottom: 8px; }
        .mp-about-role { color: var(--a-1); font-weight: 500; margin-bottom: 20px; }
        .mp-about-desc p { color: var(--text-secondary); line-height: 1.8; margin-bottom: 12px; }
        .about-info { margin-top: 25px; display: flex; flex-direction: column; gap: 12px; }
        .about-info-item { display: flex; align-items: center; gap: 10px; font-size: 14px; }
        .about-info-item svg { color: var(--a-1); }
        @media (max-width: 768px) {
          .mp-about-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
};

export default AboutPage;
