import type { CookieOptions, Request, Response } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

export const cookies = {
  getOptions: (): CookieOptions => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
    path: '/',
  }),
  set: (res: Response, name: string, value: string, options: CookieOptions = {}) => {
    res.cookie(name, value, { ...cookies.getOptions(), ...options });
  },

  clear: (res: Response, name: string, options: CookieOptions = {}) => {
    res.clearCookie(name, { ...cookies.getOptions(), ...options });
  },
  get: (req: Request, name: string): string | undefined => {
    return req.cookies?.[name];
  },
};
