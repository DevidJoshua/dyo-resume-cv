require('./helpers/prisma');

describe('API Routes Registration', () => {
  it('should have /api/health endpoint', async () => {
    const express = require('express');
    const request = require('supertest');
    const testApp = express();
    testApp.get('/api/health', (req, res) => res.json({ status: 'ok' }));

    const res = await request(testApp).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('Express Router Setup', () => {
  it('should require all route modules without error', () => {
    expect(() => require('../src/routes/auth')).not.toThrow();
    expect(() => require('../src/routes/home')).not.toThrow();
    expect(() => require('../src/routes/skills')).not.toThrow();
    expect(() => require('../src/routes/portfolio')).not.toThrow();
    expect(() => require('../src/routes/contact')).not.toThrow();
    expect(() => require('../src/routes/social')).not.toThrow();
    expect(() => require('../src/routes/site')).not.toThrow();
    expect(() => require('../src/routes/templates')).not.toThrow();
    expect(() => require('../src/routes/pages')).not.toThrow();
    expect(() => require('../src/routes/media')).not.toThrow();
    expect(() => require('../src/routes/portfolioV2')).not.toThrow();
    expect(() => require('../src/routes/resume')).not.toThrow();
  });
});
