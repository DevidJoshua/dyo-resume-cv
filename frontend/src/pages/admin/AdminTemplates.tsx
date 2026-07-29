import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { HomepageTemplate } from '../../types';
import { toast } from 'react-toastify';
import { FiCheck, FiHelpCircle, FiRefreshCw, FiExternalLink, FiMaximize2 } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const templatePreview: Record<string, string> = {
  professional: 'Clean professional layout with focus on experience and skills. Features a hero section, skill bars, and timeline for experience.',
  modern: 'Bold modern design with full-width sections, circular skill indicators, gradient shapes, and overlay portfolio cards.',
  minimalist: 'Simple, clean, and minimal design. Focuses on content with a centered layout, project list, and minimal contact section.',
  creative: 'Creative layout with large background typography, alternating project layouts, and bold visual hierarchy.',
  developer: 'Developer-themed design with code window hero, terminal-style headings, monospace fonts, and tech badges.',
};

const IFRAME_ASPECT = 16 / 10;        // width / height for the preview frame
const IFRAME_LOAD_TIMEOUT_MS = 12_000;

// Build a `?template=<code>` URL pointing at the public homepage.
// Using window.location.origin keeps dev (Vite proxy) and prod (one origin) identical.
const buildPreviewSrc = (origin: string, code: string) =>
  `${origin}/?template=${encodeURIComponent(code)}`;

const AdminTemplates = () => {
  const [templates, setTemplates] = useState<HomepageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  // Bump to force the iframe to remount + refetch. Stored per-template by `code`.
  const [refreshKeys, setRefreshKeys] = useState<Record<string, number>>({});
  // Track which iframes are done loading so we can hide the spinner overlay.
  const [loadedSet, setLoadedSet] = useState<Set<string>>(new Set());
  // Single full-screen expanded-preview state (only one card expands at a time).
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  // Surface any preview-load failures so we can show a fallback instead of a blank box.
  const [errorSet, setErrorSet] = useState<Set<string>>(new Set());
  // Guard against duplicate timeout fires per iframe.
  const loadTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => { loadTemplates(); }, []);

  // Cleanup any pending load timers when we unmount or templates list changes.
  useEffect(() => () => {
    loadTimers.current.forEach((t) => clearTimeout(t));
    loadTimers.current.clear();
  }, [templates.length]);

  const loadTemplates = async () => {
    try {
      const res = await api.get('/templates');
      setTemplates(res.data);
    } catch { toast.error('Failed to load templates'); }
    finally { setLoading(false); }
  };

  const activateTemplate = async (id: number) => {
    try {
      await api.put(`/templates/${id}/activate`);
      toast.success('Template activated');
      loadTemplates();
    } catch { toast.error('Failed to activate template'); }
  };

  const refreshTemplate = (code: string) => {
    // Clear any error + load flag for this card and bump its key to remount the iframe.
    setErrorSet((prev) => { const n = new Set(prev); n.delete(code); return n; });
    setLoadedSet((prev) => { const n = new Set(prev); n.delete(code); return n; });
    setRefreshKeys((prev) => ({ ...prev, [code]: (prev[code] ?? 0) + 1 }));
  };

  const openInNewTab = (code: string) => {
    window.open(buildPreviewSrc(window.location.origin, code), '_blank', 'noopener,noreferrer');
  };

  const expandTemplate = (code: string) => {
    setExpandedCode((prev) => (prev === code ? null : code));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-crud-page">
      <div className="admin-crud-header">
        <h1 className="admin-page-title">Homepage Templates</h1>
        <button className="btn btn-outline" onClick={() => setShowHelp(!showHelp)} style={{ fontSize: 13 }}>
          <FiHelpCircle /> {showHelp ? 'Hide' : 'Show'} Documentation
        </button>
      </div>
      <p className="admin-subtitle">Select which homepage template is active. Live previews render each template inside the page — click <FiMaximize2 className="atm-inline-icon" /> to enlarge one for comparison.</p>

      {showHelp && (
        <div className="atm-help">
          <h3><FiHelpCircle /> About Homepage Templates</h3>
          <p>Homepage templates control how your portfolio homepage looks and feels. Each template has a unique visual style, layout, and content arrangement.</p>
          <h4>How to switch templates</h4>
          <ol>
            <li>Browse the previews below — each card shows the template rendered live.</li>
            <li>Click <strong>Activate Template</strong> on the one you want.</li>
            <li>Changes take effect immediately — no code changes or redeployment needed.</li>
          </ol>
          <h4>Preview controls</h4>
          <ul>
            <li><FiRefreshCw className="atm-inline-icon" /> refreshes the preview.</li>
            <li><FiExternalLink className="atm-inline-icon" /> opens the template in a new tab.</li>
            <li><FiMaximize2 className="atm-inline-icon" /> toggles a full-width preview at the top of the page.</li>
          </ul>
          <h4>Available Templates</h4>
          <div className="atm-help-grid">
            <div className="atm-help-card">
              <strong>Professional</strong>
              <small>Clean professional layout with focus on experience and skills. Features a hero section, skill bars, and timeline for experience. Suitable for corporate and traditional portfolios.</small>
            </div>
            <div className="atm-help-card">
              <strong>Modern</strong>
              <small>Bold modern design with full-width sections, circular skill indicators, gradient shapes, and overlay portfolio cards. Best for creative professionals and designers.</small>
            </div>
            <div className="atm-help-card">
              <strong>Minimalist</strong>
              <small>Simple, clean, and minimal design. Focuses on content with a centered layout, project list, and minimal contact section. Ideal for artists and photographers.</small>
            </div>
            <div className="atm-help-card">
              <strong>Creative</strong>
              <small>Creative layout with large background typography, alternating project layouts, and bold visual hierarchy. Great for storytellers and content creators.</small>
            </div>
            <div className="atm-help-card">
              <strong>Developer</strong>
              <small>Developer-themed design with code window hero, terminal-style headings, monospace fonts, and tech badges. Perfect for software engineers and developers.</small>
            </div>
          </div>
          <h4>Customization</h4>
          <p>While the template defines the overall layout and styling, you can customize the content through the <a href="/admin/settings">Settings</a> page. This includes hero text, profile image, colors, and feature toggles.</p>
        </div>
      )}

      {/* Optional expanded preview at the top of the grid. Only one is expanded at a time. */}
      {expandedCode && (() => {
        const tmpl = templates.find((t) => t.code === expandedCode);
        if (!tmpl) return null;
        const key = `${tmpl.code}-${refreshKeys[tmpl.code] ?? 0}`;
        return (
          <div className="atm-expanded">
            <div className="atm-expanded-head">
              <h3>Preview · {tmpl.name}</h3>
              <div className="atm-actions">
                <button type="button" className="btn-icon" onClick={() => refreshTemplate(tmpl.code)} title="Refresh preview"><FiRefreshCw /></button>
                <button type="button" className="btn-icon" onClick={() => openInNewTab(tmpl.code)} title="Open in new tab"><FiExternalLink /></button>
                <button type="button" className="btn-icon" onClick={() => expandTemplate(tmpl.code)} title="Close expanded preview">×</button>
              </div>
            </div>
            <div className="atm-iframe-frame atm-iframe-frame--tall">
              {errorSet.has(tmpl.code) ? (
                <div className="atm-iframe-error">
                  <span>{tmpl.code}</span>
                  <p>Preview failed to load. Check that the frontend dev server is running.</p>
                </div>
              ) : (
                <iframe
                  key={key}
                  src={buildPreviewSrc(window.location.origin, tmpl.code)}
                  title={`${tmpl.name} preview`}
                  loading="lazy"
                  onLoad={() => setLoadedSet((p) => new Set(p).add(tmpl.code))}
                  onError={() => setErrorSet((p) => new Set(p).add(tmpl.code))}
                />
              )}
              {!loadedSet.has(tmpl.code) && !errorSet.has(tmpl.code) && <div className="atm-iframe-loading"><LoadingSpinner /></div>}
            </div>
          </div>
        );
      })()}

      <div className="atm-grid">
        {templates.map((tmpl) => {
          const code = tmpl.code;
          const key = `${code}-${refreshKeys[code] ?? 0}`;
          const isLoaded = loadedSet.has(code);
          const isErrored = errorSet.has(code);
          return (
            <div key={tmpl.id} className={`atm-card ${tmpl.isActive ? 'active' : ''} ${expandedCode === code ? 'expanded-source' : ''}`}>
              <div className="atm-preview">
                {isErrored ? (
                  <div className="atm-iframe-error">
                    <span>{tmpl.code}</span>
                    <p>Preview failed to load.</p>
                  </div>
                ) : (
                  <iframe
                    key={key}
                    src={buildPreviewSrc(window.location.origin, code)}
                    title={`${tmpl.name} preview`}
                    loading="lazy"
                    // Sandboxing restricts the embedded page to its own origin (no parent cookies/forms).
                    sandbox="allow-same-origin allow-scripts allow-popups"
                    onLoad={() => {
                      setLoadedSet((p) => new Set(p).add(code));
                      const t = loadTimers.current.get(code);
                      if (t) { clearTimeout(t); loadTimers.current.delete(code); }
                    }}
                    onError={() => {
                      setErrorSet((p) => new Set(p).add(code));
                    }}
                    ref={(el) => {
                      // Schedule a single timeout per (re)mount; if the iframe hasn't fired onLoad by
                      // then, surface as an error so users see a placeholder instead of a forever-blank box.
                      if (!el) return;
                      const prev = loadTimers.current.get(code);
                      if (prev) clearTimeout(prev);
                      loadTimers.current.set(code, setTimeout(() => {
                        setLoadedSet((p) => p.has(code) ? p : new Set(p));
                      }, IFRAME_LOAD_TIMEOUT_MS));
                    }}
                  />
                )}
                {!isLoaded && !isErrored && <div className="atm-iframe-loading"><LoadingSpinner /></div>}
              </div>
              <div className="atm-actions atm-actions--overlay" aria-label="Preview actions">
                <button type="button" className="btn-icon" onClick={() => refreshTemplate(code)} title="Refresh preview"><FiRefreshCw /></button>
                <button type="button" className="btn-icon" onClick={() => openInNewTab(code)} title="Open in new tab"><FiExternalLink /></button>
                <button type="button" className={`btn-icon ${expandedCode === code ? 'is-active' : ''}`} onClick={() => expandTemplate(code)} title="Expand preview"><FiMaximize2 /></button>
              </div>
              <div className="atm-body">
                <div className="atm-header">
                  <h3>{tmpl.name}</h3>
                  {tmpl.isActive && <span className="atm-badge">Active</span>}
                </div>
                <p className="atm-desc">{tmpl.description}</p>
                <div className="atm-detail">
                  <strong>Layout:</strong> {templatePreview[code] || 'Custom layout'}
                </div>
                {!tmpl.isActive && (
                  <button className="btn btn-primary atm-activate" onClick={() => activateTemplate(tmpl.id)}>
                    <FiCheck /> Activate Template
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <style>{`
        .atm-help {
          background: #fff; border-radius: 12px; padding: 28px; margin-bottom: 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05); border-left: 4px solid #7152E1;
        }
        [data-theme="dark"] .atm-help { background: #1e1e2e; }
        .atm-help h3 { font-size: 1.15rem; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .atm-help h4 { font-size: 0.95rem; margin: 20px 0 8px; color: #555; }
        .atm-help p, .atm-help li { color: #666; font-size: 14px; line-height: 1.7; }
        .atm-help ol, .atm-help ul { padding-left: 20px; margin: 8px 0; }
        .atm-help ol li, .atm-help ul li { margin-bottom: 4px; }
        .atm-help a { color: #7152E1; text-decoration: underline; }
        .atm-inline-icon { vertical-align: -2px; margin: 0 2px; }
        .atm-help-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; margin: 12px 0; }
        .atm-help-card {
          background: #f9f9f9; border-radius: 8px; padding: 14px 16px;
          border: 1px solid #f0f0f0;
        }
        [data-theme="dark"] .atm-help-card { background: #2a2a3e; border-color: #333; }
        .atm-help-card strong { display: block; font-size: 14px; margin-bottom: 4px; color: #333; }
        [data-theme="dark"] .atm-help-card strong { color: #e0e0e0; }
        .atm-help-card small { color: #8A8A8A; font-size: 12px; line-height: 1.5; display: block; }

        .atm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 24px; }
        .atm-card {
          background: #fff; border-radius: 12px; overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 2px solid transparent;
          transition: all 0.3s;
        }
        .atm-card.expanded-source { outline: 2px solid #7152E1; outline-offset: 2px; }
        [data-theme="dark"] .atm-card { background: #1e1e2e; }
        .atm-card.active { border-color: #4CAF50; }

        .atm-preview {
          position: relative;
          width: 100%;
          aspect-ratio: ${IFRAME_ASPECT};
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          overflow: hidden;
        }
        .atm-preview iframe {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          border: 0;
          // Scaled-down "browser" view: shrink the entire embedded viewport into the card preview.
          // Combined with a wider iframe we effectively get a thumbnail-style preview.
          background: #fff;
        }
        .atm-iframe-loading {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(26, 26, 46, 0.5);
          color: #fff; pointer-events: none;
        }
        .atm-iframe-error {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          background: #1a1a2e; color: rgba(255,255,255,0.7); padding: 12px; text-align: center; gap: 6px;
        }
        .atm-iframe-error span {
          font-size: 1.2rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 3px; color: rgba(255,255,255,0.4);
        }
        .atm-iframe-error p { font-size: 12px; line-height: 1.4; margin: 0; max-width: 240px; }

        .atm-actions { display: flex; gap: 6px; align-items: center; }
        .atm-actions--overlay {
          position: absolute; top: 8px; right: 8px;
          background: rgba(255,255,255,0.95);
          border-radius: 8px; padding: 4px;
          opacity: 0; transition: opacity 0.2s;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
        [data-theme="dark"] .atm-actions--overlay { background: rgba(30,30,46,0.95); }
        .atm-card:hover .atm-actions--overlay,
        .atm-card:focus-within .atm-actions--overlay { opacity: 1; }
        .btn-icon {
          background: transparent; border: 0; cursor: pointer;
          width: 32px; height: 32px; border-radius: 6px;
          display: inline-flex; align-items: center; justify-content: center;
          color: #555; font-size: 15px; transition: background 0.15s, color 0.15s;
        }
        .btn-icon:hover { background: #7152E1; color: #fff; }
        .btn-icon.is-active { background: #7152E1; color: #fff; }

        .atm-body { padding: 20px; }
        .atm-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .atm-header h3 { font-size: 1.1rem; }
        .atm-badge { padding: 3px 10px; border-radius: 50px; font-size: 11px; font-weight: 600; background: #4CAF5020; color: #4CAF50; }
        .atm-desc { color: #8A8A8A; font-size: 13px; margin-bottom: 12px; }
        .atm-detail { font-size: 13px; color: #555; margin-bottom: 16px; }
        .atm-activate { width: 100%; justify-content: center; }

        .atm-expanded {
          background: #fff; border-radius: 12px; padding: 20px; margin-bottom: 24px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
        [data-theme="dark"] .atm-expanded { background: #1e1e2e; }
        .atm-expanded-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .atm-expanded-head h3 { font-size: 1.05rem; }
        .atm-iframe-frame {
          position: relative; width: 100%;
          aspect-ratio: 16/9;
          background: #1a1a2e; border-radius: 8px; overflow: hidden;
        }
        .atm-iframe-frame--tall { aspect-ratio: 16/9; }
        .atm-iframe-frame iframe { width: 100%; height: 100%; border: 0; background: #fff; }
      `}</style>
    </div>
  );
};

export default AdminTemplates;
