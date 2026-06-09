import { useState, useEffect } from 'react';
import api from '../services/api';
import { Skill } from '../types';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SkillsPage = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [showProficiency, setShowProficiency] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/skills'),
      api.get('/site')
    ]).then(([s, st]) => {
      setSkills(s.data);
      if (st.data.showSkillProficiency === false) setShowProficiency(false);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar layoutMode="multiple" /><LoadingSpinner /><Footer /></>;

  const grouped: Record<string, Skill[]> = {};
  skills.filter(s => s.isActive).forEach(s => {
    const cat = s.category || 'Other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(s);
  });

  return (
    <>
      <Navbar layoutMode="multiple" />
      <main>
        <section className="mp-section">
          <div className="container">
            <div className="mp-header">
              <h1 className="section-title">Skills & Competencies</h1>
              <p className="section-subtitle">Technologies and tools I work with</p>
            </div>
            {Object.entries(grouped).map(([category, catskills]) => (
              <div key={category} className="mp-skill-group">
                <h2 className="mp-skill-category">{category}</h2>
                <div className="mp-skills-grid">
                  {catskills.map((skill) => (
                    <div key={skill.id} className="card skill-card">
                      <div className="skill-icon"><i className={skill.icon || 'fas fa-code'} /></div>
                      <h3 className="skill-name">{skill.name}</h3>
                      {showProficiency && (
                        <>
                          <div className="skill-bar"><div className="skill-bar-fill" style={{ width: `${skill.proficiency}%` }} /></div>
                          <span className="skill-percent">{skill.proficiency}%</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <style>{`
        .mp-section { padding: 140px 0 80px; }
        .mp-header { text-align: center; margin-bottom: 50px; }
        .mp-skill-group { margin-bottom: 40px; }
        .mp-skill-category { font-size: 1.3rem; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid var(--border); }
        .mp-skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
        .skill-card { text-align: center; }
        .skill-icon { font-size: 2.5rem; color: var(--a-1); margin-bottom: 12px; }
        .skill-name { font-size: 1.1rem; margin-bottom: 15px; }
        .skill-bar { height: 6px; background: var(--bg-secondary); border-radius: 3px; overflow: hidden; margin-bottom: 8px; }
        .skill-bar-fill { height: 100%; background: linear-gradient(90deg, var(--a-1), var(--a-3)); border-radius: 3px; }
        .skill-percent { font-size: 13px; font-weight: 600; color: var(--a-1); }
      `}</style>
    </>
  );
};

export default SkillsPage;
