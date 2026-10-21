import type { Request, Response, NextFunction, RequestHandler } from 'express';
import crypto from 'crypto';

/**
 * Async rota işleyicileri için hata sarmalayıcı (Async Handler).
 * Express 4'te async hataların yakalanmadan sürecin düşmesini engeller.
 */
export const ah = (fn: (req: any, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/**
 * Merkezi hata işleyici (Error Handler).
 * UUID'li hata loglama ve güvenli hata yanıtları sağlar.
 */
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const id = crypto.randomUUID();
  console.error(JSON.stringify({ level: 'error', id, msg: err?.message, stack: err?.stack }));

  // Postgres 22P02: Geçersiz text gösterimi (örn. hatalı UUID formatı)
  if (err?.code === '22P02') {
    return res.status(400).json({ error: 'bad_id', id });
  }

  // Postgres 23505: Unique constraint violation
  if (err?.code === '23505') {
    return res.status(409).json({ error: 'conflict', id });
  }

  res.status(500).json({ error: 'internal', id });
}
