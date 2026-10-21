import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export type Role = 'student' | 'teacher' | 'content_editor' | 'expert_reviewer' | 'admin';

export interface AuthedRequest extends Request {
  user?: { id: string; role: Role };
}


const COOKIE = 'tl_session';
const SECRET = process.env.SESSION_SECRET || 'dev_secret_key_minimum_32_characters_for_tilavet_akademi_jwt';

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  // Geliştirme kolaylığı: yalnızca AÇIKÇA izin verilmişse ve production değilse
  if (process.env.NODE_ENV !== 'production' && process.env.TL_DEV_AUTH === '1') {
    const devUserId = req.header('x-user-id');
    if (devUserId && /^[0-9a-f-]{36}$/i.test(devUserId)) {
      req.user = { id: devUserId, role: 'student' }; // rol başlıktan ASLA alınmaz
      return next();
    }
  }

  // Token çerezden veya Authorization başlığından alınır
  let token = req.cookies?.[COOKIE];
  if (!token) {
    const authHeader = req.header('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    const p = jwt.verify(token, SECRET, { algorithms: ['HS256'] }) as { sub: string; role: Role };
    req.user = { id: p.sub, role: p.role };
    next();
  } catch {
    res.status(401).json({ error: 'unauthorized' });
  }
}

// Rol veritabanından/token'dan doğrulanır; asla istemci başlığından alınamaz.
export const requireRole = (...roles: Role[]) =>
  (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'forbidden' });
    }
    next();
  };
