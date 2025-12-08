import 'dotenv/config.js';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_EVN !== 'production') {
  globalForPrisma.Prisma = prisma;
}


export default prisma;
