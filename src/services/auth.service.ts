import { prisma } from '../config/database.js';
import logger from '../config/logger.js';
import bcrypt from 'bcrypt';
import type { Role } from '@prisma/client';

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role?: string;
};

type CreatedUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: Date;
};

type GetUserInput = {
  email: string;
  password: string;
};

type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
};

export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error('Error hashing the password:', error);
    throw new Error('Error hashing password');
  }
};

const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    logger.error('Error comparing the password', error);
    throw new Error('Error comparing password');
  }
};

export const createUser = async ({
  name,
  email,
  password,
}: CreateUserInput): Promise<CreatedUser> => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: `${email}`,
      },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, password: passwordHash },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    logger.info('User', user.email, 'created successfully');
    return user;
  } catch (error) {
    logger.error('Error creating User', error);
    throw new Error('Error creating User');
  }
};

// LOGIN USER

export const getUser = async ({
  email,
  password,
}: GetUserInput): Promise<AuthenticatedUser> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: `${email}`,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid Credential');
    }
    logger.info(`User ${user.email} authenticated successfully`);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  } catch (error) {
    logger.error('Error getting user in', error);
    throw new Error('Error getting In');
  }
};
