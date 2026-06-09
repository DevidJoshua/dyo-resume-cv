import { HomeSetting, Skill, Portfolio, SiteSetting } from '../types';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTerminal, FiCode } from 'react-icons/fi';
import AnimatedSection from '../components/common/AnimatedSection';

interface Props {
  home: HomeSetting | null;
  skills: Skill[];
  portfolios: Portfolio[];
  settings: SiteSetting | null;
}

const DeveloperTemplate = ({ home, skills, portfolios, settings }: Props) => (
  <div className="template-developer">
    <AnimatedSection id="home" className="td-hero">
      <div className="container">
        <div className="td-hero-grid">
          <div className="td-hero-code floating">
            <div className="td-code-window">
              <div className="td-code-header">
                <span className="td-dot red" /><span className="td-dot yellow" /><span className="td-dot green" />
                <span className="td-code-title">developer.ts</span>
              </div>
              <pre className="td-code-body">{`const developer = {
  name: '${home?.heroTitle || 'Devid Joshua'}',
  role: '${home?.heroSubtitle || 'Software Engineer'}',
  skills: [${skills.filter(s => s.isActive).slice(0, 4).map(s => `'${s.name}'`).join(', ')}],
  status: 'available'
};

console.log(developer);`}</pre>
            </div>
          </div>
          <div className="td-hero-text">
            <div className="td-prompt"><FiTerminal /> <span>$ whoami</span></div>
            <h1 className="td-title">{home?.heroTitle}</h1>
            <p className="td-subtitle" id="about">{home?.heroSubtitle}</p>
            <div className="td-hero-actions">
              <Link to="/portfolio/1" className="btn btn-primary"><FiCode /> View Code</Link>
              <a href="#contact" className="btn btn-outline">Contact</a>
            </div>
            <div className="td-tech-strip">
              {['TypeScript', 'Node.js', 'React', 'Go', 'Docker', 'K8s'].map(t => <span key={t}>{t}</span>)}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>

    <AnimatedSection id="skills" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="td-section-header">
          <FiCode /> <span>// skills</span>
        </div>
        <div className="reveal-stagger td-skills-grid">
          {skills.filter(s => s.isActive).map((skill) => (
            <div key={skill.id} className="td-skill-card">
              <div className="td-skill-top">
                <span className="td-skill-name">{skill.name}</span>
                {settings?.showSkillProficiency !== false && <span className="td-skill-pct">{skill.proficiency}%</span>}
              </div>
              {settings?.showSkillProficiency !== false && (
                <div className="skill-bar"><div className="skill-bar-fill" style={{ width: `${skill.proficiency}%` }} /></div>
              )}
              {skill.category && <span className="td-skill-cat">// {skill.category}</span>}
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>

    <AnimatedSection id="portfolio" className="section">
      <div className="container">
        <div className="td-section-header">
          <FiTerminal /> <span>// projects</span>
        </div>
        <div className="reveal-stagger td-projects">
          {portfolios.map((item) => (
            <div key={item.id} className="td-project-card">
              <div className="td-project-header">
                <span className="td-project-icon">&gt;</span>
                <h3>{item.title}</h3>
              </div>
              <p className="td-project-desc">{item.shortDescription}</p>
              {item.technologies && item.technologies.length > 0 && (
                <div className="td-project-tech">
                  {item.technologies.map((t: any) => <span key={t.id || t.technologyName} className="td-tech-tag">{t.technologyName || t}</span>)}
                </div>
              )}
              <Link to={`/portfolio/${item.id}`} className="td-project-link">cd project/{item.id} <FiArrowRight /></Link>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>

    <style>{`
      .template-developer { font-family: 'Inter', 'Fira Code', monospace; }
      .td-hero { min-height: 100vh; display: flex; align-items: center; padding: 120px 0 60px; }
      .td-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
      .td-code-window { background: #1a1a2e; border-radius: 12px; overflow: hidden; font-family: 'Fira Code', monospace; color: #fff; font-size: 13px; transition: transform 0.4s ease, box-shadow 0.4s ease; }
      .td-code-window:hover { transform: translateY(-5px); box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
      .td-code-header { display: flex; align-items: center; gap: 6px; padding: 12px 16px; background: #16162a; }
      .td-dot { width: 10px; height: 10px; border-radius: 50%; }
      .td-dot.red { background: #ff5f56; }
      .td-dot.yellow { background: #ffbd2e; }
      .td-dot.green { background: #27c93f; }
      .td-code-title { flex: 1; text-align: center; font-size: 12px; color: #8A8A8A; }
      .td-code-body { padding: 20px; line-height: 1.8; white-space: pre; overflow-x: auto; color: #a0a0c0; }
      .td-prompt { display: flex; align-items: center; gap: 8px; font-family: 'Fira Code', monospace; color: var(--a-1); font-size: 14px; margin-bottom: 15px; }
      .td-title { font-size: clamp(2.5rem, 5vw, 4rem); margin-bottom: 10px; }
      .td-subtitle { color: var(--text-secondary); margin-bottom: 30px; }
      .td-hero-actions { display: flex; gap: 16px; margin-bottom: 30px; }
      .td-tech-strip { display: flex; gap: 8px; flex-wrap: wrap; }
      .td-tech-strip span { padding: 4px 12px; border-radius: 4px; background: var(--bg-secondary); font-size: 11px; font-family: 'Fira Code', monospace; transition: all 0.3s; }
      .td-tech-strip span:hover { background: var(--a-1); color: #fff; }
      .td-section-header { display: flex; align-items: center; gap: 10px; font-family: 'Fira Code', monospace; color: var(--a-1); font-size: 1.2rem; margin-bottom: 30px; }
      .td-skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
      .td-skill-card { padding: 20px; background: var(--card-bg); border: 1px solid var(--border); border-radius: 8px; transition: all 0.3s ease; }
      .td-skill-card:hover { border-color: var(--a-1); transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.06); }
      .td-skill-top { display: flex; justify-content: space-between; margin-bottom: 10px; }
      .td-skill-name { font-family: 'Fira Code', monospace; font-size: 13px; }
      .td-skill-pct { color: var(--a-1); font-weight: 600; font-size: 13px; }
      .td-skill-cat { font-size: 11px; color: var(--text-secondary); font-family: 'Fira Code', monospace; display: block; margin-top: 8px; }
      .td-projects { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
      .td-project-card { padding: 24px; background: var(--card-bg); border: 1px solid var(--border); border-radius: 8px; transition: all 0.3s ease; }
      .td-project-card:hover { border-color: var(--a-1); transform: translateY(-5px); box-shadow: 0 10px 40px rgba(0,0,0,0.08); }
      .td-project-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
      .td-project-icon { color: var(--a-1); font-family: 'Fira Code', monospace; font-weight: 700; }
      .td-project-header h3 { font-size: 1.1rem; }
      .td-project-desc { color: var(--text-secondary); font-size: 13px; margin-bottom: 15px; }
      .td-project-tech { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 15px; }
      .td-tech-tag { padding: 2px 8px; background: var(--bg-secondary); border-radius: 3px; font-size: 10px; font-family: 'Fira Code', monospace; transition: background 0.3s; }
      .td-project-card:hover .td-tech-tag { background: var(--a-1); color: #fff; }
      .td-project-link { display: inline-flex; align-items: center; gap: 6px; font-family: 'Fira Code', monospace; font-size: 12px; color: var(--a-1); transition: gap 0.3s; }
      .td-project-link:hover { color: var(--a-3); gap: 10px; }
      @media (max-width: 768px) {
        .td-hero-grid { grid-template-columns: 1fr; }
        .td-hero-code { order: -1; }
        .td-projects { grid-template-columns: 1fr; }
      }
    `}</style>
  </div>
);

export default DeveloperTemplate;
