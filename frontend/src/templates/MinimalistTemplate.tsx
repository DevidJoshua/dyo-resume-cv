import { HomeSetting, Skill, Portfolio, SiteSetting } from '../types';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import AnimatedSection from '../components/common/AnimatedSection';

interface Props {
  home: HomeSetting | null;
  skills: Skill[];
  portfolios: Portfolio[];
  settings: SiteSetting | null;
}

const MinimalistTemplate = ({ home, skills, portfolios, settings }: Props) => (
  <div className="template-minimalist">
    <AnimatedSection id="home" className="tmin-hero">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="tmin-hero-content">
          <div className="tmin-avatar floating">
            <img src={home?.profileImage || 'https://via.placeholder.com/200'} alt="" />
          </div>
          <h1 className="tmin-title">{home?.heroTitle || 'Devid Joshua'}</h1>
          <p className="tmin-subtitle">{home?.heroSubtitle}</p>
          <div className="tmin-hero-actions" id="about">
            <a href="#portfolio" className="tmin-link">Selected Work <FiArrowRight /></a>
            <a href="#contact" className="tmin-link">Get in Touch <FiArrowRight /></a>
          </div>
        </div>
      </div>
    </AnimatedSection>

    <AnimatedSection id="portfolio" className="tmin-work">
      <div className="container" style={{ maxWidth: 800 }}>
        <h2 className="tmin-section-title">Selected Projects</h2>
        {portfolios.map((item) => (
          <div key={item.id} className="tmin-project">
            <div className="tmin-project-info">
              <span className="tmin-project-cat">{item.category?.name || ''}</span>
              <h3>{item.title}</h3>
              <p>{item.shortDescription}</p>
            </div>
            <Link to={`/portfolio/${item.id}`} className="tmin-project-link"><FiArrowRight /></Link>
          </div>
        ))}
      </div>
    </AnimatedSection>

    <AnimatedSection id="contact" className="tmin-contact">
      <div className="container" style={{ maxWidth: 800, textAlign: 'center' }}>
        <h2 className="tmin-section-title">Contact</h2>
        <p className="tmin-contact-text">Have a project in mind? Let's work together.</p>
        {settings?.email && <a href={`mailto:${settings.email}`} className="tmin-email">{settings.email}</a>}
      </div>
    </AnimatedSection>

    <style>{`
      .template-minimalist { font-family: 'Inter', sans-serif; }
      .tmin-hero { min-height: 100vh; display: flex; align-items: center; padding: 120px 0 60px; }
      .tmin-hero-content { text-align: center; }
      .tmin-avatar { width: 120px; height: 120px; border-radius: 50%; overflow: hidden; margin: 0 auto 30px; background: var(--bg-secondary); }
      .tmin-avatar img { width: 100%; height: 100%; object-fit: cover; }
      .tmin-title { font-size: clamp(2rem, 4vw, 3rem); font-weight: 300; margin-bottom: 15px; letter-spacing: -0.02em; }
      .tmin-subtitle { color: var(--text-secondary); font-size: 1.1rem; font-weight: 300; margin-bottom: 40px; }
      .tmin-hero-actions { display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; }
      .tmin-link { display: inline-flex; align-items: center; gap: 8px; font-weight: 500; font-size: 14px; color: var(--text); border-bottom: 1px solid var(--text); padding-bottom: 4px; transition: all 0.3s; }
      .tmin-link:hover { color: var(--a-1); border-color: var(--a-1); gap: 12px; }
      .tmin-section-title { font-size: 1.5rem; font-weight: 300; margin-bottom: 40px; letter-spacing: -0.02em; }
      .tmin-work { padding: 100px 0; }
      .tmin-project { display: flex; justify-content: space-between; align-items: flex-start; padding: 30px 0; border-bottom: 1px solid var(--border); gap: 20px; transition: all 0.3s ease; }
      .tmin-project:first-of-type { border-top: 1px solid var(--border); }
      .tmin-project:hover { padding-left: 20px; border-color: var(--a-1); }
      .tmin-project-cat { font-size: 12px; color: var(--a-1); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
      .tmin-project-info h3 { margin: 8px 0; font-size: 1.2rem; font-weight: 500; }
      .tmin-project-info p { color: var(--text-secondary); font-size: 14px; }
      .tmin-project-link { font-size: 24px; color: var(--text-secondary); transition: all 0.3s; flex-shrink: 0; margin-top: 8px; }
      .tmin-project-link:hover { color: var(--a-1); transform: translateX(5px); }
      .tmin-contact { padding: 100px 0; }
      .tmin-contact-text { color: var(--text-secondary); margin-bottom: 20px; }
      .tmin-email { font-size: 1.5rem; font-weight: 300; color: var(--a-1); border-bottom: 1px solid var(--a-1); padding-bottom: 2px; transition: border-color 0.3s; }
      .tmin-email:hover { border-color: transparent; }
    `}</style>
  </div>
);

export default MinimalistTemplate;
