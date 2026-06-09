import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Portfolio } from '../types';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiArrowLeft, FiExternalLink, FiGithub, FiCalendar } from 'react-icons/fi';

const PortfolioDetail = () => {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/portfolio-v2/${id}`)
      .then((res) => setPortfolio(res.data))
      .catch(() => {
        api.get(`/portfolio/${id}`).then((res) => {
          const p = res.data;
          setPortfolio({ ...p, technologies: p.technologies ? p.technologies.split(',').map((t: string) => ({ id: 0, portfolioId: Number(id), technologyName: t.trim() })) : [] });
        }).catch(() => setPortfolio(null));
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <><Navbar /><LoadingSpinner /><Footer /></>;
  if (!portfolio) return <><Navbar /><div className="container" style={{ paddingTop: 120, textAlign: 'center' }}><h2>Project not found</h2><Link to="/">Go Home</Link></div><Footer /></>;

  const techs = portfolio.technologies || [];
  const techNames = techs.map((t: any) => t.technologyName || t.trim?.() || t);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 120 }}>
        <div className="container">
          <Link to="/" className="back-link"><FiArrowLeft /> Back to Home</Link>
          <div className="project-header">
            <h1>{portfolio.title}</h1>
            <span className="project-category">{portfolio.category?.name || portfolio.category || ''}</span>
          </div>
          {portfolio.featuredImage && (
            <div className="project-image">
              <img src={portfolio.featuredImage.filePath} alt={portfolio.title} />
            </div>
          )}
          {portfolio.gallery && portfolio.gallery.length > 0 && (
            <div className="project-gallery">
              {portfolio.gallery.map((g: any) => (
                <div key={g.id} className="project-gallery-item">
                  <img src={g.mediaFile?.filePath || ''} alt="" />
                </div>
              ))}
            </div>
          )}
          <div className="project-content">
            <p>{portfolio.fullDescription || portfolio.shortDescription || portfolio.description}</p>
            {techNames.length > 0 && (
              <div className="project-tech">
                <h3>Technologies Used</h3>
                <div className="tech-tags">
                  {techNames.map((t: string, i: number) => (
                    <span key={i} className="tech-badge-lg">{t.trim?.() || t}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="project-links">
              {portfolio.projectUrl && (
                <a href={portfolio.projectUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <FiExternalLink /> View Project
                </a>
              )}
              {portfolio.githubUrl && (
                <a href={portfolio.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  <FiGithub /> View Code
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <style>{`
        .back-link { display: inline-flex; align-items: center; gap: 8px; color: var(--a-1); font-weight: 600; margin-bottom: 30px; transition: color var(--transition); }
        .back-link:hover { color: var(--a-3); }
        .project-header { margin-bottom: 30px; }
        .project-header h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .project-category { font-size: 13px; color: var(--a-1); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .project-image { border-radius: 20px; overflow: hidden; margin-bottom: 40px; background: var(--bg-secondary); }
        .project-image img { width: 100%; display: block; }
        .project-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; margin-bottom: 40px; }
        .project-gallery-item { border-radius: 12px; overflow: hidden; background: var(--bg-secondary); }
        .project-gallery-item img { width: 100%; display: block; }
        .project-content p { color: var(--text-secondary); line-height: 1.8; font-size: 1.1rem; margin-bottom: 30px; }
        .project-tech { margin-bottom: 30px; }
        .project-tech h3 { margin-bottom: 15px; font-size: 1.2rem; }
        .tech-tags { display: flex; flex-wrap: wrap; gap: 10px; }
        .tech-badge-lg { padding: 8px 20px; border-radius: 50px; background: var(--bg-secondary); font-size: 13px; font-weight: 500; }
        .project-links { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 60px; }
      `}</style>
    </>
  );
};

export default PortfolioDetail;
