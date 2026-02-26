import aj from '../config/arcject.js';
import logger from '../config/logger.js';
import { slidingWindow } from '@arcjet/node';
import type { NextFunction, Request, Response } from 'express';

const securityMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const role = req.user?.role || 'guest';

    let limit;
    let message;

    switch (role) {
      case 'ADMIN':
        limit = 20;
        message = 'ADMIN request limit exceeded (20 minute). slow down';
        break;
      case 'USER':
        limit = 10;
        message = 'USER request limit exceeded (10 per minute). Slow down.';
        break;
      case 'guest':
        limit = 5;
        message = 'Guest request limit exceeded (5 minute). slow down';
        break;

      default:
        limit = 5;
        // eslint-disable-next-line no-unused-vars
        message = 'Guest request limit exceeded (5 minute). slow down';
    }

    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max: limit,
      })
    );

    const decision = await client.protect(req as any, {
      requested: 0
    });
    if (decision.isDenied() && decision.reason?.isBot()) {
      logger.warn('Bot request blocked', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.status(403).json({
        error: 'Forbidden',
        message: 'Automated requests are not allowed',
      });
      return;
    }
    if (decision.isDenied() && decision.reason?.isShield()) {
      logger.warn('Shield blocked request ', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
      });

      res.status(403).json({
        error: 'Forbidden',
        message: 'Automated requests are not allowed',
      });
      return;
    }
    if (decision.isDenied() && decision.reason?.isRateLimit()) {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.status(403).json({
        error: 'Forbidden',
        message: 'Too many request',
      });
      return;
    }
    next();
  } catch (error) {
    console.error('Arcjet middleware error', error);

    res.status(500).json({
      error: 'Internal  server error',
      message: 'something went wrong with security',
    });
  }
};

export default securityMiddleware;
