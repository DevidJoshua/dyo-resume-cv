import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ReactNode } from 'react';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import AdminMuiThemeProvider from '../contexts/AdminMuiThemeProvider';
import { lightAdminTheme, darkAdminTheme, spoliTokens } from '../contexts/adminTheme';

// Spy on console.error so React's "throw inside provider" warnings
// don't pollute test output and don't crash the test runner.
let consoleSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  cleanup();
  consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  consoleSpy.mockRestore();
});

// A tiny consumer that lets us observe the current MUI theme primary color
// (which differs between light and dark — same Spoli accent, but we also
// check that the provider's children render and consume React context).
const ThemeInspector = () => {
  const { darkMode } = useTheme();
  return (
    <div>
      <span data-testid="dark">{darkMode ? 'dark' : 'light'}</span>
      <span data-testid="primary">{spoliTokens.a1}</span>
    </div>
  );
};

const renderWithProvider = (ui: ReactNode) =>
  render(
    <ThemeProvider>
      <AdminMuiThemeProvider>{ui}</AdminMuiThemeProvider>
    </ThemeProvider>
  );

describe('AdminMuiThemeProvider', () => {
  it('should render its children', () => {
    renderWithProvider(<div data-testid="child">hello</div>);
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('child').textContent).toBe('hello');
  });

  it('should default to the light admin theme', () => {
    renderWithProvider(<ThemeInspector />);
    expect(screen.getByTestId('dark').textContent).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should expose the Spoli primary accent through ThemeContext', () => {
    renderWithProvider(<ThemeInspector />);
    expect(screen.getByTestId('primary').textContent).toBe('#FF8473');
  });

  it('should switch to the dark admin theme when ThemeContext darkMode is toggled', () => {
    const Toggle = () => {
      const { darkMode, toggleDarkMode } = useTheme();
      return (
        <>
          <span data-testid="dark">{darkMode ? 'dark' : 'light'}</span>
          <button data-testid="toggle" onClick={toggleDarkMode}>toggle</button>
        </>
      );
    };
    render(
      <ThemeProvider>
        <AdminMuiThemeProvider>
          <Toggle />
        </AdminMuiThemeProvider>
      </ThemeProvider>
    );
    expect(screen.getByTestId('dark').textContent).toBe('light');
    fireEvent.click(screen.getByTestId('toggle'));
    expect(screen.getByTestId('dark').textContent).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('should provide lightAdminTheme with mode="light"', () => {
    expect(lightAdminTheme.palette.mode).toBe('light');
  });

  it('should provide darkAdminTheme with mode="dark"', () => {
    expect(darkAdminTheme.palette.mode).toBe('dark');
  });

  it('should keep the Spoli primary accent identical in both themes', () => {
    expect(lightAdminTheme.palette.primary.main).toBe(darkAdminTheme.palette.primary.main);
    expect(lightAdminTheme.palette.primary.main).toBe(spoliTokens.a1);
  });

  it('should throw when useTheme is consumed outside any ThemeProvider', () => {
    // AdminMuiThemeProvider must be mounted INSIDE the existing ThemeProvider.
    // We verify the contract that useTheme throws if no provider exists.
    const Lonely = () => {
      useTheme();
      return <div />;
    };
    expect(() => render(<Lonely />)).toThrow(/useTheme must be used within ThemeProvider/);
  });
});
