import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { tilavetRouter } from './tilavet/router.js';
import { errorHandler } from './tilavet/http.js';

export const app = express();

// Güvenlik başlıkları (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        mediaSrc: ["'self'", 'blob:', 'data:', 'https://*.mp3quran.net', 'https://*.quran.foundation'],
        connectSrc: ["'self'", 'https://*.mp3quran.net', 'https://*.quran.foundation'],
        imgSrc: ["'self'", 'data:', 'blob:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Çerez ayrıştırıcı
app.use(cookieParser());

// JSON ayrıştırıcı (Katı 64 KB limiti: Ham PCM/WAV ses verisi akıtılması KESİNLİKLE engellenir)
app.use(express.json({ limit: '64kb' }));
app.use(express.urlencoded({ extended: true, limit: '64kb' }));

// Liveness ve Readiness Sağlık Kontrolü
app.get('/healthz', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'tilavet-akademisi-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Tilavet Akademisi API Yönlendiricisi
app.use('/api/tilavet', tilavetRouter);

// 404 Bilinmeyen Rota Yakalayıcı
app.use((_req, res) => {
  res.status(404).json({ error: 'not_found', message: 'İstenen kaynak bulunamadı' });
});

// Merkezi Hata Yakalayıcı (Audit P0-2)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`[Tilavet Akademisi] API Sunucusu port ${PORT} üzerinde hazır.`);
  });

  const shutdown = () => {
    console.log('[Tilavet Akademisi] Kapatma sinyali alındı, sunucu durduruluyor...');
    server.close(() => {
      console.log('[Tilavet Akademisi] Sunucu güvenle kapatıldı.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}
