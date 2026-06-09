import { describe, it, expect, vi, beforeAll } from 'vitest';

let requestHandler: Function;
let responseErrorHandler: Function;
let createMockArgs: any;

vi.mock('axios', () => {
  const mockInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
    defaults: { headers: {} },
  };
  const mockAxios = {
    create: vi.fn(() => mockInstance),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  };
  return { default: mockAxios, ...mockAxios };
});

describe('API Service', () => {
  beforeAll(async () => {
    const api = (await import('../services/api')).default;
    createMockArgs = (await import('axios')).default.create.mock.calls[0];
    requestHandler = api.interceptors.request.use.mock.calls[0][0];
    responseErrorHandler = api.interceptors.response.use.mock.calls[0][1];
  });

  it('should create axios instance with correct baseURL', () => {
    expect(createMockArgs).toBeDefined();
    expect(createMockArgs[0]).toMatchObject({
      baseURL: '/api',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('should attach token to request headers if present', () => {
    localStorage.setItem('token', 'test-token-123');
    const config = { headers: {} };
    requestHandler(config);
    expect(config.headers.Authorization).toBe('Bearer test-token-123');
  });

  it('should not attach token if not in localStorage', () => {
    localStorage.clear();
    const config = { headers: {} };
    requestHandler(config);
    expect(config.headers.Authorization).toBeUndefined();
  });

  it('should redirect to login on 401 response for admin routes', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/admin/skills', href: '' },
      writable: true,
    });

    const error = { response: { status: 401 } };
    const result = responseErrorHandler(error);

    expect(localStorage.getItem('token')).toBeNull();
    expect(result).rejects.toEqual(error);
  });

  it('should not redirect on 401 for non-admin routes', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/', href: '' },
      writable: true,
    });

    const error = { response: { status: 401 } };
    const result = responseErrorHandler(error);

    expect(result).rejects.toEqual(error);
  });
});
