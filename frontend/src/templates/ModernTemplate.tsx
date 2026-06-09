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

const ModernTemplate = ({ home, skills, portfolios, settings }: Props) => (
  <div className="template-modern">
    <AnimatedSection id="home" className="tm-hero">
      <div className="tm-hero-bg">
        <div className="tm-hero-shape tm-shape-1 pulse-glow" />
        <div className="tm-hero-shape tm-shape-2 pulse-glow" />
      </div>
      <div className="container">
        <div className="tm-hero-content">
          <div className="tm-hero-badge" id="about">Available for Projects</div>
          <h1 className="tm-hero-title">{home?.heroTitle || 'Devid Joshua'}</h1>
          <p className="tm-hero-subtitle">{home?.heroSubtitle}</p>
          <div className="tm-hero-actions">
            <Link to="/portfolio/1" className="btn btn-primary"><FiArrowRight /> View Projects</Link>
            <a href="#contact" className="btn btn-outline">Let's Talk</a>
          </div>
          <div className="tm-stats">
            <div className="tm-stat"><strong>{portfolios.length}+</strong><span>Projects</span></div>
            <div className="tm-stat"><strong>{skills.length}+</strong><span>Skills</span></div>
            <div className="tm-stat"><strong>5+</strong><span>Years Exp</span></div>
          </div>
        </div>
      </div>
    </AnimatedSection>

    <AnimatedSection id="skills" className="section">
      <div className="container">
        <div className="text-center"><h2 className="section-title">Skills</h2><p className="section-subtitle">Technologies I work with</p></div>
        <div className="reveal-stagger tm-skills-grid">
          {skills.filter(s => s.isActive).map((skill) => (
            <div key={skill.id} className="tm-skill-card">
              {settings?.showSkillProficiency !== false && (
                <div className="tm-skill-circle" style={{ '--pct': skill.proficiency } as React.CSSProperties}>
                  <svg viewBox="0 0 36 36"><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--border)" strokeWidth="3" /><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="url(#grad)" strokeWidth="3" strokeDasharray={`${skill.proficiency}, 100`} /></svg>
                  <span>{skill.proficiency}%</span>
                </div>
              )}
              <h4>{skill.name}</h4>
              <span className="skill-category">{skill.category}</span>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>

    <AnimatedSection id="portfolio" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="text-center"><h2 className="section-title">Featured Work</h2><p className="section-subtitle">Recent projects</p></div>
        <div className="reveal-stagger tm-portfolio-masonry">
          {portfolios.map((item) => (
            <div key={item.id} className="tm-portfolio-card">
              <div className="tm-portfolio-img"><img src={item.imageUrl || 'https://via.placeholder.com/600x400'} alt={item.title} /></div>
              <div className="tm-portfolio-overlay">
                <span className="tm-portfolio-cat">{item.category?.name || ''}</span>
                <h3>{item.title}</h3>
                <Link to={`/portfolio/${item.id}`} className="btn btn-primary" style={{ padding: '8px 20px', fontSize: 13 }}>View <FiArrowRight /></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>

    <svg width="0" height="0"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="var(--a-1)" /><stop offset="100%" stopColor="var(--a-3)" /></linearGradient></defs></svg>

    <style>{`
      .tm-hero { min-height: 100vh; display: flex; align-items: center; position: relative; overflow: hidden; padding: 120px 0 60px; }
      .tm-hero-bg { position: absolute; inset: 0; overflow: hidden; }
      .tm-hero-shape { position: absolute; border-radius: 50%; opacity: 0.1; transition: transform 0.8s ease; }
      .tm-shape-1 { width: 600px; height: 600px; background: var(--a-1); top: -200px; right: -200px; }
      .tm-shape-2 { width: 400px; height: 400px; background: var(--a-3); bottom: -100px; left: -100px; }
      .tm-hero:hover .tm-shape-1 { transform: translate(20px, -20px) scale(1.05); }
      .tm-hero:hover .tm-shape-2 { transform: translate(-20px, 20px) scale(1.05); }
      .tm-hero-content { position: relative; z-index: 1; text-align: center; max-width: 700px; margin: 0 auto; }
      .tm-hero-badge { display: inline-block; padding: 6px 20px; border-radius: 50px; background: linear-gradient(135deg, var(--a-1), var(--a-3)); color: #fff; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
      .tm-hero-title { font-size: clamp(2.5rem, 5vw, 4rem); margin-bottom: 15px; }
      .tm-hero-subtitle { font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 30px; }
      .tm-hero-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 50px; }
      .tm-stats { display: flex; justify-content: center; gap: 40px; }
      .tm-stat { text-align: center; transition: transform 0.3s ease; }
      .tm-stat:hover { transform: translateY(-5px); }
      .tm-stat strong { display: block; font-size: 2rem; font-family: 'Inter', sans-serif; background: linear-gradient(135deg, var(--a-1), var(--a-3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      .tm-stat span { font-size: 13px; color: var(--text-secondary); }
      .tm-skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 30px; }
      .tm-skill-card { text-align: center; padding: 20px; border-radius: 16px; transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: default; }
      .tm-skill-card:hover { transform: translateY(-8px); box-shadow: 0 15px 40px rgba(0,0,0,0.08); background: var(--card-bg); }
      .tm-skill-circle { width: 100px; height: 100px; margin: 0 auto 12px; position: relative; }
      .tm-skill-circle svg { width: 100%; height: 100%; transform: rotate(-90deg); }
      .tm-skill-circle span { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; }
      .tm-skill-card h4 { font-size: 14px; margin-bottom: 4px; }
      .tm-portfolio-masonry { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
      .tm-portfolio-card { position: relative; border-radius: 16px; overflow: hidden; aspect-ratio: 4/3; cursor: pointer; transition: transform 0.4s ease, box-shadow 0.4s ease; }
      .tm-portfolio-card:hover { transform: translateY(-8px); box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
      .tm-portfolio-img { width: 100%; height: 100%; }
      .tm-portfolio-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
      .tm-portfolio-card:hover img { transform: scale(1.1); }
      .tm-portfolio-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); display: flex; flex-direction: column; justify-content: flex-end; padding: 30px; opacity: 0; transition: opacity 0.4s ease; }
      .tm-portfolio-card:hover .tm-portfolio-overlay { opacity: 1; }
      .tm-portfolio-overlay h3 { color: #fff; margin: 5px 0 15px; }
      .tm-portfolio-cat { font-size: 12px; color: var(--a-1); font-weight: 600; text-transform: uppercase; }
    `}</style>
  </div>
);

export default ModernTemplate;
