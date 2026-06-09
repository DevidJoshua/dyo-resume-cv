import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';

interface Props {
  layoutMode?: 'single' | 'multiple';
}

const Navbar = ({ layoutMode = 'single' }: Props) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Home', href: layoutMode === 'multiple' ? '/' : '#home', onClick: layoutMode === 'single' ? () => scrollTo('home') : undefined },
    { label: 'About', href: layoutMode === 'multiple' ? '/about' : '#about', onClick: layoutMode === 'single' ? () => scrollTo('about') : undefined },
    { label: 'Skills', href: layoutMode === 'multiple' ? '/skills' : '#skills', onClick: layoutMode === 'single' ? () => scrollTo('skills') : undefined },
    { label: 'Portfolio', href: layoutMode === 'multiple' ? '/portfolio' : '#portfolio', onClick: layoutMode === 'single' ? () => scrollTo('portfolio') : undefined },
    { label: 'Contact', href: layoutMode === 'multiple' ? '/contact' : '#contact', onClick: layoutMode === 'single' ? () => scrollTo('contact') : undefined, cta: true },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <span className="navbar-logo-dot" />
          Devid Joshua
        </Link>
        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            item.onClick ? (
              <button key={item.label} onClick={item.onClick} className={item.cta ? 'btn btn-primary nav-cta' : ''}>
                {item.label}
              </button>
            ) : (
              <Link key={item.label} to={item.href} className={item.cta ? 'btn btn-primary nav-cta' : ''} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            )
          ))}
        </div>
        <div className="navbar-actions">
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 20px 0;
          transition: all var(--transition);
        }
        .navbar-scrolled {
          background: var(--bg);
          box-shadow: 0 2px 20px rgba(0,0,0,0.1);
          padding: 12px 0;
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .navbar-logo {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .navbar-logo-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--a-1), var(--a-3));
          display: inline-block;
        }
        .navbar-menu {
          display: flex;
          align-items: center;
          gap: 30px;
        }
        .navbar-menu button, .navbar-menu a {
          background: none;
          border: none;
          color: var(--text);
          font-family: var(--font-heading);
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: color var(--transition);
          text-decoration: none;
        }
        .navbar-menu button:not(.btn):hover, .navbar-menu a:not(.btn):hover {
          color: var(--a-1);
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .theme-toggle, .menu-toggle {
          background: none;
          border: none;
          color: var(--text);
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 8px;
          border-radius: 50%;
          transition: all var(--transition);
        }
        .theme-toggle:hover, .menu-toggle:hover {
          background: var(--bg-secondary);
        }
        .menu-toggle { display: none; }
        .nav-cta { font-size: 13px; padding: 10px 24px; }
        @media (max-width: 768px) {
          .menu-toggle { display: flex; }
          .navbar-menu {
            position: fixed;
            top: 0;
            right: -100%;
            width: 280px;
            height: 100vh;
            background: var(--card-bg);
            flex-direction: column;
            padding: 80px 30px 30px;
            gap: 20px;
            transition: right 0.3s ease;
            box-shadow: -5px 0 30px rgba(0,0,0,0.15);
            align-items: flex-start;
          }
          .navbar-menu.open { right: 0; }
          .nav-cta { width: 100%; justify-content: center; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
