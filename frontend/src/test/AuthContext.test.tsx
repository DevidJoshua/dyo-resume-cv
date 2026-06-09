import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

const { mockApi } = vi.hoisted(() => {
  const mockApi = {
    post: vi.fn(),
    get: vi.fn().mockResolvedValue({ data: { id: 1, username: 'admin' } }),
  };
  return { mockApi };
});

vi.mock('../services/api', () => ({
  default: mockApi,
}));

const TestComponent = () => {
  const { isAuthenticated, login, logout, user } = useAuth();
  return (
    <div>
      <span data-testid="auth">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</span>
      {user && <span data-testid="user">{user.username}</span>}
      <button data-testid="login-btn" onClick={() => login('admin', 'pass')}>Login</button>
      <button data-testid="logout-btn" onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should start unauthenticated', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('auth').textContent).toBe('not-authenticated');
  });

  it('should login successfully', async () => {
    mockApi.post.mockResolvedValue({
      data: { token: 'test-token', user: { id: 1, username: 'admin' } },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId('login-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('auth').textContent).toBe('authenticated');
    });
    expect(localStorage.getItem('token')).toBe('test-token');
  });

  it('should logout and clear token', async () => {
    mockApi.get.mockResolvedValue({ data: { id: 1, username: 'admin' } });
    localStorage.setItem('token', 'existing-token');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth').textContent).toBe('authenticated');
    });

    fireEvent.click(screen.getByTestId('logout-btn'));

    expect(screen.getByTestId('auth').textContent).toBe('not-authenticated');
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should throw error when useAuth used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow();
    consoleSpy.mockRestore();
  });
});
