import logger from '#config/logger.js';
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET

const JWT_EXPRIES_IN = '1d';

if(!JWT_SECRET) {
  throw new Error('JWT_SECRET is required')
}

export const jwtToken = {
  sign: payload => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPRIES_IN });
    } catch (error) {
      logger.error('Failed to sign token', error);
      throw new Error('Failed to authenticate');
    }
  },
  verify: (token) => {
    try {

      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger.error('Failed to authenticate token', error);
      throw new Error('Failed to authenticate token');
    }
  },
};
