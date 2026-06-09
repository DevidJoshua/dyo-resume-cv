import { FiMail, FiLinkedin, FiGithub, FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { SiteSetting } from '../../types';

const Footer = () => {
  const [settings, setSettings] = useState<SiteSetting | null>(null);

  useEffect(() => {
    api.get('/site').then((res) => setSettings(res.data)).catch(() => {});
  }, []);

  const socialLinks = [
    { icon: <FiLinkedin />, url: settings?.linkedinUrl, label: 'LinkedIn' },
    { icon: <FiGithub />, url: settings?.githubUrl, label: 'GitHub' },
    { icon: <FaWhatsapp />, url: settings?.whatsapp, label: 'WhatsApp' },
    { icon: <FiMail />, url: settings?.email ? `mailto:${settings.email}` : null, label: 'Email' },
    { icon: <FiPhone />, url: settings?.phone ? `tel:${settings.phone}` : null, label: 'Phone' },
  ].filter(s => s.url);

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="navbar-logo">
            <span className="navbar-logo-dot" />
            {settings?.siteName || 'Devid Joshua'}
          </span>
          <p>Full-Stack Software Engineer & System Architect</p>
        </div>
        <div className="footer-social">
          {socialLinks.map((link) => (
            <a key={link.label} href={link.url!} target="_blank" rel="noopener noreferrer" className="footer-social-link">
              {link.icon}
            </a>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} {settings?.siteName || 'Devid Joshua'}. All rights reserved.</p>
        </div>
      </div>
      <style>{`
        .footer {
          background: var(--bg-secondary);
          border-top: 1px solid var(--border);
          padding-top: 60px;
        }
        .footer-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 30px;
          padding-bottom: 40px;
        }
        .footer-brand p {
          color: var(--text-secondary);
          margin-top: 10px;
          font-size: 14px;
        }
        .footer-social {
          display: flex;
          gap: 16px;
        }
        .footer-social-link {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--card-bg);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: var(--text);
          transition: all var(--transition);
        }
        .footer-social-link:hover {
          background: linear-gradient(135deg, var(--a-1), var(--a-3));
          color: #fff;
          border-color: transparent;
          transform: translateY(-3px);
        }
        .footer-bottom {
          border-top: 1px solid var(--border);
          padding: 20px 0;
          text-align: center;
          font-size: 13px;
          color: var(--text-secondary);
        }
        @media (max-width: 768px) {
          .footer-inner {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
