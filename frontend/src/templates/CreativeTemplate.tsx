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

const CreativeTemplate = ({ home, skills, portfolios, settings }: Props) => (
  <div className="template-creative">
    <AnimatedSection id="home" className="tc-hero">
      <div className="tc-hero-bg-text">{home?.heroTitle?.split(' ').join('\n')}</div>
      <div className="container">
        <div className="tc-hero-content">
          <h1 className="tc-hero-title">{home?.heroTitle}</h1>
          <p className="tc-hero-subtitle" id="about">{home?.heroSubtitle}</p>
          <div className="tc-hero-actions">
            <a href="#portfolio" className="tc-cta">Explore My Work <FiArrowRight /></a>
          </div>
        </div>
      </div>
    </AnimatedSection>

    <AnimatedSection id="portfolio" className="section">
      <div className="container">
        <h2 className="tc-section-title">Creative <span>Projects</span></h2>
        <div className="tc-portfolio">
          {portfolios.map((item, i) => (
            <div key={item.id} className={`tc-project ${i % 2 === 0 ? '' : 'tc-project-reverse'}`}>
              <div className="tc-project-image"><img src={item.imageUrl || 'https://via.placeholder.com/600x400'} alt={item.title} /></div>
              <div className="tc-project-info">
                <span className="tc-project-num">0{i + 1}</span>
                <span className="tc-project-cat">{item.category?.name || ''}</span>
                <h3>{item.title}</h3>
                <p>{item.shortDescription}</p>
                <Link to={`/portfolio/${item.id}`} className="tc-project-btn">View Project <FiArrowRight /></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>

    <style>{`
      .template-creative { font-family: 'Inter', sans-serif; }
      .tc-hero { min-height: 100vh; display: flex; align-items: center; position: relative; overflow: hidden; padding: 120px 0 60px; }
      .tc-hero-bg-text { position: absolute; font-size: clamp(6rem, 15vw, 15rem); font-weight: 900; color: var(--border); line-height: 0.9; white-space: pre-line; right: -5%; top: 50%; transform: translateY(-50%); opacity: 0.3; pointer-events: none; user-select: none; transition: all 0.8s ease; }
      .tc-hero:hover .tc-hero-bg-text { opacity: 0.15; transform: translateY(-50%) scale(1.02); }
      .tc-hero-content { position: relative; z-index: 1; max-width: 600px; }
      .tc-hero-title { font-size: clamp(3rem, 6vw, 5rem); font-weight: 900; letter-spacing: -0.03em; margin-bottom: 20px; }
      .tc-hero-subtitle { color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 30px; }
      .tc-cta { display: inline-flex; align-items: center; gap: 10px; padding: 16px 40px; background: var(--text); color: var(--bg); border-radius: 50px; font-weight: 600; font-size: 14px; transition: all 0.3s; }
      .tc-cta:hover { background: var(--a-1); transform: translateY(-2px); gap: 14px; }
      .tc-section-title { font-size: 3rem; font-weight: 300; margin-bottom: 60px; }
      .tc-section-title span { font-weight: 900; }
      .tc-portfolio { display: flex; flex-direction: column; gap: 100px; }
      .tc-project { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; transition: all 0.4s ease; }
      .tc-project:hover { transform: translateY(-8px); }
      .tc-project-reverse { direction: rtl; }
      .tc-project-reverse > * { direction: ltr; }
      .tc-project-image { border-radius: 20px; overflow: hidden; background: var(--bg-secondary); transition: transform 0.5s ease, box-shadow 0.5s ease; }
      .tc-project-image img { width: 100%; display: block; transition: transform 0.6s ease; }
      .tc-project:hover .tc-project-image img { transform: scale(1.05); }
      .tc-project:hover .tc-project-image { box-shadow: 0 20px 60px rgba(0,0,0,0.12); }
      .tc-project-num { font-size: 5rem; font-weight: 900; color: var(--border); line-height: 1; display: block; margin-bottom: 10px; transition: color 0.3s; }
      .tc-project:hover .tc-project-num { color: var(--a-1); }
      .tc-project-cat { font-size: 12px; color: var(--a-1); font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }
      .tc-project-info h3 { font-size: 1.8rem; margin: 10px 0; }
      .tc-project-info p { color: var(--text-secondary); margin-bottom: 20px; }
      .tc-project-btn { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; color: var(--a-1); transition: gap 0.3s; }
      .tc-project-btn:hover { color: var(--a-3); gap: 12px; }
      @media (max-width: 768px) {
        .tc-project, .tc-project-reverse { grid-template-columns: 1fr; gap: 30px; direction: ltr; }
      }
    `}</style>
  </div>
);

export default CreativeTemplate;
