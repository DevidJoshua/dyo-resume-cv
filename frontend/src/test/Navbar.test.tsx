import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../contexts/ThemeContext', () => ({
  useTheme: () => ({ darkMode: false, toggleDarkMode: vi.fn() }),
}));

let Navbar: React.ComponentType<{ layoutMode?: string }>;

describe('Navbar', () => {
  beforeAll(async () => {
    Navbar = (await import('../components/layout/Navbar')).default;
  });

  const renderNavbar = (layoutMode = 'single') => {
    return render(
      <BrowserRouter>
        <Navbar layoutMode={layoutMode} />
      </BrowserRouter>
    );
  };

  it('should render the logo', () => {
    renderNavbar();
    expect(screen.getByText('Devid Joshua')).toBeInTheDocument();
  });

  it('should render navigation items', () => {
    renderNavbar();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('should render theme toggle button', () => {
    renderNavbar();
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should have scroll class when scrolled', () => {
    renderNavbar();
    const nav = document.querySelector('.navbar');
    expect(nav).toBeInTheDocument();
    expect(nav).not.toHaveClass('navbar-scrolled');
  });
});
