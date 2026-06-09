import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

const TestComponent = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  return (
    <div>
      <span data-testid="mode">{darkMode ? 'dark' : 'light'}</span>
      <button data-testid="toggle" onClick={toggleDarkMode}>Toggle</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('should default to light mode', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('mode').textContent).toBe('light');
  });

  it('should toggle to dark mode', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByTestId('toggle'));
    expect(screen.getByTestId('mode').textContent).toBe('dark');
  });

  it('should persist dark mode in localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByTestId('toggle'));
    expect(localStorage.getItem('darkMode')).toBe('true');
  });

  it('should set data-theme attribute on html element', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByTestId('toggle'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('should remove dark class when toggling back to light', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByTestId('toggle'));
    fireEvent.click(screen.getByTestId('toggle'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(screen.getByTestId('mode').textContent).toBe('light');
  });

  it('should throw error when useTheme used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow();
    consoleSpy.mockRestore();
  });
});
