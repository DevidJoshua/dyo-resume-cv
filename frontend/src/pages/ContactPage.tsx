import { useState, useEffect } from 'react';
import api from '../services/api';
import { SiteSetting } from '../types';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiSend, FiMail, FiPhone, FiExternalLink, FiGithub } from 'react-icons/fi';

const ContactPage = () => {
  const [settings, setSettings] = useState<SiteSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    api.get('/site').then((res) => setSettings(res.data)).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await api.post('/contact', form); setSent(true); setForm({ name: '', email: '', subject: '', message: '' }); }
    catch { /* ignore */ }
  };

  if (loading) return <><Navbar layoutMode="multiple" /><LoadingSpinner /><Footer /></>;

  return (
    <>
      <Navbar layoutMode="multiple" />
      <main>
        <section className="mp-section">
          <div className="container">
            <div className="mp-header">
              <h1 className="section-title">Get In Touch</h1>
              <p className="section-subtitle">Have a project in mind? Let's talk</p>
            </div>
            <div className="mp-contact-grid">
              <div className="mp-contact-info">
                <h3>Contact Information</h3>
                <div className="mp-contact-list">
                  {settings?.email && <div className="mp-contact-item"><FiMail /> <span>{settings.email}</span></div>}
                  {settings?.phone && <div className="mp-contact-item"><FiPhone /> <span>{settings.phone}</span></div>}
                  {settings?.linkedinUrl && <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="mp-contact-item"><FiExternalLink /> LinkedIn</a>}
                  {settings?.githubUrl && <a href={settings.githubUrl} target="_blank" rel="noopener noreferrer" className="mp-contact-item"><FiGithub /> GitHub</a>}
                </div>
              </div>
              <form className="mp-contact-form" onSubmit={handleSubmit}>
                {sent ? (
                  <div className="mp-contact-success">
                    <h3>Message Sent!</h3>
                    <p>Thank you for reaching out. I'll get back to you soon.</p>
                    <button type="button" className="btn btn-primary" onClick={() => setSent(false)}>Send Another</button>
                  </div>
                ) : (
                  <>
                    <div className="form-group"><input className="form-input" placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                    <div className="form-group"><input className="form-input" type="email" placeholder="Your Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
                    <div className="form-group"><input className="form-input" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
                    <div className="form-group"><textarea className="form-textarea" placeholder="Your Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required /></div>
                    <button type="submit" className="btn btn-primary"><FiSend /> Send Message</button>
                  </>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <style>{`
        .mp-section { padding: 140px 0 80px; }
        .mp-header { text-align: center; margin-bottom: 50px; }
        .mp-contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 50px; align-items: start; }
        .mp-contact-info h3 { margin-bottom: 20px; }
        .mp-contact-list { display: flex; flex-direction: column; gap: 16px; }
        .mp-contact-item {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 20px; background: var(--card-bg);
          border: 1px solid var(--border); border-radius: 12px;
          font-size: 14px; color: var(--text); transition: all var(--transition);
        }
        .mp-contact-item:hover { border-color: var(--a-1); }
        .mp-contact-item svg { color: var(--a-1); font-size: 18px; }
        .mp-contact-form { display: flex; flex-direction: column; gap: 0; }
        .mp-contact-success { text-align: center; padding: 40px; }
        .mp-contact-success h3 { color: var(--a-1); margin-bottom: 10px; }
        .mp-contact-success p { color: var(--text-secondary); margin-bottom: 20px; }
        @media (max-width: 768px) { .mp-contact-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
};

export default ContactPage;
