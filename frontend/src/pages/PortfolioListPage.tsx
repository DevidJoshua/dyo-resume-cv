import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Portfolio, PortfolioCategory } from '../types';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiExternalLink, FiGithub, FiArrowRight } from 'react-icons/fi';

const PortfolioListPage = () => {
  const [items, setItems] = useState<Portfolio[]>([]);
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [activeCat, setActiveCat] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/portfolio-v2?limit=50'),
      api.get('/portfolio-v2/categories')
    ]).then(([p, c]) => {
      setItems(p.data.data || []);
      setCategories(c.data);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = activeCat ? items.filter(i => i.category?.slug === activeCat) : items;

  if (loading) return <><Navbar layoutMode="multiple" /><LoadingSpinner /><Footer /></>;

  const techs = (item: Portfolio): string[] => {
    if (Array.isArray(item.technologies)) return item.technologies.map((t: any) => t.technologyName || t);
    return [];
  };

  return (
    <>
      <Navbar layoutMode="multiple" />
      <main>
        <section className="mp-section">
          <div className="container">
            <div className="mp-header">
              <h1 className="section-title">Portfolio</h1>
              <p className="section-subtitle">My recent work and projects</p>
            </div>
            <div className="mp-cat-filters">
              <button className={`mp-cat-btn ${activeCat === '' ? 'active' : ''}`} onClick={() => setActiveCat('')}>All</button>
              {categories.map(c => (
                <button key={c.slug} className={`mp-cat-btn ${activeCat === c.slug ? 'active' : ''}`} onClick={() => setActiveCat(c.slug)}>{c.name}</button>
              ))}
            </div>
            <div className="mp-portfolio-grid">
              {filtered.map((item) => (
                <div key={item.id} className="card mp-portfolio-card">
                  <div className="mp-portfolio-img">
                    <img src={item.featuredImage?.filePath || 'https://via.placeholder.com/600x400'} alt={item.title} />
                  </div>
                  <div className="mp-portfolio-body">
                    <span className="portfolio-category">{item.category?.name || ''}</span>
                    <h3>{item.title}</h3>
                    <p>{item.shortDescription}</p>
                    {techs(item).length > 0 && (
                      <div className="mp-techs">{techs(item).map(t => <span key={t} className="tech-badge">{t}</span>)}</div>
                    )}
                    <Link to={`/portfolio/${item.id}`} className="mp-view-btn">View Details <FiArrowRight /></Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <style>{`
        .mp-section { padding: 140px 0 80px; }
        .mp-header { text-align: center; margin-bottom: 30px; }
        .mp-cat-filters { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin-bottom: 40px; }
        .mp-cat-btn { padding: 8px 20px; border-radius: 50px; border: 1px solid var(--border); background: var(--bg); color: var(--text); font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.3s; }
        .mp-cat-btn.active, .mp-cat-btn:hover { background: var(--a-1); color: #fff; border-color: var(--a-1); }
        .mp-portfolio-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 30px; }
        .mp-portfolio-card { overflow: hidden; }
        .mp-portfolio-img { height: 220px; overflow: hidden; border-radius: 8px; margin: -30px -30px 20px; }
        .mp-portfolio-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .mp-portfolio-card:hover .mp-portfolio-img img { transform: scale(1.05); }
        .portfolio-category { font-size: 12px; color: var(--a-1); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .mp-portfolio-body h3 { margin: 10px 0; font-size: 1.3rem; }
        .mp-portfolio-body p { color: var(--text-secondary); font-size: 14px; margin-bottom: 12px; }
        .mp-techs { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 15px; }
        .tech-badge { padding: 4px 12px; border-radius: 50px; background: var(--bg-secondary); font-size: 11px; font-weight: 500; }
        .mp-view-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: var(--a-1); }
        .mp-view-btn:hover { color: var(--a-3); }
        @media (max-width: 768px) { .mp-portfolio-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
};

export default PortfolioListPage;
