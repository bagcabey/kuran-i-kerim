import { Router } from 'express';
import { recitersRouter } from './reciters.js';
import { qfRouter } from './quranFoundation.js';
import { progressRouter } from './progress.js';
import { srsRouter } from './srs.js';
import { attemptsRouter } from './attempts.js';
import { teacherRouter } from './teacher.js';
import rateLimit from 'express-rate-limit';

export const tilavetRouter = Router();
tilavetRouter.use(rateLimit({ windowMs: 60_000, limit: 120 }));
tilavetRouter.use('/reciters', recitersRouter);
tilavetRouter.use('/qf', qfRouter);
tilavetRouter.use('/progress', progressRouter);
tilavetRouter.use('/srs', srsRouter);
tilavetRouter.use('/attempts', attemptsRouter);
tilavetRouter.use('/teacher', teacherRouter);
