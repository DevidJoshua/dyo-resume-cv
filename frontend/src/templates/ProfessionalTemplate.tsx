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

const ProfessionalTemplate = ({ home, skills, portfolios, settings }: Props) => (
  <div className="template-professional">
    <AnimatedSection id="home" className="tp-hero">
      <div className="container">
        <div className="tp-hero-grid">
          <div className="tp-hero-text">
            <span className="tp-greeting">Hello, I'm</span>
            <h1>{home?.heroTitle || 'Devid Joshua'}</h1>
            <p className="tp-subtitle">{home?.heroSubtitle}</p>
            <p className="tp-bio" id="about">{home?.aboutText?.substring(0, 200)}</p>
            <div className="tp-hero-actions">
              {home?.ctaText && <Link to={home.ctaUrl || '/portfolio'} className="btn btn-primary">{home.ctaText} <FiArrowRight /></Link>}
              <a href="#contact" className="btn btn-outline">Contact Me</a>
            </div>
          </div>
          <div className="tp-hero-image floating">
            <div className="tp-img-frame">
              <img src={home?.profileImage || 'https://via.placeholder.com/400'} alt={home?.heroTitle || ''} />
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>

    <AnimatedSection id="skills" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <h2 className="section-title">Professional Skills</h2>
        <div className="reveal-stagger tp-skills-bar">
          {skills.filter(s => s.isActive).slice(0, 8).map((skill) => (
            <div key={skill.id} className="tp-skill-bar-item">
              <div className="tp-skill-bar-header">
                <span>{skill.name}</span>
                {settings?.showSkillProficiency !== false && <span>{skill.proficiency}%</span>}
              </div>
              {settings?.showSkillProficiency !== false && (
                <div className="skill-bar"><div className="skill-bar-fill" style={{ width: `${skill.proficiency}%` }} /></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>

    <AnimatedSection id="portfolio" className="section">
      <div className="container">
        <h2 className="section-title">Experience & Projects</h2>
        <div className="tp-timeline">
          {portfolios.map((item, i) => (
            <div key={item.id} className={`tp-timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
              <div className="tp-timeline-content card">
                <span className="tp-timeline-cat">{item.category?.name || 'Project'}</span>
                <h3>{item.title}</h3>
                <p>{item.shortDescription}</p>
                {item.technologies && item.technologies.length > 0 && (
                  <div className="tp-tech">
                    {item.technologies.map((t: any) => <span key={t.id || t.technologyName} className="tech-badge">{t.technologyName || t}</span>)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>

    <style>{`
      .template-professional { font-family: 'Inter', sans-serif; }
      .tp-hero { min-height: 100vh; display: flex; align-items: center; padding: 120px 0 60px; }
      .tp-hero-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 60px; align-items: center; }
      .tp-greeting { color: var(--a-1); font-weight: 600; font-size: 1.1rem; display: block; margin-bottom: 10px; }
      .tp-hero-text h1 { font-size: clamp(2.5rem, 5vw, 4rem); margin-bottom: 15px; }
      .tp-subtitle { color: var(--text-secondary); font-size: 1.2rem; margin-bottom: 20px; }
      .tp-bio { color: var(--text-secondary); line-height: 1.8; margin-bottom: 30px; }
      .tp-hero-actions { display: flex; gap: 16px; flex-wrap: wrap; }
      .tp-img-frame { width: 100%; max-width: 400px; aspect-ratio: 1; border-radius: 20px; overflow: hidden; margin: 0 auto; background: var(--bg-secondary); box-shadow: 0 20px 60px rgba(0,0,0,0.08); transition: transform 0.4s ease, box-shadow 0.4s ease; }
      .tp-img-frame:hover { transform: scale(1.03); box-shadow: 0 30px 80px rgba(0,0,0,0.12); }
      .tp-img-frame img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
      .tp-img-frame:hover img { transform: scale(1.05); }
      .tp-skills-bar { display: flex; flex-direction: column; gap: 16px; max-width: 700px; margin: 0 auto; }
      .tp-skill-bar-item { transition: transform 0.3s ease; }
      .tp-skill-bar-item:hover { transform: translateX(8px); }
      .tp-skill-bar-header { display: flex; justify-content: space-between; font-size: 14px; font-weight: 500; margin-bottom: 6px; }
      .tp-timeline { position: relative; max-width: 900px; margin: 0 auto; padding: 20px 0; }
      .tp-timeline::before { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: var(--border); transform: translateX(-50%); }
      .tp-timeline-item { position: relative; width: 50%; padding: 20px 40px; transition: transform 0.3s ease; }
      .tp-timeline-item:hover { transform: translateY(-4px); }
      .tp-timeline-item.left { left: 0; text-align: right; }
      .tp-timeline-item.right { left: 50%; text-align: left; }
      .tp-timeline-item::before { content: ''; position: absolute; top: 30px; width: 14px; height: 14px; border-radius: 50%; background: var(--a-1); border: 3px solid var(--bg); transition: transform 0.3s ease, box-shadow 0.3s ease; }
      .tp-timeline-item:hover::before { transform: scale(1.4); box-shadow: 0 0 20px var(--a-1); }
      .tp-timeline-item.left::before { right: -7px; }
      .tp-timeline-item.right::before { left: -7px; }
      .tp-timeline-cat { font-size: 12px; color: var(--a-1); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
      .tp-timeline-content { transition: transform 0.3s ease, box-shadow 0.3s ease; }
      .tp-timeline-content:hover { transform: translateY(-5px); box-shadow: 0 15px 50px rgba(0,0,0,0.1); }
      .tp-timeline-content h3 { margin: 8px 0; }
      .tp-timeline-content p { color: var(--text-secondary); font-size: 14px; }
      .tp-tech { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 12px; justify-content: flex-start; }
      .tp-timeline-item.left .tp-tech { justify-content: flex-end; }
      @media (max-width: 768px) {
        .tp-hero-grid { grid-template-columns: 1fr; text-align: center; }
        .tp-hero-actions { justify-content: center; }
        .tp-hero-image { order: -1; }
        .tp-timeline-item, .tp-timeline-item.left, .tp-timeline-item.right { width: 100%; left: 0; text-align: left; padding-left: 40px; }
        .tp-timeline::before { left: 20px; }
        .tp-timeline-item::before, .tp-timeline-item.left::before, .tp-timeline-item.right::before { left: 13px !important; right: auto !important; }
        .tp-timeline-item.left .tp-tech { justify-content: flex-start; }
      }
    `}</style>
  </div>
);

export default ProfessionalTemplate;
