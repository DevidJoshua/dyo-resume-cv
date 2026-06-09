import { useState, useEffect } from 'react';
import api from '../services/api';
import { CVData } from '../types';
import { FiDownload, FiPrinter, FiArrowLeft, FiExternalLink, FiCalendar, FiAward, FiBook, FiHeart, FiFileText } from 'react-icons/fi';

const ICON_MAP: Record<string, any> = {
  education: FiBook,
  volunteer: FiHeart,
  publication: FiFileText,
  course: FiAward,
  certification: FiAward,
  summary: FiFileText,
};

const LAYOUT_STYLES: Record<string, any> = {
  classic: {
    container: 'cv-classic',
    headerClass: 'cv-header-classic',
    layout: 'classic-layout',
  },
  modern: {
    container: 'cv-modern',
    headerClass: 'cv-header-modern',
    layout: 'modern-layout',
  },
  minimal: {
    container: 'cv-minimal',
    headerClass: 'cv-header-minimal',
    layout: 'minimal-layout',
  },
};

const CvPreviewPage = () => {
  const [cv, setCv] = useState<{ layout: string; data: CVData } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/resume/cv/generate').then((res) => {
      setCv(res.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handlePrint = () => window.print();

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Loading CV...</div>;
  if (!cv) return <div style={{ padding: 40, textAlign: 'center' }}>Failed to load CV data.</div>;

  const { layout, data } = cv;
  const style = LAYOUT_STYLES[layout] || LAYOUT_STYLES.classic;

  const renderDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';

  const renderSectionItems = (section: any) => {
    switch (section.type) {
      case 'summary':
        return <p className="cv-summary-text">{section.content}</p>;
      case 'education':
        return section.items.map((item: any) => (
          <div key={item.id} className="cv-entry">
            <div className="cv-entry-header">
              <h4>{item.degree}</h4>
              <span className="cv-entry-date">{renderDate(item.startDate)} - {renderDate(item.endDate) || 'Present'}</span>
            </div>
            <p className="cv-entry-sub">{item.institution}{item.field ? ` | ${item.field}` : ''}{item.gpa ? ` | GPA: ${item.gpa}` : ''}</p>
            {item.description && <p className="cv-entry-desc">{item.description}</p>}
          </div>
        ));
      case 'skills':
        return (
          <div className="cv-skills">
            {section.items.map((item: any) => (
              <span key={item.id} className="cv-skill-badge">{item.name}</span>
            ))}
          </div>
        );
      case 'portfolio':
        return section.items.map((item: any) => (
          <div key={item.id} className="cv-entry">
            <div className="cv-entry-header">
              <h4>{item.title}</h4>
            </div>
            <p className="cv-entry-desc">{item.shortDescription}</p>
            {item.technologies?.length > 0 && (
              <div className="cv-skills" style={{ marginTop: 8 }}>
                {item.technologies.map((t: any) => <span key={t.id} className="cv-tech-tag">{t.technologyName}</span>)}
              </div>
            )}
          </div>
        ));
      case 'volunteer':
        return section.items.map((item: any) => (
          <div key={item.id} className="cv-entry">
            <div className="cv-entry-header">
              <h4>{item.role}</h4>
              <span className="cv-entry-date">{renderDate(item.startDate)} - {renderDate(item.endDate) || 'Present'}</span>
            </div>
            <p className="cv-entry-sub">{item.organization}</p>
            {item.description && <p className="cv-entry-desc">{item.description}</p>}
          </div>
        ));
      case 'publication':
        return section.items.map((item: any) => (
          <div key={item.id} className="cv-entry">
            <div className="cv-entry-header">
              <h4>{item.title}</h4>
              {item.publishedDate && <span className="cv-entry-date">{renderDate(item.publishedDate)}</span>}
            </div>
            {item.publisher && <p className="cv-entry-sub">{item.publisher}</p>}
            {item.description && <p className="cv-entry-desc">{item.description}</p>}
            {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="cv-entry-link"><FiExternalLink /> View Publication</a>}
          </div>
        ));
      case 'course':
        return section.items.map((item: any) => (
          <div key={item.id} className="cv-entry">
            <div className="cv-entry-header">
              <h4>{item.name}</h4>
              {item.completedDate && <span className="cv-entry-date">{renderDate(item.completedDate)}</span>}
            </div>
            {item.provider && <p className="cv-entry-sub">{item.provider}</p>}
            {item.description && <p className="cv-entry-desc">{item.description}</p>}
            {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="cv-entry-link"><FiExternalLink /> View Certificate</a>}
          </div>
        ));
      case 'certification':
        return section.items.map((item: any) => (
          <div key={item.id} className="cv-entry">
            <div className="cv-entry-header">
              <h4>{item.name}</h4>
              <span className="cv-entry-date">{renderDate(item.issuedDate)}{item.expirationDate ? ` - ${renderDate(item.expirationDate)}` : ''}</span>
            </div>
            {item.organization && <p className="cv-entry-sub">{item.organization}{item.credentialId ? ` | ID: ${item.credentialId}` : ''}</p>}
            {item.description && <p className="cv-entry-desc">{item.description}</p>}
            {item.credentialUrl && <a href={item.credentialUrl} target="_blank" rel="noopener noreferrer" className="cv-entry-link"><FiExternalLink /> Verify Credential</a>}
          </div>
        ));
      default:
        return null;
    }
  };

  return (
    <div className={`cv-page ${style.container}`}>
      <div className="cv-toolbar no-print">
        <button onClick={() => window.history.back()} className="cv-toolbar-btn"><FiArrowLeft /> Back</button>
        <button onClick={handlePrint} className="cv-toolbar-btn"><FiPrinter /> Print / Save PDF</button>
      </div>

      <div className={`cv-paper ${style.layout}`}>
        <div className={`cv-header ${style.headerClass}`}>
          {data.photo && <img src={data.photo} alt="" className="cv-photo" />}
          <div>
            <h1 className="cv-name">{data.name}</h1>
            <p className="cv-role">{data.role}</p>
            <div className="cv-contact-row">
              {data.email && <span>{data.email}</span>}
              {data.phone && <span>{data.phone}</span>}
              {data.linkedin && <a href={data.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
              {data.github && <a href={data.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
              {data.website && <span>{data.website}</span>}
            </div>
          </div>
        </div>

        <div className="cv-body">
          {data.sections.map((section, i) => {
            const Icon = ICON_MAP[section.type] || FiFileText;
            return (
              <div key={i} className="cv-section">
                <h3 className="cv-section-title"><Icon size={16} /> {section.title}</h3>
                {renderSectionItems(section)}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .cv-page { background: #f0f0f0; min-height: 100vh; padding: 20px; font-family: 'Inter', -apple-system, sans-serif; color: #222; }
        .cv-toolbar { max-width: 900px; margin: 0 auto 20px; display: flex; gap: 12px; flex-wrap: wrap; }
        .cv-toolbar-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; background: #fff; border: 1px solid #ddd; border-radius: 8px; cursor: pointer; font-size: 13px; transition: all 0.2s; color: #333; }
        .cv-toolbar-btn:hover { background: #1a1a2e; color: #fff; border-color: #1a1a2e; }
        .cv-paper { max-width: 900px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 30px rgba(0,0,0,0.08); }
        .cv-photo { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }

        .cv-header { padding: 40px 50px; display: flex; gap: 24px; align-items: center; }
        .cv-header-classic { background: #1a1a2e; color: #fff; }
        .cv-header-classic a { color: #FF8473; }
        .cv-header-modern { background: linear-gradient(135deg, #FF8473, #7152E1); color: #fff; }
        .cv-header-modern a { color: rgba(255,255,255,0.8); }
        .cv-header-minimal { background: #fff; color: #222; border-bottom: 2px solid #f0f0f0; }
        .cv-header-minimal a { color: #7152E1; }

        .cv-name { font-size: 2rem; font-weight: 700; margin: 0 0 4px; }
        .cv-role { font-size: 1rem; opacity: 0.85; margin: 0 0 12px; }
        .cv-contact-row { display: flex; flex-wrap: wrap; gap: 12px; font-size: 13px; }
        .cv-contact-row a { text-decoration: underline; }
        .cv-body { padding: 40px 50px; }
        .cv-section { margin-bottom: 32px; }
        .cv-section-title { font-size: 1rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #7152E1; display: flex; align-items: center; gap: 8px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #f0f0f0; }
        .cv-summary-text { line-height: 1.8; font-size: 14px; color: #555; }
        .cv-entry { margin-bottom: 20px; }
        .cv-entry-header { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; }
        .cv-entry-header h4 { font-size: 1rem; margin: 0; font-weight: 600; }
        .cv-entry-date { font-size: 12px; color: #8A8A8A; white-space: nowrap; }
        .cv-entry-sub { font-size: 13px; color: #555; margin: 4px 0; }
        .cv-entry-desc { font-size: 13px; color: #666; line-height: 1.6; margin: 6px 0 0; }
        .cv-entry-link { font-size: 12px; display: inline-flex; align-items: center; gap: 4px; color: #7152E1; margin-top: 6px; }
        .cv-skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .cv-skill-badge { padding: 4px 14px; background: #f0f0f0; border-radius: 50px; font-size: 12px; font-weight: 500; }
        .cv-tech-tag { padding: 2px 10px; background: #FF847320; color: #FF8473; border-radius: 4px; font-size: 11px; font-weight: 600; }

        /* modern layout */
        .cv-modern .cv-header { text-align: center; flex-direction: column; }
        .cv-modern .cv-contact-row { justify-content: center; }

        /* minimal layout */
        .cv-minimal .cv-header { text-align: center; flex-direction: column; padding: 30px 50px; }
        .cv-minimal .cv-contact-row { justify-content: center; }
        .cv-minimal .cv-section-title { border-bottom: none; font-size: 0.9rem; }
        .cv-minimal .cv-body { padding: 30px 50px; }

        @media print {
          .cv-page { background: #fff; padding: 0; }
          .cv-toolbar { display: none !important; }
          .cv-paper { box-shadow: none; border-radius: 0; max-width: 100%; }
          .cv-header { padding: 30px 40px; }
          .cv-body { padding: 30px 40px; }
          .cv-section { break-inside: avoid; }
        }
        @media (max-width: 600px) {
          .cv-header { flex-direction: column; text-align: center; padding: 24px; }
          .cv-contact-row { justify-content: center; }
          .cv-body { padding: 24px; }
          .cv-entry-header { flex-direction: column; }
        }
      `}</style>
    </div>
  );
};

export default CvPreviewPage;
