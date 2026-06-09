import { Page } from '../../types';

interface Props {
  page: Page;
}

const DynamicPage = ({ page }: Props) => {
  let content: { sections?: any[] } = {};
  try {
    content = JSON.parse(page.contents?.[0]?.contentJson || '{}');
  } catch { content = {}; }

  const renderSection = (section: any, index: number) => {
    switch (section.type) {
      case 'hero':
        return (
          <section key={index} className="dp-hero">
            <div className="container text-center" style={{ maxWidth: 700 }}>
              <h1 className="dp-hero-title">{section.title || page.title}</h1>
              {section.subtitle && <p className="dp-hero-subtitle">{section.subtitle}</p>}
            </div>
          </section>
        );
      case 'text':
        return (
          <section key={index} className="dp-section">
            <div className="container" style={{ maxWidth: 800 }}>
              {section.title && <h2 className="dp-section-title">{section.title}</h2>}
              <div className="dp-text" dangerouslySetInnerHTML={{ __html: section.content?.replace(/\n/g, '<br/>') }} />
            </div>
          </section>
        );
      case 'two-column':
        return (
          <section key={index} className="dp-section">
            <div className="container">
              <div className="grid-2">
                {section.left && <div className="dp-text" dangerouslySetInnerHTML={{ __html: section.left.replace(/\n/g, '<br/>') }} />}
                {section.right && <div className="dp-text" dangerouslySetInnerHTML={{ __html: section.right.replace(/\n/g, '<br/>') }} />}
              </div>
            </div>
          </section>
        );
      case 'gallery':
        return (
          <section key={index} className="dp-section">
            <div className="container">
              {section.title && <h2 className="dp-section-title">{section.title}</h2>}
              <div className="dp-gallery">
                {(section.images || []).map((img: string, i: number) => (
                  <div key={i} className="dp-gallery-item">
                    <img src={img} alt={`Gallery ${i + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dynamic-page" style={{ paddingTop: 100 }}>
      {(content.sections || []).map(renderSection)}
      <style>{`
        .dp-hero { padding: 100px 0 60px; min-height: 50vh; display: flex; align-items: center; }
        .dp-hero-title { font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 15px; }
        .dp-hero-subtitle { color: var(--text-secondary); font-size: 1.2rem; }
        .dp-section { padding: 60px 0; }
        .dp-section-title { font-size: 1.8rem; margin-bottom: 30px; }
        .dp-text { color: var(--text-secondary); line-height: 1.8; font-size: 1rem; }
        .dp-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }
        .dp-gallery-item { border-radius: 12px; overflow: hidden; aspect-ratio: 1; background: var(--bg-secondary); }
        .dp-gallery-item img { width: 100%; height: 100%; object-fit: cover; }
      `}</style>
    </div>
  );
};

export default DynamicPage;
