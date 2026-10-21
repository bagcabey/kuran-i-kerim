import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { Server } from 'http';
import { app } from '../../server/index.js';

describe('Server Security & Health Suite', () => {
  let server: Server;
  let baseUrl = '';

  beforeAll(async () => {
    await new Promise<void>((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        const addr = server.address();
        if (addr && typeof addr === 'object') {
          baseUrl = `http://127.0.0.1:${addr.port}`;
        }
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('GET /healthz returns 200 with security headers and healthy status', async () => {
    const res = await fetch(`${baseUrl}/healthz`);
    expect(res.status).toBe(200);

    // Verify Helmet security headers
    expect(res.headers.get('x-content-type-options')).toBe('nosniff');

    const data = await res.json();
    expect(data.status).toBe('healthy');
    expect(data.service).toBe('tilavet-akademisi-api');
    expect(data.version).toBe('1.0.0');
  });

  it('rejects unauthenticated requests to protected endpoints (401)', async () => {
    const res = await fetch(`${baseUrl}/api/tilavet/attempts`);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('unauthorized');
  });

  it('enforces 404 on unknown routes', async () => {
    const res = await fetch(`${baseUrl}/api/tilavet/nonexistent_route`);
    expect(res.status).toBe(404);
  });
});
