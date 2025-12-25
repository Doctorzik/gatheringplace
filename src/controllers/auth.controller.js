import logger from '#config/logger.js';
import { createUser, getUser } from '#services/auth.service.js';
import { formatValidationErrors } from '#utils/format.js';
import { signUpSchema, signInSchema } from '#validations/auth.validation.js';
import { jwtToken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

export const signup = async (req, res, next) => {
  try {
    const validationResult = signUpSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: formatValidationErrors(validationResult.error),
      });
    }

    const { name, email, role, password } = validationResult.data;

    // Auth Service
    const user = await createUser({ name, email, password, role });

    // Once there is a user, call the jwtToken to send token to the client

    const token = jwtToken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);
    logger.info(`'User registered Successfully  ${email}`);

    res.status(200).json({
      message: 'User registered',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    logger.error('Signup error', error);
    if (error.message === 'Error creating User') {
      return res.status(409).json({ error: 'User already exist' });
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const validateResult = signInSchema.safeParse(req.body);

    if (!validateResult.success) {
      return res.status(400).json({
        error: 'Validation Error',
        details: formatValidationErrors(validateResult.error),
      });
    }

    const { email, password } = validateResult.data;

    const user = await getUser({
      email,
      password,
    });
    const token = jwtToken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    cookies.set(res, 'token', token);

    return res.status(200).json({
      message: 'Login successful',
      user,
    });
  } catch (error) {
    logger.error('Error logon in', error);

    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    cookies.clear(res, 'token');
    res.status(200).json({
      message: 'User signed out successfully',
    });
    next();
  } catch (error) {
    logger.error('Error logging out', error);
    throw new Error('Errow siging Out');
  }
};
