import { useState, useEffect } from 'react';
import api from '../services/api';
import { HomeSetting, Skill, Portfolio, SiteSetting, HomepageTemplate, Education, Volunteer, Publication, Course, Certification } from '../types';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AnimatedSection from '../components/common/AnimatedSection';
import { FiSend, FiMapPin, FiPhone, FiMail, FiExternalLink, FiGithub, FiBook, FiHeart, FiFileText, FiAward, FiCalendar } from 'react-icons/fi';
import ProfessionalTemplate from '../templates/ProfessionalTemplate';
import ModernTemplate from '../templates/ModernTemplate';
import MinimalistTemplate from '../templates/MinimalistTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';
import DeveloperTemplate from '../templates/DeveloperTemplate';

const templateMap: Record<string, React.FC<any>> = {
  professional: ProfessionalTemplate,
  modern: ModernTemplate,
  minimalist: MinimalistTemplate,
  creative: CreativeTemplate,
  developer: DeveloperTemplate,
};

const HomePage = ({ layoutMode = 'single' }: { layoutMode?: string }) => {
  const [home, setHome] = useState<HomeSetting | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [settings, setSettings] = useState<SiteSetting | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<HomepageTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [education, setEducation] = useState<Education[]>([]);
  const [volunteer, setVolunteer] = useState<Volunteer[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/home'),
      api.get('/skills'),
      api.get('/portfolio-v2?limit=10'),
      api.get('/site'),
      api.get('/templates/active'),
      api.get('/resume/education'),
      api.get('/resume/volunteer'),
      api.get('/resume/publications'),
      api.get('/resume/courses'),
      api.get('/resume/certifications'),
    ]).then(([h, s, p, st, t, ed, vo, pu, co, ce]) => {
      setHome(h.data);
      setSkills(s.data);
      setPortfolios(p.data.data || []);
      setSettings(st.data);
      setActiveTemplate(t.data);
      setEducation(ed.data);
      setVolunteer(vo.data);
      setPublications(pu.data);
      setCourses(co.data);
      setCertifications(ce.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/contact', contactForm);
      setContactSent(true);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch { /* ignore */ }
  };

  if (loading) return <><Navbar /><LoadingSpinner /><Footer /></>;

  const TemplateComponent = activeTemplate?.code ? templateMap[activeTemplate.code] : null;

  return (
    <>
      <Navbar layoutMode={layoutMode as 'single' | 'multiple'} />
      <main>
        {TemplateComponent ? (
          <TemplateComponent home={home} skills={skills} portfolios={portfolios} settings={settings} />
        ) : (
          <div className="container" style={{ paddingTop: 120, textAlign: 'center', minHeight: '60vh' }}>
            <h2>Welcome</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Select a homepage template from the admin panel.</p>
          </div>
        )}

        {layoutMode === 'single' && (
        <AnimatedSection id="cv" className="section" style={{ background: 'var(--bg-secondary)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 className="section-title">Resume / CV</h2>
            <p className="section-subtitle">Download my full resume to learn more</p>
            <a href="/cv" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '14px 40px', fontSize: 15 }}>
              <FiFileText /> Download CV
            </a>
          </div>
        </AnimatedSection>
        )}

        {layoutMode === 'single' && settings?.showEducation !== false && education.filter(e => e.isActive).length > 0 && (
        <AnimatedSection id="education" className="section">
          <div className="container">
            <div className="text-center"><h2 className="section-title"><FiBook /> Education</h2><p className="section-subtitle">Academic background</p></div>
            <div className="fp-timeline">
              {education.filter(e => e.isActive).sort((a, b) => b.displayOrder - a.displayOrder || (b.startDate || '').localeCompare(a.startDate || '')).map((item) => (
                <div key={item.id} className="fp-timeline-item card">
                  <div className="fp-timeline-dot" />
                  <div className="fp-timeline-content">
                    <span className="fp-timeline-date"><FiCalendar /> {item.startDate?.split('T')[0] || ''} - {item.endDate?.split('T')[0] || 'Present'}</span>
                    <h3>{item.degree}</h3>
                    <p className="fp-timeline-sub">{item.institution}{item.field ? ` | ${item.field}` : ''}{item.gpa ? ` | GPA: ${item.gpa}` : ''}</p>
                    {item.description && <p className="fp-timeline-desc">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
        )}

        {layoutMode === 'single' && settings?.showVolunteer !== false && volunteer.filter(v => v.isActive).length > 0 && (
        <AnimatedSection id="volunteer" className="section" style={{ background: 'var(--bg-secondary)' }}>
          <div className="container">
            <div className="text-center"><h2 className="section-title"><FiHeart /> Volunteer</h2><p className="section-subtitle">Giving back to the community</p></div>
            <div className="fp-grid">
              {volunteer.filter(v => v.isActive).sort((a, b) => b.displayOrder - a.displayOrder || (b.startDate || '').localeCompare(a.startDate || '')).map((item) => (
                <div key={item.id} className="fp-card card">
                  <span className="fp-card-date"><FiCalendar /> {item.startDate?.split('T')[0] || ''} - {item.endDate?.split('T')[0] || 'Present'}</span>
                  <h3>{item.role}</h3>
                  <p className="fp-card-sub">{item.organization}</p>
                  {item.description && <p className="fp-card-desc">{item.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
        )}

        {layoutMode === 'single' && settings?.showPublication !== false && publications.filter(p => p.isActive).length > 0 && (
        <AnimatedSection id="publications" className="section">
          <div className="container">
            <div className="text-center"><h2 className="section-title"><FiFileText /> Publications</h2><p className="section-subtitle">Research & articles</p></div>
            <div className="fp-list">
              {publications.filter(p => p.isActive).sort((a, b) => b.displayOrder - a.displayOrder || (b.publishedDate || '').localeCompare(a.publishedDate || '')).map((item) => (
                <div key={item.id} className="fp-list-item card">
                  <div className="fp-list-info">
                    <h3>{item.title}</h3>
                    {item.publisher && <p className="fp-card-sub">{item.publisher}</p>}
                    {item.publishedDate && <span className="fp-card-date"><FiCalendar /> {item.publishedDate?.split('T')[0]}</span>}
                    {item.description && <p className="fp-card-desc">{item.description}</p>}
                  </div>
                  {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="fp-list-link"><FiExternalLink /></a>}
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
        )}

        {layoutMode === 'single' && settings?.showCourse !== false && courses.filter(c => c.isActive).length > 0 && (
        <AnimatedSection id="courses" className="section" style={{ background: 'var(--bg-secondary)' }}>
          <div className="container">
            <div className="text-center"><h2 className="section-title"><FiAward /> Courses</h2><p className="section-subtitle">Continuous learning</p></div>
            <div className="fp-grid">
              {courses.filter(c => c.isActive).sort((a, b) => b.displayOrder - a.displayOrder || (b.completedDate || '').localeCompare(a.completedDate || '')).map((item) => (
                <div key={item.id} className="fp-card card">
                  <h3>{item.name}</h3>
                  {item.provider && <p className="fp-card-sub">{item.provider}</p>}
                  {item.completedDate && <span className="fp-card-date"><FiCalendar /> Completed: {item.completedDate?.split('T')[0]}</span>}
                  {item.description && <p className="fp-card-desc">{item.description}</p>}
                  {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="fp-card-link">View Certificate <FiExternalLink /></a>}
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
        )}

        {layoutMode === 'single' && settings?.showCertification !== false && certifications.filter(c => c.isActive).length > 0 && (
        <AnimatedSection id="certifications" className="section">
          <div className="container">
            <div className="text-center"><h2 className="section-title"><FiAward /> Certifications</h2><p className="section-subtitle">Professional credentials</p></div>
            <div className="fp-grid">
              {certifications.filter(c => c.isActive).sort((a, b) => b.displayOrder - a.displayOrder || (b.issuedDate || '').localeCompare(a.issuedDate || '')).map((item) => (
                <div key={item.id} className="fp-card card">
                  <h3>{item.name}</h3>
                  <p className="fp-card-sub">{item.organization}{item.credentialId ? ` | ID: ${item.credentialId}` : ''}</p>
                  <span className="fp-card-date"><FiCalendar /> Issued: {item.issuedDate?.split('T')[0] || ''}{item.expirationDate ? ` - Expires: ${item.expirationDate.split('T')[0]}` : ''}</span>
                  {item.description && <p className="fp-card-desc">{item.description}</p>}
                  {item.credentialUrl && <a href={item.credentialUrl} target="_blank" rel="noopener noreferrer" className="fp-card-link">Verify <FiExternalLink /></a>}
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
        )}

        {layoutMode === 'single' && (
        <section id="contact" className="section">
          <div className="container">
            <div className="text-center">
              <h2 className="section-title">Get In Touch</h2>
              <p className="section-subtitle">Have a project in mind? Let's talk</p>
            </div>
            <div className="grid-2 contact-grid">
              <div className="contact-info">
                <h3>Contact Information</h3>
                <div className="contact-info-items">
                  {settings?.email && <div className="contact-info-item"><FiMail /> {settings.email}</div>}
                  {settings?.phone && <div className="contact-info-item"><FiPhone /> {settings.phone}</div>}
                  {settings?.linkedinUrl && (
                    <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="contact-info-item">
                      <FiExternalLink /> LinkedIn
                    </a>
                  )}
                  {settings?.githubUrl && (
                    <a href={settings.githubUrl} target="_blank" rel="noopener noreferrer" className="contact-info-item">
                      <FiGithub /> GitHub
                    </a>
                  )}
                </div>
              </div>
              <form className="contact-form" onSubmit={handleContact}>
                {contactSent ? (
                  <div className="contact-success">
                    <h3>Message Sent!</h3>
                    <p>Thank you for reaching out. I'll get back to you soon.</p>
                    <button type="button" className="btn btn-primary" onClick={() => setContactSent(false)}>Send Another</button>
                  </div>
                ) : (
                  <>
                    <div className="form-group">
                      <input className="form-input" placeholder="Your Name" value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <input className="form-input" type="email" placeholder="Your Email" value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <input className="form-input" placeholder="Subject" value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <textarea className="form-textarea" placeholder="Your Message" value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} required />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      <FiSend /> Send Message
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </section>
        )}
      </main>
      <Footer />

      <style>{`
        .text-center { text-align: center; }
        .section-title {
          font-size: 2.5rem;
          margin-bottom: 10px;
          background: linear-gradient(135deg, var(--a-1), var(--a-3));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .section-subtitle { color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 50px; }
        .contact-grid { gap: 50px; align-items: start; }
        .contact-info h3 { margin-bottom: 20px; }
        .contact-info-items { display: flex; flex-direction: column; gap: 16px; }
        .contact-info-item {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 20px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 12px;
          font-size: 14px;
          color: var(--text);
          transition: all var(--transition);
        }
        .contact-info-item:hover { border-color: var(--a-1); }
        .contact-info-item svg { color: var(--a-1); font-size: 18px; }
        .contact-form { display: flex; flex-direction: column; gap: 0; }
        .contact-success { text-align: center; padding: 40px; }
        .contact-success h3 { color: var(--a-1); margin-bottom: 10px; }
        .contact-success p { color: var(--text-secondary); margin-bottom: 20px; }
        /* FP = FrontPage sections */
        .fp-timeline { display: flex; flex-direction: column; gap: 24px; max-width: 800px; margin: 0 auto; position: relative; }
        .fp-timeline::before { content: ''; position: absolute; left: 24px; top: 0; bottom: 0; width: 2px; background: var(--border); }
        .fp-timeline-item { position: relative; padding-left: 64px; }
        .fp-timeline-dot { position: absolute; left: 17px; top: 30px; width: 16px; height: 16px; border-radius: 50%; background: var(--a-1); border: 3px solid var(--bg); }
        .fp-timeline-content h3 { font-size: 1.1rem; margin-bottom: 4px; }
        .fp-timeline-sub { color: var(--text-secondary); font-size: 14px; margin-bottom: 8px; }
        .fp-timeline-desc { color: var(--text-secondary); font-size: 13px; line-height: 1.6; }
        .fp-timeline-date { font-size: 12px; color: var(--a-1); display: flex; align-items: center; gap: 4px; margin-bottom: 8px; }
        .fp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
        .fp-card { transition: transform 0.3s, box-shadow 0.3s; }
        .fp-card:hover { transform: translateY(-5px); box-shadow: 0 10px 40px rgba(0,0,0,0.08); }
        .fp-card h3 { font-size: 1.1rem; margin-bottom: 4px; }
        .fp-card-sub { color: var(--a-1); font-size: 13px; font-weight: 500; margin-bottom: 8px; }
        .fp-card-desc { color: var(--text-secondary); font-size: 13px; line-height: 1.6; margin-top: 8px; }
        .fp-card-date { font-size: 12px; color: var(--text-secondary); display: flex; align-items: center; gap: 4px; }
        .fp-card-link { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: var(--a-1); margin-top: 12px; }
        .fp-list { display: flex; flex-direction: column; gap: 16px; max-width: 800px; margin: 0 auto; }
        .fp-list-item { display: flex; justify-content: space-between; align-items: center; gap: 16px; transition: transform 0.3s; }
        .fp-list-item:hover { transform: translateX(8px); }
        .fp-list-info h3 { font-size: 1.1rem; margin-bottom: 4px; }
        .fp-list-link { font-size: 20px; color: var(--text-secondary); flex-shrink: 0; transition: color 0.3s; }
        .fp-list-link:hover { color: var(--a-1); }
        .section-title svg { vertical-align: middle; margin-right: 8px; }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr; }
          .fp-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
};

export default HomePage;
